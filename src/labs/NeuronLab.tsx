import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '@/i18n';
import { mulberry32, readPalette, setupCanvas } from './canvas';

interface Point {
  x: number;
  y: number;
  label: 0 | 1;
}

function makeData(): Point[] {
  const rnd = mulberry32(7);
  const pts: Point[] = [];
  for (let i = 0; i < 40; i += 1) {
    const label = i % 2 === 0 ? 0 : 1;
    const cx = label === 0 ? -1.2 : 1.2;
    const cy = label === 0 ? -0.8 : 0.9;
    pts.push({ x: cx + (rnd() - 0.5) * 2.4, y: cy + (rnd() - 0.5) * 2.4, label: label as 0 | 1 });
  }
  return pts;
}

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

const TEXT = {
  en: {
    explain:
      'A neuron is a tiny function: it multiplies each input by a weight, adds a bias, and squashes the result between 0 and 1. Here it looks at two numbers (x and y) and decides between two groups. The line is where the neuron is exactly undecided (output 0.5). Move the weights by hand, then press Train and watch gradient descent move the line for you.',
    legend0: 'Group A (blue)',
    legend1: 'Group B (orange)',
    tip: 'Training changes the weights a little each round, in the direction that reduces the loss — the same idea as the gradient descent lab.',
  },
  he: {
    explain:
      'נוירון הוא פונקציה זעירה: הוא מכפיל כל קלט במשקל, מוסיף הטיה, ודוחס את התוצאה בין 0 ל-1. כאן הוא מסתכל על שני מספרים (x ו-y) ומחליט בין שתי קבוצות. הקו הוא המקום שבו הנוירון בדיוק לא מחליט (פלט 0.5). הזיזו את המשקלים ביד, ואז לחצו על אימון וצפו איך ירידת הגרדיאנט מזיזה את הקו בשבילכם.',
    legend0: 'קבוצה A (כחול)',
    legend1: 'קבוצה B (כתום)',
    tip: 'האימון משנה את המשקלים קצת בכל סבב, בכיוון שמקטין את ההפסד — אותו רעיון כמו במעבדת ירידת הגרדיאנט.',
  },
};

export function NeuronLab() {
  const { t, lang } = useI18n();
  const T = TEXT[lang] ?? TEXT.en;
  const data = useMemo(makeData, []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [w1, setW1] = useState(0.3);
  const [w2, setW2] = useState(-0.5);
  const [b, setB] = useState(0.2);
  const [rounds, setRounds] = useState(0);

  const predict = (p: Point) => sigmoid(w1 * p.x + w2 * p.y + b);
  const loss = data.reduce((acc, p) => {
    const q = Math.min(1 - 1e-6, Math.max(1e-6, predict(p)));
    return acc - (p.label * Math.log(q) + (1 - p.label) * Math.log(1 - q));
  }, 0) / data.length;
  const accuracy = data.filter((p) => (predict(p) > 0.5 ? 1 : 0) === p.label).length / data.length;

  const train = (n: number) => {
    let a = w1;
    let c = w2;
    let d = b;
    const lr = 0.5;
    for (let r = 0; r < n; r += 1) {
      let g1 = 0;
      let g2 = 0;
      let gb = 0;
      for (const p of data) {
        const q = sigmoid(a * p.x + c * p.y + d);
        const err = q - p.label;
        g1 += err * p.x;
        g2 += err * p.y;
        gb += err;
      }
      a -= (lr * g1) / data.length;
      c -= (lr * g2) / data.length;
      d -= (lr * gb) / data.length;
    }
    setW1(a);
    setW2(c);
    setB(d);
    setRounds((k) => k + n);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { ctx, w, h } = setupCanvas(canvas, 300);
    const p = readPalette();
    ctx.clearRect(0, 0, w, h);
    const range = 3;
    const sx = (v: number) => ((v + range) / (2 * range)) * w;
    const sy = (v: number) => (1 - (v + range) / (2 * range)) * h;

    ctx.strokeStyle = p.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx(0), 0);
    ctx.lineTo(sx(0), h);
    ctx.moveTo(0, sy(0));
    ctx.lineTo(w, sy(0));
    ctx.stroke();

    // decision line: w1*x + w2*y + b = 0
    ctx.strokeStyle = p.series3;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (Math.abs(w2) > 1e-6) {
      const y1 = (-b - w1 * -range) / w2;
      const y2 = (-b - w1 * range) / w2;
      ctx.moveTo(sx(-range), sy(y1));
      ctx.lineTo(sx(range), sy(y2));
    } else if (Math.abs(w1) > 1e-6) {
      const xx = -b / w1;
      ctx.moveTo(sx(xx), 0);
      ctx.lineTo(sx(xx), h);
    }
    ctx.stroke();

    for (const pt of data) {
      const color = pt.label === 0 ? p.series1 : p.series2;
      const wrong = (predict(pt) > 0.5 ? 1 : 0) !== pt.label;
      ctx.beginPath();
      ctx.arc(sx(pt.x), sy(pt.y), 7, 0, Math.PI * 2);
      ctx.fillStyle = p.surface;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sx(pt.x), sy(pt.y), 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      if (wrong) {
        ctx.strokeStyle = p.text;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w1, w2, b, data]);

  return (
    <div className="stack-sm">
      <p>{T.explain}</p>
      <canvas ref={canvasRef} className="lab-canvas" role="img" aria-label={t('labs.neuron')} />
      <div className="pill-row small">
        <span className="stat">● {T.legend0}</span>
        <span className="stat">● {T.legend1}</span>
      </div>
      <div className="lab-controls">
        <label>
          w1 <b>{w1.toFixed(2)}</b>
          <input type="range" min={-4} max={4} step={0.05} value={w1} onChange={(e) => setW1(Number(e.target.value))} />
        </label>
        <label>
          w2 <b>{w2.toFixed(2)}</b>
          <input type="range" min={-4} max={4} step={0.05} value={w2} onChange={(e) => setW2(Number(e.target.value))} />
        </label>
        <label>
          b <b>{b.toFixed(2)}</b>
          <input type="range" min={-4} max={4} step={0.05} value={b} onChange={(e) => setB(Number(e.target.value))} />
        </label>
      </div>
      <div className="lab-controls">
        <button type="button" className="btn btn-sm btn-primary" onClick={() => train(1)}>
          {t('labs.train')}
        </button>
        <button type="button" className="btn btn-sm" onClick={() => train(50)}>
          {t('labs.trainMany')}
        </button>
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={() => {
            setW1(0.3);
            setW2(-0.5);
            setB(0.2);
            setRounds(0);
          }}
        >
          {t('labs.reset')}
        </button>
      </div>
      <div className="stat-row">
        <span className="stat">
          {t('labs.accuracy')}: <b>{Math.round(accuracy * 100)}%</b>
        </span>
        <span className="stat">
          {t('labs.loss')}: <b>{loss.toFixed(3)}</b>
        </span>
        <span className="stat">
          {t('labs.train').split(' ')[0]}: <b>{rounds}</b>
        </span>
      </div>
      <p className="small muted">{T.tip}</p>
    </div>
  );
}
