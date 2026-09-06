/**
 * The built-in guide: a rule-based tutor that needs no AI model or API key.
 *
 * It knows the current lesson, the concepts learned so far, the learner's last
 * error and last check results, and the exercise's hint ladder. It explains
 * and asks guiding questions; it never writes the exercise for the learner.
 */
import type { LangCode } from '@/content/schema';
import { glossary, glossaryById, lessons } from '@/content';
import { localize } from '@/i18n';
import { explainError } from '@/runtime/errors';
import type { TutorSituation } from './context';

export type Intent = 'error' | 'fail' | 'hint' | 'term' | 'stuck' | 'solution' | 'chat';

const R = {
  en: {
    greeting: 'Hi. I know you are working on **{lesson}**. Ask me about your error, a failed check, a word you do not understand, or say you are stuck.',
    greetingNoLesson: 'Hi. Open a lesson and I will follow along: I can explain errors, failed checks and terms, and nudge you when you are stuck.',
    noError: 'There is no error right now. Run your code and I will explain anything that goes wrong.',
    errorIntro: 'Your program stopped with **{type}** on line {line}.',
    errorIntroNoLine: 'Your program stopped with **{type}**.',
    errorLine: 'The line is: `{source}`',
    errorAsk: 'Look at that line and ask yourself: {question}',
    q: {
      NameError: 'is every name spelled exactly the same way everywhere, and is it created on a line above this one? Is any text missing its quotes?',
      SyntaxError: 'does every opening quote and bracket have a closing partner, and does the line above end correctly (for example with a colon after if / for / while / def)?',
      IndentationError: 'do the lines inside this block start with the same number of spaces, and is there a stray space at the start of a line?',
      TypeError: 'are you mixing text and a number? What would `str()` or `int()` change here?',
      ValueError: 'what value arrived here, and can it really be converted the way the code expects?',
      ZeroDivisionError: 'which value is zero at this moment, and where did it come from?',
      IndexError: 'how many items does the list have, and what is the largest position you can ask for?',
      KeyError: 'which keys does the dictionary actually contain? Print it to see.',
      AttributeError: 'what type is the value on the left of the dot, and does that type really have this method?',
      default: 'what does the message say, word by word, and which value on this line could cause it?',
    },
    noFail: 'No failed checks right now. Press "Check my answer" and I will help with whatever fails.',
    failIntro: '{failed} of {total} checks did not pass. Let us look at the first one.',
    failOutput: 'Expected output was:\n```\n{expected}\n```\nYour program printed:\n```\n{actual}\n```\n',
    failInput: '(with input: {input})',
    failDiffCase: 'They differ only in capital letters — check the exact spelling in the instructions.',
    failDiffSpace: 'They differ only in spaces or blank lines — check for extra print() calls or spaces inside quotes.',
    failDiffLines: 'The number of lines differs ({actual} instead of {expected}). Which print is missing or extra?',
    failDiffOther: 'Compare them character by character from the start: where is the first difference, and which line of your code produced it?',
    failFunction: 'Calling `{call}` should give `{expected}` but gave `{actual}`.',
    failPrinted: 'Your function printed the value instead of returning it. Which keyword sends a value back to the caller?',
    failNeedInput: 'The check gives fewer input lines than your program asks for. Count your input() calls.',
    failRequirement: 'A requirement was not met: {message}',
    failMessage: 'The check says: {message}',
    hintNone: 'This exercise has no more hints. Re-read the instructions once more, then try changing one small thing and running again.',
    hintNext: 'Here is a nudge (hint {n}): {hint}',
    hintUsedAll: 'You have already seen every hint. Try building the solution one line at a time: what is the very first thing the program must do?',
    stuck: 'Being stuck is normal. Try this: 1) read the instructions again and write, in your own words, what the program must do; 2) write the first line only and run it; 3) add one line at a time, running after each. Ask me for a hint when you want one.',
    solution: 'I will not write the solution for you — the point is that you can write it. But I can help: tell me which part is unclear, ask for a hint, or run your code and I will explain the error.',
    term: '**{name}** ({term}): {definition}',
    termExample: 'Example: `{example}`',
    termUnknown: 'I do not have a glossary entry for that. Which word do you mean? Try the Glossary page for the full list.',
    exam: 'The tutor is switched off during tests. It comes back after you submit.',
    fallback: 'I can help in four ways: explain your error, explain why a check failed, give a hint, or explain a term. Which would you like?',
    learned: 'So far you have learned: {list}.',
  },
  he: {
    greeting: 'שלום. אני יודע שאתם עובדים על **{lesson}**. שאלו אותי על השגיאה שלכם, על בדיקה שנכשלה, על מילה שלא הבנתם, או אמרו לי שנתקעתם.',
    greetingNoLesson: 'שלום. פתחו שיעור ואני אלווה אתכם: אני יכול להסביר שגיאות, בדיקות שנכשלו ומונחים, ולתת דחיפה קטנה כשנתקעתם.',
    noError: 'אין שגיאה כרגע. הריצו את הקוד ואסביר כל דבר שמשתבש.',
    errorIntro: 'התוכנית נעצרה עם **{type}** בשורה {line}.',
    errorIntroNoLine: 'התוכנית נעצרה עם **{type}**.',
    errorLine: 'השורה היא: `{source}`',
    errorAsk: 'הסתכלו על השורה ושאלו את עצמכם: {question}',
    q: {
      NameError: 'האם כל שם כתוב בדיוק באותה צורה בכל מקום, והאם הוא נוצר בשורה שמעל? האם יש טקסט שחסרות לו מירכאות?',
      SyntaxError: 'האם לכל מירכאה וסוגר פותח יש בן זוג סוגר, והאם השורה שמעל מסתיימת נכון (למשל בנקודתיים אחרי if / for / while / def)?',
      IndentationError: 'האם השורות בתוך הבלוק מתחילות באותו מספר רווחים, והאם יש רווח מיותר בתחילת שורה?',
      TypeError: 'האם אתם מערבבים טקסט ומספר? מה `str()` או `int()` היו משנים כאן?',
      ValueError: 'איזה ערך הגיע לכאן, והאם באמת אפשר להמיר אותו כמו שהקוד מצפה?',
      ZeroDivisionError: 'איזה ערך הוא אפס ברגע הזה, ומאיפה הוא הגיע?',
      IndexError: 'כמה פריטים יש ברשימה, ומה המיקום הגדול ביותר שאפשר לבקש?',
      KeyError: 'אילו מפתחות באמת יש במילון? הדפיסו אותו כדי לראות.',
      AttributeError: 'מה הטיפוס של הערך שמשמאל לנקודה, והאם לטיפוס הזה באמת יש את המתודה הזאת?',
      default: 'מה ההודעה אומרת, מילה במילה, ואיזה ערך בשורה הזאת יכול לגרום לה?',
    },
    noFail: 'אין בדיקות שנכשלו כרגע. לחצו על "בדקו את התשובה שלי" ואעזור עם מה שנכשל.',
    failIntro: '{failed} מתוך {total} בדיקות לא עברו. בואו נסתכל על הראשונה.',
    failOutput: 'הפלט המצופה היה:\n```\n{expected}\n```\nהתוכנית שלכם הדפיסה:\n```\n{actual}\n```\n',
    failInput: '(עם הקלט: {input})',
    failDiffCase: 'ההבדל הוא רק באותיות גדולות/קטנות — בדקו את האיות המדויק בהוראות.',
    failDiffSpace: 'ההבדל הוא רק ברווחים או בשורות ריקות — בדקו אם יש קריאות print() מיותרות או רווחים בתוך המירכאות.',
    failDiffLines: 'מספר השורות שונה ({actual} במקום {expected}). איזה print חסר או מיותר?',
    failDiffOther: 'השוו תו אחרי תו מההתחלה: איפה ההבדל הראשון, ואיזו שורה בקוד שלכם יצרה אותו?',
    failFunction: 'הקריאה `{call}` צריכה להחזיר `{expected}` אבל החזירה `{actual}`.',
    failPrinted: 'הפונקציה שלכם הדפיסה את הערך במקום להחזיר אותו. איזו מילת מפתח שולחת ערך בחזרה למי שקרא לפונקציה?',
    failNeedInput: 'הבדיקה נותנת פחות שורות קלט ממה שהתוכנית מבקשת. ספרו את הקריאות ל-input().',
    failRequirement: 'דרישה לא התקיימה: {message}',
    failMessage: 'הבדיקה אומרת: {message}',
    hintNone: 'לתרגיל הזה אין עוד רמזים. קראו שוב את ההוראות, ואז נסו לשנות דבר קטן אחד ולהריץ שוב.',
    hintNext: 'הנה דחיפה קטנה (רמז {n}): {hint}',
    hintUsedAll: 'כבר ראיתם את כל הרמזים. נסו לבנות את הפתרון שורה אחר שורה: מה הדבר הראשון שהתוכנית חייבת לעשות?',
    stuck: 'להיתקע זה נורמלי. נסו כך: 1) קראו שוב את ההוראות וכתבו במילים שלכם מה התוכנית צריכה לעשות; 2) כתבו רק את השורה הראשונה והריצו; 3) הוסיפו שורה אחת בכל פעם והריצו אחרי כל אחת. בקשו ממני רמז כשתרצו.',
    solution: 'לא אכתוב את הפתרון במקומכם — כל העניין הוא שאתם תוכלו לכתוב אותו. אבל אני יכול לעזור: ספרו לי איזה חלק לא ברור, בקשו רמז, או הריצו את הקוד ואסביר את השגיאה.',
    term: '**{name}** ({term}): {definition}',
    termExample: 'דוגמה: `{example}`',
    termUnknown: 'אין לי ערך במילון בשביל זה. לאיזו מילה התכוונתם? נסו את עמוד מילון המונחים לרשימה המלאה.',
    exam: 'המדריך כבוי במהלך מבחנים. הוא חוזר אחרי ההגשה.',
    fallback: 'אני יכול לעזור בארבע דרכים: להסביר את השגיאה שלכם, להסביר למה בדיקה נכשלה, לתת רמז, או להסביר מונח. מה תרצו?',
    learned: 'עד כה למדתם: {list}.',
  },
};

