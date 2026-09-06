/**
 * Spaced review scheduling (a simplified SM-2).
 *
 * Every concept the learner answers questions about gets a small record.
 * Correct answers push the next review further out (1 → 3 → 7 → 16 → 35 days…);
 * a wrong answer brings it back to tomorrow. Nothing punishes a missed day:
 * an overdue concept simply waits until the learner returns.
 */
export interface ConceptStats {
  correct: number;
  wrong: number;
  lastSeen: string;
  nextReview: string;
  /** Current interval in days. */
  interval: number;
  ease: number;
}

export function initialConceptStats(now = new Date()): ConceptStats {
  return { correct: 0, wrong: 0, lastSeen: now.toISOString(), nextReview: now.toISOString(), interval: 0, ease: 2.3 };
}

export function scheduleAfterAnswer(prev: ConceptStats, correct: boolean, now = new Date()): ConceptStats {
  let interval: number;
  let ease = prev.ease;
  if (correct) {
    if (prev.interval <= 0) interval = 1;
    else if (prev.interval === 1) interval = 3;
    else interval = Math.round(prev.interval * ease);
    ease = Math.min(3, ease + 0.05);
  } else {
    interval = 1;
    ease = Math.max(1.3, ease - 0.2);
  }
  const next = new Date(now);
  next.setDate(next.getDate() + interval);
  next.setHours(4, 0, 0, 0); // early morning so "tomorrow" means the next day
  return {
    correct: prev.correct + (correct ? 1 : 0),
    wrong: prev.wrong + (correct ? 0 : 1),
    lastSeen: now.toISOString(),
    nextReview: next.toISOString(),
    interval,
    ease,
  };
}

export function isDue(stats: ConceptStats, now = new Date()): boolean {
  return new Date(stats.nextReview).getTime() <= now.getTime();
}

/** Concepts with a recent wrong answer and a poor ratio are "weak". */
export function isWeak(stats: ConceptStats): boolean {
  const total = stats.correct + stats.wrong;
  if (total === 0) return false;
  return stats.wrong > 0 && stats.wrong / total >= 0.34;
}

export function daysUntil(iso: string, now = new Date()): number {
  const ms = new Date(iso).getTime() - now.getTime();
  return Math.ceil(ms / 86_400_000);
}
