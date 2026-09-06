import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '@/i18n';
import { drawLineChart, mulberry32, readPalette, setupCanvas } from './canvas';

const SIZE = 6;
const WALLS = new Set(['1,1', '1,2', '3,3', '4,1', '2,4']);
const PIT = '3,1';
const GOAL = `${SIZE - 1},${SIZE - 1}`;
const ACTIONS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
] as const; // up, right, down, left
const ARROWS = ['↑', '→', '↓', '←'];
const MAX_STEPS = 60;

type Q = Float64Array; // SIZE*SIZE*4

function idx(x: number, y: number, a: number) {
  return (y * SIZE + x) * 4 + a;
}

function stepEnv(x: number, y: number, a: number): { nx: number; ny: number; reward: number; done: boolean } {
  const [dx, dy] = ACTIONS[a];
  let nx = x + dx;
  let ny = y + dy;
  if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE || WALLS.has(`${nx},${ny}`)) {
    nx = x;
    ny = y;
  }
  const key = `${nx},${ny}`;
  if (key === GOAL) return { nx, ny, reward: 1, done: true };
  if (key === PIT) return { nx, ny, reward: -1, done: true };
  return { nx, ny, reward: -0.02, done: false };
}

const TEXT = {
  en: {
    explain:
      'The agent starts top-left and must reach the goal (★) while avoiding the pit (✖) and walls. It knows nothing at first. Each move costs a little (−0.02), the pit costs −1, the goal gives +1. It learns a table of values (one per square and direction) from rewards alone: this is tabular Q-learning. Exploration (epsilon) is how often it tries a random move instead of its current best guess. Arrows show its current best guess per square.',
    watch: 'Watch the trained agent',
    trainFast: 'Train 200 episodes',
    episodes: 'Episodes',
    lastReward: 'Last episode reward',
    avgReward: 'Average of last 20',
    stepsTaken: 'Steps in last episode',
    chartLabel: 'Reward per episode (single) and 20-episode average',
    note: 'This is a preview of Stage 8. The real lessons build this environment in Python step by step, then connect it to a game.',
    running: 'Running one episode…',
  },
  he: {
    explain:
      'הסוכן מתחיל למעלה משמאל וצריך להגיע ליעד (★) בלי ליפול לבור (✖) ובלי להיתקל בקירות. בהתחלה הוא לא יודע כלום. כל מהלך עולה קצת (−0.02), הבור עולה −1, היעד נותן +1. הוא לומד טבלת ערכים (אחד לכל משבצת וכיוון) מתגמולים בלבד: זהו Q-learning טבלאי. חקירה (epsilon) היא התדירות שבה הוא מנסה מהלך אקראי במקום הניחוש הטוב ביותר שלו כרגע. החצים מראים את הניחוש הטוב ביותר הנוכחי לכל משבצת.',
    watch: 'צפו בסוכן המאומן',
    trainFast: 'אימון 200 אפיזודות',
    episodes: 'אפיזודות',
    lastReward: 'תגמול באפיזודה האחרונה',
    avgReward: 'ממוצע 20 האחרונות',
    stepsTaken: 'צעדים באפיזודה האחרונה',
    chartLabel: 'תגמול לכל אפיזודה (בודד) וממוצע של 20 אפיזודות',
    note: 'זו תצוגה מקדימה של שלב 8. בשיעורים האמיתיים בונים את הסביבה הזאת בפייתון צעד אחר צעד, ואז מחברים אותה למשחק.',
    running: 'מריץ אפיזודה אחת…',
  },
};

