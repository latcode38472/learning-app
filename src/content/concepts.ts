/**
 * Canonical concept map: which lesson introduces which concept ids.
 *
 * This is the source of truth for prerequisite checking, spaced review and
 * weak-spot detection. A lesson's `introduces` list must match its entry here,
 * and a lesson may only rely on concepts introduced by earlier lessons.
 */
export const conceptMap: Record<string, string[]> = {
  // m1 — How computers think
  'l01-what-computers-do': ['computer-basics', 'input-output', 'program', 'print-basic'],
  'l02-programs-and-files': ['file', 'running-programs', 'console', 'sequence'],
  'l03-thinking-in-steps': ['algorithm', 'precision', 'step-by-step'],
  'l04-first-bug': ['bug', 'error-message', 'syntax-error', 'debugging'],
  // m2 — Python basics
  'l05-print-and-strings': ['print', 'string', 'quotes', 'comment', 'print-multiple'],
  'l06-variables': ['variable', 'assignment', 'naming', 'reassignment'],
  'l07-numbers-and-math': ['int', 'float', 'arithmetic', 'integer-division', 'modulo', 'power', 'precedence'],
  'l08-data-types': ['type', 'type-conversion', 'type-mismatch'],
  'l09-input': ['input', 'input-is-text'],
  'l10-fstrings': ['f-string', 'concatenation', 'len', 'upper-lower'],
  // m3 — Decisions
  'l11-comparisons': ['comparison', 'boolean', 'equality'],
  'l12-if-else': ['if', 'else', 'indentation', 'block'],
  'l13-elif': ['elif', 'condition-order'],
  'l14-logic': ['and', 'or', 'not', 'nested-if'],
  // m4 — Loops
  'l15-while': ['while', 'loop-condition', 'counter', 'infinite-loop'],
  'l16-for-range': ['for', 'range', 'loop-variable'],
  'l17-accumulators': ['accumulator', 'break', 'continue'],
  'l18-nested-loops': ['nested-loop', 'string-repeat', 'print-end'],
  'l19-random': ['import', 'module', 'random-randint', 'math-module'],
  // m5 — Functions
  'l20-def': ['function', 'def', 'call'],
  'l21-parameters': ['parameter', 'argument', 'default-parameter'],
  'l22-return': ['return', 'return-value', 'none'],
  'l23-scope': ['scope', 'local-variable', 'global-variable', 'program-structure'],
  // m6 — Collections
  'l24-lists': ['list', 'index', 'append', 'index-error', 'negative-index'],
  'l25-list-loops': ['for-each', 'in-operator', 'list-modify', 'remove-pop', 'sum-min-max', 'sorted'],
  'l26-dictionaries': ['dictionary', 'key-value', 'dict-get', 'dict-loop', 'key-error'],
  'l27-nested-data': ['nested-data', 'split-join', 'choosing-structures'],
  // m7 — Errors
  'l28-reading-errors': ['traceback', 'name-error', 'value-error', 'zero-division', 'attribute-error'],
  'l29-try-except': ['try', 'except', 'exception', 'validation-loop'],
};

/** Lesson ids in teaching order, derived from the map's insertion order. */
export const conceptLessonOrder: string[] = Object.keys(conceptMap);

/** concept id -> lesson id that introduces it. */
export const conceptToLesson: Record<string, string> = Object.fromEntries(
  Object.entries(conceptMap).flatMap(([lessonId, ids]) => ids.map((c) => [c, lessonId])),
);

/** All concepts introduced strictly before the given lesson (plus its own if includeSelf). */
export function conceptsKnownAt(lessonId: string, includeSelf = false): Set<string> {
  const known = new Set<string>();
  for (const id of conceptLessonOrder) {
    if (id === lessonId) {
      if (includeSelf) for (const c of conceptMap[id]) known.add(c);
      break;
    }
    for (const c of conceptMap[id]) known.add(c);
  }
  return known;
}