function fmt(s: string, params: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m));
}

const INTENT_PATTERNS: Array<[Intent, RegExp]> = [
  ['solution', /\b(solution|answer|write it|do it for me|give me the code)\b|פתרון|תשובה|תכתוב|תכתבי|כתוב לי|תן לי את הקוד/i],
  ['error', /\b(error|traceback|exception|crash|red)\b|שגיאה|קרס|אדום/i],
  ['fail', /\b(fail|failed|check|test|expected|wrong output)\b|נכשל|בדיקה|מצופה|פלט/i],
  ['hint', /\b(hint|nudge|clue|tip)\b|רמז|דחיפה|טיפ/i],
  ['stuck', /\b(stuck|help|lost|confused|don'?t know|do not know)\b|נתקע|עזרה|אבוד|מבולבל|לא יודע/i],
];

function detectIntent(message: string): Intent {
  for (const [intent, re] of INTENT_PATTERNS) if (re.test(message)) return intent;
  return 'chat';
}

function normalizeLines(s: string): string[] {
  const lines = s.replace(/\r\n/g, '\n').split('\n').map((l) => l.trimEnd());
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

function findTerm(message: string, lang: LangCode) {
  const lower = message.toLowerCase();
  // Longest matching term first so "for loop" beats "for".
  const candidates = glossary
    .map((g) => ({ g, names: [g.term.toLowerCase(), (localize(g.name, lang) || '').toLowerCase(), (g.name.en || '').toLowerCase()].filter(Boolean) }))
    .flatMap(({ g, names }) => names.map((n) => ({ g, n })))
    .filter(({ n }) => n.length >= 2 && (lower.includes(` ${n} `) || lower.includes(`${n}?`) || lower === n || lower.endsWith(` ${n}`) || lower.startsWith(`${n} `) || lower.includes(`\`${n}\``) || lower.includes(`'${n}'`) || lower.includes(`"${n}"`)))
    .sort((a, b) => b.n.length - a.n.length);
  return candidates[0]?.g;
}

export function offlineReply(message: string, situation: TutorSituation, lang: LangCode, forcedIntent?: Intent): string {
  const S = R[lang] ?? R.en;
  if (situation.examMode) return S.exam;

  let intent = forcedIntent ?? detectIntent(message);
  const term = forcedIntent === 'term' || intent === 'chat' ? findTerm(message, lang) : undefined;
  if (term) intent = 'term';

  switch (intent) {
    case 'term': {
      if (!term) return S.termUnknown;
      let out = fmt(S.term, { name: localize(term.name, lang) || term.term, term: term.term, definition: localize(term.definition, lang) });
      if (term.example) out += '\n' + fmt(S.termExample, { example: term.example });
      return out;
    }
    case 'error': {
      const err = situation.lastError;
      if (!err) return S.noError;
      const friendly = explainError(err, lang);
      const q = (S.q as Record<string, string>)[err.type] ?? S.q.default;
      const parts = [err.line ? fmt(S.errorIntro, { type: err.type, line: err.line }) : fmt(S.errorIntroNoLine, { type: err.type }), friendly.explanation];
      if (err.source) parts.push(fmt(S.errorLine, { source: err.source.trim() }));
      parts.push(fmt(S.errorAsk, { question: q }));
      return parts.join('\n\n');
    }
    case 'fail': {
      const grade = situation.lastGrade;
      const failed = grade?.results.filter((r) => !r.passed) ?? [];
      if (!grade || failed.length === 0) return S.noFail;
      const first = failed[0];
      const parts = [fmt(S.failIntro, { failed: failed.length, total: grade.results.length })];
      if (first.kind !== 'test') {
        const msg = typeof first.message === 'string' ? first.message : first.message ? localize(first.message, lang) : '';
        parts.push(fmt(S.failRequirement, { message: msg }));
      } else if (first.error) {
        parts.push(explainError(first.error, lang).explanation);
      } else if (first.reason === 'need-input') {
        parts.push(S.failNeedInput);
      } else if (first.type === 'output') {
        parts.push(fmt(S.failOutput, { expected: first.expected ?? '', actual: first.actual ?? '' }));
        if (first.stdin?.length) parts.push(fmt(S.failInput, { input: first.stdin.join(', ') }));
        const e = normalizeLines(first.expected ?? '');
        const a = normalizeLines(first.actual ?? '');
        if (e.join('\n').toLowerCase() === a.join('\n').toLowerCase()) parts.push(S.failDiffCase);
        else if (e.map((x) => x.replace(/\s+/g, '')).join('') === a.map((x) => x.replace(/\s+/g, '')).join('')) parts.push(S.failDiffSpace);
        else if (e.length !== a.length) parts.push(fmt(S.failDiffLines, { expected: e.length, actual: a.length }));
        else parts.push(S.failDiffOther);
      } else if (first.type === 'function') {
        parts.push(fmt(S.failFunction, { call: first.call ?? '', expected: first.expected ?? '', actual: first.actualValue ?? '' }));
        if (first.reason === 'printed-not-returned') parts.push(S.failPrinted);
      } else if (first.message) {
        parts.push(fmt(S.failMessage, { message: typeof first.message === 'string' ? first.message : localize(first.message, lang) }));
      }
      return parts.join('\n\n');
    }
    case 'hint': {
      const hints = situation.hints ?? [];
      if (hints.length === 0) return S.hintNone;
      const used = situation.hintsUsed ?? 0;
      if (used >= hints.length) return S.hintUsedAll;
      return fmt(S.hintNext, { n: used + 1, hint: hints[used] });
    }
    case 'stuck':
      return S.stuck;
    case 'solution':
      return S.solution;
    default: {
      const lesson = situation.lessonId ? lessons[situation.lessonId] : undefined;
      if (/^(hi|hello|hey|שלום|היי)\b/i.test(message.trim()) || message.trim() === '') {
        return lesson ? fmt(S.greeting, { lesson: localize(lesson.title, lang) }) : S.greetingNoLesson;
      }
      const learned = situation.learnedConcepts
        .slice(-6)
        .map((c) => glossaryById[c])
        .filter(Boolean)
        .map((g) => localize(g.name, lang) || g.term);
      const extra = learned.length ? '\n\n' + fmt(S.learned, { list: learned.join(', ') }) : '';
      return S.fallback + extra;
    }
  }
}

/** Advertised to the connected tutor so it can behave consistently with the built-in guide. */
export function tutorSystemPrompt(situation: TutorSituation, lang: LangCode): string {
  const lesson = situation.lessonId ? lessons[situation.lessonId] : undefined;
  const learned = situation.learnedConcepts.map((c) => glossaryById[c]?.term ?? c).join(', ');
  return [
    'You are a patient programming tutor inside a learning app for absolute beginners (children and adults).',
    `Reply in ${lang === 'he' ? 'Hebrew (keep code and Python keywords in English)' : 'English'}. Be concise and warm, never condescending.`,
    'Guide the learner through reasoning with questions and small nudges. Never write the full solution to an exercise; at most show a one-line illustrative snippet of a concept.',
    lesson ? `Current lesson: "${lesson.title.en}". Objective: ${lesson.objective.en}` : 'The learner is not inside a lesson right now.',
    learned ? `Concepts the learner has met so far (do not rely on anything beyond these): ${learned}.` : 'The learner has not learned any concepts yet.',
    situation.exerciseTitle ? `Current exercise: ${situation.exerciseTitle}.` : '',
    situation.currentCode ? `Learner's current code:\n\`\`\`python\n${situation.currentCode.slice(0, 4000)}\n\`\`\`` : '',
    situation.lastError ? `Last error: ${situation.lastError.type}: ${situation.lastError.message} (line ${situation.lastError.line ?? '?'})` : '',
    situation.lastGrade
      ? `Last check: ${situation.lastGrade.passed ? 'passed' : 'failed'}; details: ${JSON.stringify(situation.lastGrade.results.filter((r) => !r.passed).slice(0, 3)).slice(0, 2000)}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}