export function GridWorldLab() {
  const { t, lang } = useI18n();
  const T = TEXT[lang] ?? TEXT.en;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const qRef = useRef<Q>(new Float64Array(SIZE * SIZE * 4));
  const rndRef = useRef(mulberry32(42));
  const [epsilon, setEpsilon] = useState(0.2);
  const [alpha, setAlpha] = useState(0.3);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [rewards, setRewards] = useState<number[]>([]);
  const [lastSteps, setLastSteps] = useState(0);
  const [busy, setBusy] = useState(false);
  const [version, setVersion] = useState(0);
  const gamma = 0.95;

  const choose = useCallback(
    (x: number, y: number, eps: number) => {
      const q = qRef.current;
      if (rndRef.current() < eps) return Math.floor(rndRef.current() * 4);
      let best = 0;
      for (let a = 1; a < 4; a += 1) if (q[idx(x, y, a)] > q[idx(x, y, best)]) best = a;
      return best;
    },
    [],
  );

  /** Run one full episode instantly (no animation). */
  const runEpisode = useCallback(
    (eps: number, learn: boolean): { total: number; steps: number } => {
      const q = qRef.current;
      let x = 0;
      let y = 0;
      let total = 0;
      let steps = 0;
      for (; steps < MAX_STEPS; steps += 1) {
        const a = choose(x, y, eps);
        const { nx, ny, reward, done } = stepEnv(x, y, a);
        total += reward;
        if (learn) {
          let maxNext = -Infinity;
          for (let b = 0; b < 4; b += 1) maxNext = Math.max(maxNext, q[idx(nx, ny, b)]);
          const target = done ? reward : reward + gamma * maxNext;
          q[idx(x, y, a)] += alpha * (target - q[idx(x, y, a)]);
        }
        x = nx;
        y = ny;
        if (done) {
          steps += 1;
          break;
        }
      }
      return { total, steps };
    },
    [alpha, choose],
  );

  const trainMany = (n: number) => {
    const rs: number[] = [];
    let last = 0;
    for (let i = 0; i < n; i += 1) {
      const r = runEpisode(epsilon, true);
      rs.push(r.total);
      last = r.steps;
    }
    setRewards((prev) => [...prev, ...rs].slice(-400));
    setLastSteps(last);
    setPos({ x: 0, y: 0 });
    setVersion((v) => v + 1);
  };

  /** Animated episode: learn while moving (or greedy playback when eps = 0). */
  const animate = (eps: number, learn: boolean) => {
    if (busy) return;
    setBusy(true);
    const q = qRef.current;
    let x = 0;
    let y = 0;
    let total = 0;
    let steps = 0;
    setPos({ x, y });
    const timer = window.setInterval(() => {
      const a = choose(x, y, eps);
      const { nx, ny, reward, done } = stepEnv(x, y, a);
      total += reward;
      if (learn) {
        let maxNext = -Infinity;
        for (let b = 0; b < 4; b += 1) maxNext = Math.max(maxNext, q[idx(nx, ny, b)]);
        const target = done ? reward : reward + gamma * maxNext;
        q[idx(x, y, a)] += alpha * (target - q[idx(x, y, a)]);
      }
      x = nx;
      y = ny;
      steps += 1;
      setPos({ x, y });
      setVersion((v) => v + 1);
      if (done || steps >= MAX_STEPS) {
        window.clearInterval(timer);
        setRewards((prev) => [...prev, total].slice(-400));
        setLastSteps(steps);
        setBusy(false);
      }
    }, 120);
  };

  const reset = () => {
    qRef.current = new Float64Array(SIZE * SIZE * 4);
    rndRef.current = mulberry32(42);
    setRewards([]);
    setPos({ x: 0, y: 0 });
    setLastSteps(0);
    setVersion((v) => v + 1);
  };

  const avg = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < rewards.length; i += 1) {
      const slice = rewards.slice(Math.max(0, i - 19), i + 1);
      out.push(slice.reduce((a, b) => a + b, 0) / slice.length);
    }
    return out;
  }, [rewards]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { ctx, w } = setupCanvas(canvas, Math.min(canvas.clientWidth || 360, 360));
    const p = readPalette();
    const cell = Math.min(w, 360) / SIZE;
    const q = qRef.current;
    ctx.clearRect(0, 0, w, cell * SIZE);
    for (let y = 0; y < SIZE; y += 1) {
      for (let x = 0; x < SIZE; x += 1) {
        const key = `${x},${y}`;
        ctx.fillStyle = WALLS.has(key) ? p.grid : p.surface;
        ctx.fillRect(x * cell, y * cell, cell, cell);
        ctx.strokeStyle = p.grid;
        ctx.lineWidth = 1;
        ctx.strokeRect(x * cell, y * cell, cell, cell);
        ctx.font = `${Math.round(cell * 0.4)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (key === GOAL) {
          ctx.fillStyle = p.series3;
          ctx.fillText('★', x * cell + cell / 2, y * cell + cell / 2);
        } else if (key === PIT) {
          ctx.fillStyle = p.series2;
          ctx.fillText('✖', x * cell + cell / 2, y * cell + cell / 2);
        } else if (!WALLS.has(key)) {
          let best = 0;
          let any = false;
          for (let a = 0; a < 4; a += 1) {
            if (q[idx(x, y, a)] !== 0) any = true;
            if (q[idx(x, y, a)] > q[idx(x, y, best)]) best = a;
          }
          if (any) {
            const v = q[idx(x, y, best)];
            ctx.fillStyle = v > 0 ? p.series1 : p.textMuted;
            ctx.globalAlpha = Math.min(1, 0.35 + Math.abs(v));
            ctx.fillText(ARROWS[best], x * cell + cell / 2, y * cell + cell / 2);
            ctx.globalAlpha = 1;
          }
        }
      }
    }
    // agent
    ctx.beginPath();
    ctx.arc(pos.x * cell + cell / 2, pos.y * cell + cell / 2, cell * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = p.surface;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pos.x * cell + cell / 2, pos.y * cell + cell / 2, cell * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = p.series1;
    ctx.fill();
  }, [pos, version]);

  useEffect(() => {
    if (!chartRef.current) return;
    const p = readPalette();
    drawLineChart(
      chartRef.current,
      [
        { values: rewards, color: p.series2, label: t('labs.reward') },
        { values: avg, color: p.series1, label: T.avgReward },
      ],
      { height: 160, xLabel: T.episodes, yMin: -1.6, yMax: 1.1 },
    );
  }, [rewards, avg, t, T.avgReward, T.episodes]);

  return (
    <div className="stack-sm">
      <p>{T.explain}</p>
      <div className="grid-2">
        <canvas ref={canvasRef} className="lab-canvas" style={{ maxWidth: 360 }} role="img" aria-label={t('labs.agent')} />
        <div>
          <div className="small muted">{T.chartLabel}</div>
          <canvas ref={chartRef} className="lab-canvas" role="img" aria-label={T.chartLabel} />
        </div>
      </div>
      <div className="lab-controls">
        <label>
          {t('labs.epsilon')}: <b>{epsilon.toFixed(2)}</b>
          <input type="range" min={0} max={1} step={0.05} value={epsilon} onChange={(e) => setEpsilon(Number(e.target.value))} />
        </label>
        <label>
          {t('labs.learningRate')}: <b>{alpha.toFixed(2)}</b>
          <input type="range" min={0.05} max={1} step={0.05} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} />
        </label>
      </div>
      <div className="lab-controls">
        <button type="button" className="btn btn-sm btn-primary" onClick={() => animate(epsilon, true)} disabled={busy}>
          {t('labs.episode', { n: rewards.length + 1 })}
        </button>
        <button type="button" className="btn btn-sm" onClick={() => trainMany(200)} disabled={busy}>
          {T.trainFast}
        </button>
        <button type="button" className="btn btn-sm" onClick={() => animate(0, false)} disabled={busy}>
          {T.watch}
        </button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={reset} disabled={busy}>
          {t('labs.reset')}
        </button>
        {busy && <span className="small muted">{T.running}</span>}
      </div>
      <div className="stat-row">
        <span className="stat">
          {T.episodes}: <b>{rewards.length}</b>
        </span>
        <span className="stat">
          {T.lastReward}: <b>{rewards.length ? rewards[rewards.length - 1].toFixed(2) : '—'}</b>
        </span>
        <span className="stat">
          {T.avgReward}: <b>{avg.length ? avg[avg.length - 1].toFixed(2) : '—'}</b>
        </span>
        <span className="stat">
          {T.stepsTaken}: <b>{lastSteps}</b>
        </span>
      </div>
      <p className="small muted">{T.note}</p>
    </div>
  );
}
