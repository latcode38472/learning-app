import { describe, expect, it } from 'vitest';
import { offlineReply } from './offline';
import type { TutorSituation } from './context';

const base: TutorSituation = { learnedConcepts: ['variable', 'print'], examMode: false, lessonId: 'l06-variables', lessonTitle: 'Variables' };

describe('offline guide', () => {
  it('answers definition questions from the glossary in both languages', () => {
    expect(offlineReply('What is a variable?', base, 'en')).toContain('variable');
    expect(offlineReply('מה זה משתנה?', base, 'he')).toContain('משתנה');
    expect(offlineReply('מה זה קלט?', base, 'he')).toContain('input');
    expect(offlineReply('What is an error message?', base, 'en')).toMatch(/error message/i);
  });

  it('does not mistake term questions or answer checks for other intents', () => {
    expect(offlineReply('מה זה טיפוס?', base, 'he')).not.toContain('רמז');
    expect(offlineReply('Why is my answer wrong?', base, 'en')).not.toMatch(/will not write the solution/);
    expect(offlineReply('give me the solution', base, 'en')).toMatch(/will not write the solution/);
  });

  it('explains errors and failed checks from the situation', () => {
    const withError: TutorSituation = {
      ...base,
      lastError: { type: 'NameError', message: "name 'nmae' is not defined", line: 2, source: 'print(nmae)', traceback: '' },
    };
    expect(offlineReply('explain my error', withError, 'en')).toContain('NameError');
    expect(offlineReply('explain my error', base, 'en')).toMatch(/no error right now/);
    expect(offlineReply('למה הבדיקה נכשלה?', base, 'he')).toMatch(/אין בדיקות שנכשלו/);
  });

  it('greets in Hebrew and refuses during tests', () => {
    // The greeting names the current lesson in the learner's language.
    expect(offlineReply('שלום', base, 'he')).toContain('משתנים');
    expect(offlineReply('hello', base, 'en')).toContain('Variables');
    expect(offlineReply('hint please', { ...base, examMode: true }, 'en')).toMatch(/switched off/);
  });
});
