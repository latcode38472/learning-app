#!/usr/bin/env node
/**
 * Content validator.
 *
 * Loads every lesson, module test, project and glossary through Vite (so the
 * same TypeScript content files the app uses are checked), then runs each
 * exercise's solution and starter code against its automated checks using
 * Pyodide in Node. It also verifies structure, translations, prerequisite
 * ordering, predicted outputs and documented example outputs.
 *
 *   npm run test:content            # validate everything
 *   npm run test:content -- l06     # only items whose id contains "l06"
 */
import { createServer } from 'vite';
import { loadPyodide } from 'pyodide';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const filter = process.argv[2] ?? '';

const errors = [];
const warnings = [];
let checks = 0;

function fail(where, message) {
  errors.push(`${where}: ${message}`);
}
function warn(where, message) {
  warnings.push(`${where}: ${message}`);
}

/* ---------------------------------------------------------- load content */

const vite = await createServer({
  root,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, watch: null },
  optimizeDeps: { noDiscovery: true, include: [] },
});
let content;
try {
  content = await vite.ssrLoadModule('/src/content/index.ts');
} catch (e) {
  console.error('Failed to load content:', e);
  await vite.close();
  process.exit(1);
}
const { lessons, assessments, projects, glossary, modules, lessonOrder, conceptToLesson, conceptMap, conceptLessonOrder, conceptsKnownAt } = content;

// A filter can be a module id ("m3"), or a substring of a lesson/assessment/project id.
const filterModule = modules.find((m) => m.id === filter);
function included(id) {
  if (!filter) return true;
  if (filterModule) {
    return (
      filterModule.lessonIds.includes(id) ||
      filterModule.testId === id ||
      (filterModule.projectIds ?? []).includes(id)
    );
  }
  return id.includes(filter);
}

/* ---------------------------------------------------------- python sandbox */

const pyodide = await loadPyodide();
const harnessSource = readFileSync(join(root, 'src/runtime/harness.py'), 'utf8');
pyodide.FS.writeFile('/home/pyodide/codepath_harness.py', harnessSource);
const harness = pyodide.pyimport('codepath_harness');

function runProgram(code, stdin = []) {
  return JSON.parse(harness.run_json(JSON.stringify({ code, stdin, seed: 1, echo: false, showPrompt: false })));
}
function grade(code, check) {
  return JSON.parse(harness.grade_json(JSON.stringify({ code, check, seed: 1 })));
}

function normalize(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n').map((l) => l.trimEnd());
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  while (lines.length && lines[0] === '') lines.shift();
  return lines.join('\n');
}

function messageText(m) {
  if (m && typeof m === 'object') return m.en ?? JSON.stringify(m);
  return m;
}

function describeFailure(result) {
  return result.results
    .filter((r) => !r.passed)
    .map((r) => {
      if (r.kind !== 'test') return `${r.kind} check failed (${JSON.stringify(messageText(r.message))})`;
      if (r.error) return `test #${r.index} raised ${r.error.type}: ${r.error.message} (line ${r.error.line})`;
      if (r.reason) return `test #${r.index} ${r.reason}${r.message ? ': ' + messageText(r.message) : ''}`;
      if (r.type === 'output') return `test #${r.index} output mismatch\n      expected: ${JSON.stringify(r.expected)}\n      actual:   ${JSON.stringify(r.actual)}`;
      if (r.type === 'function') return `test #${r.index} ${r.call} -> ${r.actualValue}, expected ${r.expected}`;
      return `test #${r.index}: ${messageText(r.message) ?? 'failed'}`;
    })
    .join('\n    ');
}

/* ---------------------------------------------------------- helpers */

const LANGS = ['en', 'he'];

function localizedText(value) {
  return typeof value === 'string' ? value : value.en;
}

/** Walk any content object and report Text leaves missing a language. */
function checkTranslations(where, obj, path = '') {
  if (obj === null || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => checkTranslations(where, v, `${path}[${i}]`));
    return;
  }
  if (typeof obj.en === 'string') {
    for (const lang of LANGS) {
      if (typeof obj[lang] !== 'string' || obj[lang].trim() === '') {
        fail(where, `missing ${lang} translation at ${path}`);
      }
    }
    if (typeof obj.he === 'string' && obj.he === obj.en && /[a-z]{3,}\s+[a-z]{3,}/i.test(obj.en)) {
      warn(where, `Hebrew text identical to English at ${path}`);
    }
    return;
  }
  for (const [k, v] of Object.entries(obj)) checkTranslations(where, v, path ? `${path}.${k}` : k);
}

