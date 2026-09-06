import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n';
import { drawLineChart, readPalette, setupCanvas } from './canvas';

/** The "hill" the ball rolls on. A bowl with gentle bumps so the learning rate matters. */
function f(x: number): number {
  return 0.35 * (x - 1.5) * (x - 1.5) + 0.6 * Math.sin(3 * x) + 1.2;
}
function df(x: number): number {
  return 0.7 * (x - 1.5) + 1.8 * Math.cos(3 * x);
}

const X_MIN = -3;
const X_MAX = 6;

const TEXT = {
  en: {
    explain:
      'The curve is a "loss": lower is better. The ball only knows the slope where it stands. Each step it moves a little against the slope (downhill). The learning rate decides how big each step is: too small and it crawls, too big and it overshoots or bounces out. Neural networks learn exactly this way, with millions of positions instead of one.',
    tip: 'Try a learning rate of 0.05, then 0.3, then 0.6. Reset between tries and watch what changes.',
    lossTitle: 'Loss over steps',
  },
  he: {
    explain:
      'העקומה היא "הפסד" (loss): נמוך יותר = טוב יותר. הכדור מכיר רק את השיפוע במקום שבו הוא עומד. בכל צעד הוא זז קצת נגד השיפוע (במורד). קצב הלמידה קובע כמה גדול כל צעד: קטן מדי והוא זוחל, גדול מדי והוא מדלג מעבר או קופץ החוצה. רשתות נוירונים לומדות בדיוק כך, עם מיליוני מיקומים במקום אחד.',
    tip: 'נסו קצב למידה 0.05, אחר כך 0.3, ואז 0.6. אפסו בין הניסיונות וצפו מה משתנה.',
    lossTitle: 'הפסד לאורך הצעדים',
  },
};

export function GradientDescentLab() {
  const { t, lang } = useI18n();
  const T = TEXT[lang] ?? TEXT.en;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lossRef = useRef<HTMLCanvasElement>(null);
  const [lr, setLr] = useState(0.1);
  const [x, setX] = useState(4.6);
  const [trail, setTrail] = useState<number[]>([4.6]);
  const [running, setRunning] = useState(false);

  const step = useCallback(() => {
    setX((cur) => {
      const next = Math.max(X_MIN, Math.min(X_MAX, cur - lr * df(cur)));
      setTrail((tr) => [...tr.slice(-200), next]);
      return next;
    });
  }, [lr]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(step, 350);
    return () => window.clearInterval(id);
  }, [running, step]);

  const reset = () => {
    setRunning(false);
    const start = X_MIN + 0.5 + Math.random() * (X_MAX - X_MIN - 1);
    setX(start);
    setTrail([start]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { ctx, w, h } = setupCanvas(canvas, 280);
    const p = readPalette();
    ctx.clearRect(0, 0, w, h);
    const padL = 36;
    const padB = 24;
    const padT = 12;
    const yMin = 0;
    const yMax = 7;
    const sx = (v: number) => padL + ((v - X_MIN) / (X_MAX - X_MIN)) * (w - padL - 10);
    const sy = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * (h - padT - padB);

    ctx.strokeStyle = p.grid;
    ctx.lineWidth = 1;
    for (let g = 0; g <= 4; g += 1) {
      const yy = padT + (g / 4) * (h - padT - padB);
      ctx.beginPath();
      ctx.moveTo(padL, yy);
      ctx.lineTo(w - 10, yy);
      ctx.stroke();
    }
    ctx.fillStyle = p.textMuted;
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('loss', 4, padT + 8);
    ctx.fillText('position', w - 60, h - 6);

    // curve
    ctx.strokeStyle = p.series1;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 300; i += 1) {
      const xx = X_MIN + (i / 300) * (X_MAX - X_MIN);
      const yy = f(xx);
      if (i === 0) ctx.moveTo(sx(xx), sy(yy));
      else ctx.lineTo(sx(xx), sy(yy));
    }
    ctx.stroke();

    // trail
    ctx.fillStyle = p.series2;
    ctx.globalAlpha = 0.35;
    for (const tx of trail.slice(0, -1)) {
      ctx.beginPath();
      ctx.arc(sx(tx), sy(f(tx)), 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // tangent (slope) line
    const slope = df(x);
    ctx.strokeStyle = p.series3;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    const dx = 0.8;
    ctx.moveTo(sx(x - dx), sy(f(x) - slope * dx));
    ctx.lineTo(sx(x + dx), sy(f(x) + slope * dx));
    ctx.stroke();
    ctx.setLineDash([]);

    // ball with a surface ring
    ctx.beginPath();
    ctx.arc(sx(x), sy(f(x)), 9, 0, Math.PI * 2);
    ctx.fillStyle = p.surface;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(sx(x), sy(f(x)), 7, 0, Math.PI * 2);
    ctx.fillStyle = p.series2;
    ctx.fill();
  }, [x, trail]);

  useEffect(() => {
    if (lossRef.current) drawLineChart(lossRef.current, [{ values: trail.map(f), color: readPalette().series1, label: 'loss' }], { height: 140, xLabel: t('labs.step'), yMin: 0, yMax: 7 });
  }, [trail, t]);

  return (
    <div className="stack-sm">
      <p>{T.explain}</p>
      <canvas ref={canvasRef} className="lab-canvas" role="img" aria-label={t('labs.gradient')} />
      <div className="lab-controls">
        <label>
          {t('labs.learningRate')}: <b>{lr.toFixed(2)}</b>
          <input type="range" min={0.01} max={0.7} step={0.01} value={lr} onChange={(e) => setLr(Number(e.target.value))} />
        </label>
        <button type="button" className="btn btn-sm btn-primary" onClick={step}>
          {t('labs.step')}
        </button>
        <button type="button" className="btn btn-sm" onClick={() => setRunning((r) => !r)}>
          {running ? t('labs.pause') : t('labs.run')}
        </button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={reset}>
          {t('labs.reset')}
        </button>
      </div>
      <div className="stat-row">
        <span className="stat">
          {t('labs.position')}: <b>{x.toFixed(3)}</b>
        </span>
        <span className="stat">
          {t('labs.loss')}: <b>{f(x).toFixed(3)}</b>
        </span>
        <span className="stat">
          {t('labs.slope')}: <b>{df(x).toFixed(3)}</b>
        </span>
        <span className="stat">
          {t('labs.step')}: <b>{trail.length - 1}</b>
        </span>
      </div>
      <p className="small muted">{T.tip}</p>
      <div>
        <div className="small muted">{T.lossTitle}</div>
        <canvas ref={lossRef} className="lab-canvas" role="img" aria-label={T.lossTitle} />
      </div>
    </div>
  );
}
