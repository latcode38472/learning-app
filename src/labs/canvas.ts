/** Shared helpers for the canvas-based preview labs. */

export interface Palette {
  surface: string;
  text: string;
  textMuted: string;
  grid: string;
  series1: string; // blue
  series2: string; // orange
  series3: string; // aqua
  dark: boolean;
}

/** Colours from the validated reference palette (light / dark steps). */
export function readPalette(): Palette {
  const dark = document.documentElement.dataset.theme === 'dark';
  const cs = getComputedStyle(document.documentElement);
  return {
    surface: cs.getPropertyValue('--surface').trim() || (dark ? '#171a24' : '#ffffff'),
    text: cs.getPropertyValue('--text').trim() || (dark ? '#eceef5' : '#1a1f2e'),
    textMuted: cs.getPropertyValue('--text-3').trim() || (dark ? '#8d94ab' : '#6b7387'),
    grid: cs.getPropertyValue('--border').trim() || (dark ? '#2d3245' : '#d8dce8'),
    series1: dark ? '#3987e5' : '#2a78d6',
    series2: dark ? '#d95926' : '#eb6834',
    series3: dark ? '#199e70' : '#1baf7a',
    dark,
  };
}

/** Prepare a canvas for crisp drawing at the device pixel ratio. Returns the 2D context and CSS size. */
export function setupCanvas(canvas: HTMLCanvasElement, cssHeight: number): { ctx: CanvasRenderingContext2D; w: number; h: number } {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || 600;
  const h = cssHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.height = `${h}px`;
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

/** Small deterministic pseudo-random generator so labs are reproducible. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Draw a single-series line chart (values over index) into a canvas. */
export function drawLineChart(
  canvas: HTMLCanvasElement,
  series: Array<{ values: number[]; color: string; label: string }>,
  opts: { height?: number; yLabel?: string; xLabel?: string; yMin?: number; yMax?: number } = {},
): void {
  const { ctx, w, h } = setupCanvas(canvas, opts.height ?? 160);
  const p = readPalette();
  ctx.clearRect(0, 0, w, h);
  const padL = 40;
  const padR = 10;
  const padT = 10;
  const padB = 24;
  const all = series.flatMap((s) => s.values);
  if (all.length === 0) {
    ctx.fillStyle = p.textMuted;
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText('—', padL, h / 2);
    return;
  }
  const yMin = opts.yMin ?? Math.min(...all);
  const yMax = opts.yMax ?? Math.max(...all);
  const span = yMax - yMin || 1;
  const n = Math.max(...series.map((s) => s.values.length));
  const x = (i: number) => padL + (n <= 1 ? 0 : (i / (n - 1)) * (w - padL - padR));
  const y = (v: number) => padT + (1 - (v - yMin) / span) * (h - padT - padB);

  // recessive grid
  ctx.strokeStyle = p.grid;
  ctx.lineWidth = 1;
  for (let g = 0; g <= 4; g += 1) {
    const yy = padT + (g / 4) * (h - padT - padB);
    ctx.beginPath();
    ctx.moveTo(padL, yy);
    ctx.lineTo(w - padR, yy);
    ctx.stroke();
  }
  ctx.fillStyle = p.textMuted;
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(yMax.toFixed(2), padL - 4, padT + 4);
  ctx.fillText(yMin.toFixed(2), padL - 4, h - padB);
  ctx.textAlign = 'left';
  if (opts.xLabel) ctx.fillText(opts.xLabel, padL, h - 6);
  if (opts.yLabel) {
    ctx.save();
    ctx.translate(10, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(opts.yLabel, 0, 0);
    ctx.restore();
  }

  for (const s of series) {
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    s.values.forEach((v, i) => {
      if (i === 0) ctx.moveTo(x(i), y(v));
      else ctx.lineTo(x(i), y(v));
    });
    ctx.stroke();
  }
  // legend when more than one series
  if (series.length > 1) {
    let lx = padL;
    ctx.font = '11px system-ui, sans-serif';
    for (const s of series) {
      ctx.fillStyle = s.color;
      ctx.fillRect(lx, padT, 12, 3);
      ctx.fillStyle = p.text;
      ctx.fillText(s.label, lx + 16, padT + 4);
      lx += 16 + ctx.measureText(s.label).width + 14;
    }
  }
}