function checkExercise(where, ex, opts = {}) {
  if (!ex) return;
  checks += 1;
  const starter = localizedText(ex.starterCode);
  const solutionResult = grade(ex.solution, ex.check);
  if (!solutionResult.passed) {
    fail(where, `solution does not pass its own checks:\n    ${describeFailure(solutionResult)}`);
  }
  const starterResult = grade(starter, ex.check);
  if (starterResult.passed && !opts.allowStarterPass) {
    fail(where, 'starter code already passes the checks (the learner would have nothing to do)');
  }
  if (!ex.hints || ex.hints.length < 2) warn(where, 'fewer than 2 hints');
  if (!ex.check.tests.length && !(ex.check.requires ?? []).length) fail(where, 'no tests');
  for (const c of ex.concepts ?? []) {
    if (!(c in conceptToLesson)) fail(where, `unknown concept id "${c}"`);
  }
  if (!ex.instructions?.length) fail(where, 'no instructions');
}

function checkQuestion(where, q, knownConcepts) {
  if (q.type === 'choice') {
    if (!q.options.some((o) => o.correct)) fail(where, 'choice question has no correct option');
    for (const [i, o] of q.options.entries()) if (!o.feedback) warn(where, `option ${i} has no feedback`);
  } else if (q.type === 'predict') {
    checks += 1;
    const res = runProgram(q.code);
    if (res.error) fail(where, `predict code raises ${res.error.type}: ${res.error.message}`);
    else {
      const answers = Array.isArray(q.answer) ? q.answer : [q.answer];
      const actual = normalize(res.stdout);
      const ok = answers.some((a) => (q.loose ? normalize(a).toLowerCase().replace(/\s+/g, ' ') === actual.toLowerCase().replace(/\s+/g, ' ') : normalize(a) === actual));
      if (!ok) fail(where, `predict answer ${JSON.stringify(answers)} does not match real output ${JSON.stringify(actual)}`);
    }
  } else if (q.type === 'code') {
    checkExercise(where, q);
  }
  for (const c of q.concepts ?? []) {
    if (!(c in conceptToLesson)) fail(where, `unknown concept id "${c}"`);
    else if (knownConcepts && !knownConcepts.has(c)) fail(where, `uses concept "${c}" not yet taught`);
  }
}

function collectCodeBlocks(blocks, out = []) {
  for (const b of blocks ?? []) {
    if (b && b.kind === 'code') out.push(b);
  }
  return out;
}

/* ---------------------------------------------------------- lessons */

for (const lessonId of conceptLessonOrder) {
  const lesson = lessons[lessonId];
  const where = `lesson ${lessonId}`;
  if (!lesson) continue; // reported later as missing from its module
  if (!included(lessonId)) continue;

  // prerequisite discipline (against the canonical concept map)
  const knownBefore = conceptsKnownAt(lessonId, false);
  const knownConcepts = conceptsKnownAt(lessonId, true);
  const canonical = conceptMap[lessonId] ?? [];
  const introduces = new Set(lesson.introduces);
  for (const c of canonical) if (!introduces.has(c)) fail(where, `introduces must include "${c}" (see src/content/concepts.ts)`);
  for (const c of introduces) if (!canonical.includes(c)) fail(where, `introduces "${c}" which is not in src/content/concepts.ts for this lesson`);
  for (const c of lesson.requires) {
    if (!knownBefore.has(c)) fail(where, `requires concept "${c}" which no earlier lesson introduces`);
  }
  if (lessonOrder.length && !lessonOrder.includes(lessonId)) warn(where, 'not part of any available module');

  // structure
  const required = ['objective', 'prerequisiteCheck', 'explanation', 'simpler', 'workedExample', 'moreExamples', 'predict', 'exercise', 'build', 'check', 'recap', 'next'];
  for (const key of required) {
    const v = lesson[key];
    if (v === undefined || v === null || (Array.isArray(v) && v.length === 0)) fail(where, `section "${key}" is missing or empty`);
  }
  if ((lesson.moreExamples ?? []).length < 1) fail(where, 'needs at least one extra example');
  if ((lesson.check ?? []).length < 2) fail(where, 'understanding check needs at least 2 questions');
  if (lesson.moduleId && !modules.find((m) => m.id === lesson.moduleId)) fail(where, `unknown module ${lesson.moduleId}`);
  const mod = modules.find((m) => m.id === lesson.moduleId);
  if (mod && !mod.lessonIds.includes(lessonId)) fail(where, `not listed in module ${mod.id}`);

  checkTranslations(where, lesson);

  // predicted output
  const pr = lesson.predict;
  if (pr) {
    checks += 1;
    const res = runProgram(pr.code);
    if (res.error) fail(where, `predict code raises ${res.error.type}: ${res.error.message}`);
    else if (pr.answer !== undefined) {
      const answers = Array.isArray(pr.answer) ? pr.answer : [pr.answer];
      const actual = normalize(res.stdout);
      const ok = answers.some((a) => (pr.loose ? normalize(a).toLowerCase() === actual.toLowerCase() : normalize(a) === actual));
      if (!ok) fail(where, `predict answer ${JSON.stringify(answers)} does not match real output ${JSON.stringify(actual)}`);
    } else if (pr.options) {
      if (!pr.options.some((o) => o.correct)) fail(where, 'predict options have no correct option');
    } else {
      fail(where, 'predict needs either answer or options');
    }
  }

  // documented outputs of code blocks
  const blocks = [
    ...collectCodeBlocks(lesson.explanation),
    ...collectCodeBlocks(lesson.simpler),
    ...collectCodeBlocks(lesson.workedExample),
    ...(lesson.moreExamples ?? []).flatMap((ex) => collectCodeBlocks(ex)),
    ...collectCodeBlocks(lesson.recap),
  ];
  for (const [i, b] of blocks.entries()) {
    if (b.lang === 'text' || b.output === undefined) continue;
    const src = localizedText(b.code);
    const expected = localizedText(b.output);
    if (/\binput\s*\(/.test(src)) continue; // interactive examples are not auto-checked
    checks += 1;
    const res = runProgram(src);
    if (res.error) fail(where, `example code block #${i} raises ${res.error.type}: ${res.error.message}\n    ${src}`);
    else if (normalize(res.stdout) !== normalize(expected)) {
      fail(where, `example code block #${i} documented output differs from real output\n      documented: ${JSON.stringify(normalize(expected))}\n      real:       ${JSON.stringify(normalize(res.stdout))}`);
    }
  }
  for (const b of [...collectCodeBlocks(lesson.explanation), ...collectCodeBlocks(lesson.workedExample)]) {
    const src = localizedText(b.code);
    if (b.lang !== 'text' && b.output === undefined && /print\(/.test(src) && !/input\(/.test(src)) {
      const res = runProgram(src);
      if (res.error) fail(where, `code block raises ${res.error.type}: ${res.error.message}\n    ${src}`);
    }
  }

  // exercises
  checkExercise(`${where} / exercise`, lesson.exercise, { allowStarterPass: lesson.exercise?.mode === 'modify' });
  checkExercise(`${where} / build`, lesson.build, { allowStarterPass: lesson.build?.mode === 'modify' });
  if (lesson.harderChallenge) checkExercise(`${where} / harderChallenge`, lesson.harderChallenge, { allowStarterPass: lesson.harderChallenge.mode === 'modify' });
  for (const ex of [lesson.exercise, lesson.build, lesson.harderChallenge].filter(Boolean)) {
    for (const c of ex.concepts ?? []) {
      if (!knownConcepts.has(c)) fail(`${where} / ${ex.id}`, `uses concept "${c}" not yet taught`);
    }
  }
  for (const q of lesson.check ?? []) checkQuestion(`${where} / ${q.id}`, q, knownConcepts);
  for (const q of lesson.miniChecks ?? []) checkQuestion(`${where} / mini ${q.id}`, q, knownConcepts);
  if (lesson.briskSummary !== undefined && lesson.briskSummary.length === 0) fail(where, 'briskSummary is present but empty');
  for (const b of collectCodeBlocks(lesson.briskSummary ?? [])) {
    if (b.lang === 'text' || b.output === undefined) continue;
    const res = runProgram(localizedText(b.code));
    if (res.error) fail(where, `briskSummary code block raises ${res.error.type}: ${res.error.message}`);
    else if (normalize(res.stdout) !== normalize(localizedText(b.output))) fail(where, 'briskSummary code block documented output differs from real output');
  }
}

// every module lesson id must exist (skipped when validating a subset)
for (const mod of modules) {
  if (mod.status !== 'available' || filter) continue;
  for (const id of mod.lessonIds) {
    if (!lessons[id]) fail(`module ${mod.id}`, `lesson "${id}" is listed but no file defines it`);
  }
  if (mod.testId && !assessments[mod.testId]) fail(`module ${mod.id}`, `test "${mod.testId}" not found`);
  for (const pid of mod.projectIds ?? []) if (!projects[pid]) fail(`module ${mod.id}`, `project "${pid}" not found`);
}
for (const id of Object.keys(lessons)) {
  if (!lessonOrder.includes(id)) warn(`lesson ${id}`, 'exists but is not listed in any available module');
}

/* ---------------------------------------------------------- assessments */

for (const a of Object.values(assessments)) {
  const where = `assessment ${a.id}`;
  if (!included(a.id)) continue;
  checkTranslations(where, a);
  if (!a.pools?.length) fail(where, 'no question pools');
  const ids = new Set();
  const mod = modules.find((m) => m.id === a.moduleId);
  const allowed = mod ? conceptsKnownAt(mod.lessonIds[mod.lessonIds.length - 1], true) : null;
  for (const [pi, pool] of (a.pools ?? []).entries()) {
    if (!pool.variants?.length) fail(where, `pool ${pi} has no variants`);
    if (a.kind === 'module-test' && (pool.variants ?? []).length < 2) warn(where, `pool ${pi} has a single variant (retries will repeat it)`);
    for (const q of pool.variants ?? []) {
      if (ids.has(q.id)) fail(where, `duplicate question id ${q.id}`);
      ids.add(q.id);
      checkQuestion(`${where} / ${q.id}`, q, allowed);
    }
  }
  if (a.kind === 'module-test' && (a.pools ?? []).length < 6) warn(where, 'module tests should have at least 6 pools');
  const codePools = (a.pools ?? []).filter((p) => p.variants?.some((q) => q.type === 'code')).length;
  if (a.kind === 'module-test' && codePools < 2) warn(where, 'module tests should include at least 2 coding pools');
}

/* ---------------------------------------------------------- projects */

for (const project of Object.values(projects)) {
  const where = `project ${project.id}`;
  if (!included(project.id)) continue;
  checkTranslations(where, project);
  if (!project.steps?.length) fail(where, 'no steps');
  let lastReference = null;
  for (const step of project.steps ?? []) {
    const sw = `${where} / ${step.id}`;
    if (step.referenceCode) lastReference = step.referenceCode;
    if (step.check) {
      checks += 1;
      if (!lastReference) {
        fail(sw, 'step has a check but no reference code available (this or an earlier step must provide referenceCode)');
      } else {
        const res = grade(lastReference, step.check);
        if (!res.passed) fail(sw, `reference code fails the step check:\n    ${describeFailure(res)}`);
      }
      if (step.hints.length < 1) warn(sw, 'no hints');
    }
  }
  // the final reference code must pass every step check
  if (lastReference) {
    for (const step of project.steps) {
      if (!step.check) continue;
      const res = grade(lastReference, step.check);
      if (!res.passed) fail(`${where} / final`, `final reference code fails check of ${step.id}:\n    ${describeFailure(res)}`);
    }
  }
  for (const c of project.concepts ?? []) if (!(c in conceptToLesson)) fail(where, `unknown concept "${c}"`);
  for (const lid of project.prerequisites ?? []) if (!lessons[lid]) fail(where, `unknown prerequisite lesson "${lid}"`);
  // Growing projects: step requirements must be real lessons, in curriculum order, and
  // each step's reference code must only use concepts taught by its requirements.
  if (project.growing) {
    let lastIndex = -1;
    for (const step of project.steps) {
      const reqs = step.requires ?? project.prerequisites ?? [];
      for (const lid of reqs) if (!lessons[lid]) fail(`${where} / ${step.id}`, `unknown required lesson "${lid}"`);
      const idx = Math.max(-1, ...reqs.map((lid) => lessonOrder.indexOf(lid)));
      if (idx < lastIndex) fail(`${where} / ${step.id}`, 'steps must unlock in curriculum order (a later step requires an earlier lesson than the step before it)');
      lastIndex = Math.max(lastIndex, idx);
      for (const c of step.concepts ?? []) {
        if (!(c in conceptToLesson)) fail(`${where} / ${step.id}`, `unknown concept "${c}"`);
        else if (idx >= 0 && lessonOrder.indexOf(conceptToLesson[c]) > idx) fail(`${where} / ${step.id}`, `practises "${c}" before its lesson is required`);
      }
    }
  }
}

/* ---------------------------------------------------------- glossary */

const glossaryIds = new Set(glossary.map((g) => g.id));
for (const g of glossary) checkTranslations(`glossary ${g.id}`, g);
for (const c of Object.keys(conceptToLesson)) {
  if (!included(conceptToLesson[c])) continue;
  if (!glossaryIds.has(c)) warn(`glossary`, `no entry for concept "${c}" (introduced in ${conceptToLesson[c]})`);
}
const dupes = glossary.map((g) => g.id).filter((id, i, arr) => arr.indexOf(id) !== i);
for (const d of new Set(dupes)) fail('glossary', `duplicate entry id "${d}"`);

/* ---------------------------------------------------------- report */

await vite.close();

console.log(`\nChecked ${Object.keys(lessons).length} lessons, ${Object.keys(assessments).length} assessments, ${Object.keys(projects).length} projects, ${glossary.length} glossary entries (${checks} sandbox checks).`);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log('  - ' + w);
}
if (errors.length) {
  console.log(`\n${errors.length} error(s):`);
  for (const e of errors) console.log('  ✗ ' + e);
  process.exit(1);
}
console.log('\nContent validation passed.');
process.exit(0);
