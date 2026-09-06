/**
 * Runs a sequence of questions (multiple choice, predict-the-output, coding).
 * `immediate` mode gives feedback after every answer (lesson checks, reviews);
 * `exam` mode withholds feedback until the end (module tests, placement).
 */
import { useEffect, useMemo, useState } from 'react';
import type { Question } from '@/content/schema';
import { useI18n } from '@/i18n';
import type { GradeResult } from '@/runtime/runner';
import { Blocks } from './Blocks';
import { ExercisePanel } from './ExercisePanel';
import { Inline } from './InlineText';
import { Badge, Notice } from './ui';

export interface QuizAnswer {
  questionId: string;
  correct: boolean;
  concepts: string[];
  skipped?: boolean;
  selected?: number[];
  text?: string;
}

interface Props {
  questions: Question[];
  mode: 'immediate' | 'exam';
  hintsAllowed?: number;
  onFinish: (answers: QuizAnswer[]) => void;
  onAnswer?: (answer: QuizAnswer) => void;
  testIdPrefix?: string;
  /** Storage prefix for code drafts so retakes do not reuse old code. */
  draftPrefix?: string;
}

export function normalizeAnswer(s: string, loose?: boolean): string {
  const lines = s.replace(/\r\n/g, '\n').split('\n').map((l) => l.trimEnd());
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  while (lines.length && lines[0] === '') lines.shift();
  let out = lines.join('\n');
  if (loose) out = out.toLowerCase().replace(/\s+/g, ' ').trim();
  return out;
}

export function isPredictCorrect(answer: string | string[], text: string, loose?: boolean): boolean {
  const answers = Array.isArray(answer) ? answer : [answer];
  return answers.some((a) => normalizeAnswer(a, loose) === normalizeAnswer(text, loose));
}

export function QuizRunner({ questions, mode, hintsAllowed = 0, onFinish, onAnswer, testIdPrefix = 'quiz', draftPrefix = '' }: Props) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const question = questions[index];
  const total = questions.length;

  useEffect(() => {
    setIndex(0);
    setAnswers([]);
    setSubmitted(false);
  }, [questions]);

  const finish = (all: QuizAnswer[]) => onFinish(all);

  const record = (answer: QuizAnswer) => {
    const all = [...answers.filter((a) => a.questionId !== answer.questionId), answer];
    setAnswers(all);
    onAnswer?.(answer);
    if (mode === 'immediate') {
      setSubmitted(true);
    } else {
      advance(all);
    }
  };

  const advance = (all: QuizAnswer[] = answers) => {
    setSubmitted(false);
    if (index + 1 >= total) finish(all);
    else setIndex(index + 1);
  };

  if (!question) return null;

  return (
    <div className="stack" data-testid={testIdPrefix}>
      <div className="section-head" style={{ marginBottom: 0 }}>
        <strong>{t('quiz.question', { n: index + 1, total })}</strong>
        <span className="small muted">{t('quiz.questionsAnswered', { answered: answers.length, total })}</span>
      </div>
      <QuestionView
        key={question.id}
        question={question}
        mode={mode}
        hintsAllowed={hintsAllowed}
        submitted={submitted}
        onSubmit={record}
        testIdPrefix={testIdPrefix}
        draftPrefix={draftPrefix}
      />
      {submitted && mode === 'immediate' && (
        <div className="btn-row">
          <button type="button" className="btn btn-primary" onClick={() => advance()} data-testid={`${testIdPrefix}-next`}>
            {index + 1 >= total ? t('quiz.finish') : t('quiz.nextQuestion')}
          </button>
        </div>
      )}
    </div>
  );
}

function QuestionView({
  question,
  mode,
  hintsAllowed,
  submitted,
  onSubmit,
  testIdPrefix,
  draftPrefix,
}: {
  question: Question;
  mode: 'immediate' | 'exam';
  hintsAllowed: number;
  submitted: boolean;
  onSubmit: (a: QuizAnswer) => void;
  testIdPrefix: string;
  draftPrefix: string;
}) {
  const { t, l } = useI18n();
  const [selected, setSelected] = useState<number[]>([]);
  const [text, setText] = useState('');
  const [lastGrade, setLastGrade] = useState<GradeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (question.type === 'choice') {
    const correctSet = question.options.map((o, i) => (o.correct ? i : -1)).filter((i) => i >= 0);
    const showFeedback = submitted && mode === 'immediate';
    const toggle = (i: number) => {
      if (submitted) return;
      if (question.multiple) setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
      else setSelected([i]);
    };
    const submit = () => {
      if (selected.length === 0) {
        setError(t('quiz.unanswered'));
        return;
      }
      setError(null);
      const correct = selected.length === correctSet.length && selected.every((i) => correctSet.includes(i));
      onSubmit({ questionId: question.id, correct, concepts: question.concepts, selected });
    };
    return (
      <div>
        <Blocks blocks={question.prompt} />
        <p className="small muted">{question.multiple ? t('quiz.chooseMultiple') : t('quiz.choose')}</p>
        <ul className="option-list" role={question.multiple ? 'group' : 'radiogroup'}>
          {question.options.map((o, i) => {
            const isSel = selected.includes(i);
            let cls = 'option';
            if (showFeedback && isSel) cls += o.correct ? ' correct' : ' wrong';
            else if (showFeedback && o.correct) cls += ' correct';
            else if (isSel) cls += ' selected';
            return (
              <li key={i}>
                <label className={cls} data-testid={`${testIdPrefix}-option-${i}`}>
                  <input type={question.multiple ? 'checkbox' : 'radio'} name={question.id} checked={isSel} onChange={() => toggle(i)} disabled={submitted} />
                  <span style={{ flex: 1 }}>
                    <Inline text={l(o.text)} />
                    {showFeedback && (isSel || o.correct) && o.feedback && (
                      <span className="feedback" style={{ display: 'block' }}>
                        <Inline text={l(o.feedback)} />
                      </span>
                    )}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
        {error && <p className="small" style={{ color: 'var(--danger)' }}>{error}</p>}
        {showFeedback && (
          <Notice tone={selected.every((i) => correctSet.includes(i)) && selected.length === correctSet.length ? 'success' : 'warning'}>
            <strong>{selected.every((i) => correctSet.includes(i)) && selected.length === correctSet.length ? t('quiz.correct') : t('quiz.incorrect')}</strong>
            {question.explanation && (
              <p style={{ marginTop: '0.3rem' }}>
                <Inline text={l(question.explanation)} />
              </p>
            )}
          </Notice>
        )}
        {!submitted && (
          <div className="btn-row" style={{ marginTop: '0.6rem' }}>
            <button type="button" className="btn btn-primary" onClick={submit} data-testid={`${testIdPrefix}-submit`}>
              {t('quiz.submit')}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (question.type === 'predict') {
    const showFeedback = submitted && mode === 'immediate';
    const correct = isPredictCorrect(question.answer, text, question.loose);
    const submit = () => {
      if (text.trim() === '') {
        setError(t('quiz.unanswered'));
        return;
      }
      setError(null);
      onSubmit({ questionId: question.id, correct, concepts: question.concepts, text });
    };
    return (
      <div>
        <p>{question.prompt ? <Inline text={l(question.prompt)} /> : t('quiz.predictLabel')}</p>
        <div className="code-block">
          <pre>
            <code>{question.code}</code>
          </pre>
        </div>
        <label className="small" htmlFor={`${testIdPrefix}-predict`}>
          {t('lesson.predictInput')}
        </label>
        <textarea
          id={`${testIdPrefix}-predict`}
          className="predict-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={submitted}
          data-testid={`${testIdPrefix}-predict`}
          spellCheck={false}
        />
        {error && <p className="small" style={{ color: 'var(--danger)' }}>{error}</p>}
        {showFeedback && (
          <Notice tone={correct ? 'success' : 'warning'}>
            <strong>{correct ? t('quiz.correct') : t('quiz.incorrect')}</strong>
            {!correct && (
              <div className="diff-box" style={{ marginTop: '0.3rem' }}>
                <span className="label">{t('quiz.correctAnswer')}</span>
                {Array.isArray(question.answer) ? question.answer[0] : question.answer}
              </div>
            )}
            <p style={{ marginTop: '0.3rem' }}>
              <Inline text={l(question.explanation)} />
            </p>
          </Notice>
        )}
        {!submitted && (
          <div className="btn-row" style={{ marginTop: '0.6rem' }}>
            <button type="button" className="btn btn-primary" onClick={submit} data-testid={`${testIdPrefix}-submit`}>
              {t('quiz.submit')}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Coding question
  const exercise = useMemo(
    () => ({
      id: question.id,
      title: question.title,
      mode: question.mode,
      instructions: question.instructions,
      starterCode: question.starterCode,
      sampleStdin: question.sampleStdin,
      check: question.check,
      hints: question.hints,
      solution: question.solution,
      concepts: question.concepts,
    }),
    [question],
  );
  const submitCode = () => {
    onSubmit({ questionId: question.id, correct: lastGrade?.passed ?? false, concepts: question.concepts });
  };
  return (
    <div className="stack">
      <ExercisePanel
        exercise={exercise}
        exam={mode === 'exam' ? { hintsAllowed } : undefined}
        onResult={(_p, grade) => setLastGrade(grade)}
        draftKey={`${draftPrefix}${question.id}`}
        testIdPrefix={`${testIdPrefix}-code`}
      />
      {submitted && mode === 'immediate' && (
        <Notice tone={lastGrade?.passed ? 'success' : 'warning'}>{lastGrade?.passed ? t('quiz.codePassed') : t('quiz.codeFailed')}</Notice>
      )}
      {!submitted && (
        <div className="btn-row">
          <button type="button" className="btn btn-primary" onClick={submitCode} disabled={!lastGrade} data-testid={`${testIdPrefix}-submit`}>
            {t('quiz.submitCode')}
          </button>
          {lastGrade && <Badge tone={lastGrade.passed ? 'success' : 'warning'}>{lastGrade.passed ? t('quiz.codePassed') : t('quiz.codeFailed')}</Badge>}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onSubmit({ questionId: question.id, correct: false, concepts: question.concepts, skipped: true })}
          >
            {t('quiz.skipCode')}
          </button>
        </div>
      )}
    </div>
  );
}

/** After an exam: show each question with the learner's answer and the explanation. */
export function QuizReview({ questions, answers }: { questions: Question[]; answers: QuizAnswer[] }) {
  const { t, l } = useI18n();
  return (
    <ol className="stack" style={{ listStyle: 'none', padding: 0 }}>
      {questions.map((q, i) => {
        const a = answers.find((x) => x.questionId === q.id);
        return (
          <li key={q.id} className={`check-item ${a?.correct ? 'pass' : 'fail'}`}>
            <div className="check-item-title">
              <span aria-hidden="true">{a?.correct ? '✓' : '✗'}</span> {t('quiz.question', { n: i + 1, total: questions.length })}
              {a?.skipped && <Badge tone="warning">{t('quiz.skipCode')}</Badge>}
            </div>
            {q.type === 'choice' && (
              <div className="small" style={{ marginTop: '0.3rem' }}>
                <Blocks blocks={q.prompt} />
                <ul>
                  {q.options.map((o, oi) => (
                    <li key={oi}>
                      {o.correct ? '✓ ' : a?.selected?.includes(oi) ? '✗ ' : '• '}
                      <Inline text={l(o.text)} />
                      {(o.correct || a?.selected?.includes(oi)) && o.feedback && (
                        <span className="muted">
                          {' '}
                          — <Inline text={l(o.feedback)} />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                {q.explanation && (
                  <p>
                    <Inline text={l(q.explanation)} />
                  </p>
                )}
              </div>
            )}
            {q.type === 'predict' && (
              <div className="small" style={{ marginTop: '0.3rem' }}>
                <div className="code-block">
                  <pre>
                    <code>{q.code}</code>
                  </pre>
                </div>
                <div className="diff-grid">
                  <div className="diff-box">
                    <span className="label">{t('quiz.yourAnswer')}</span>
                    {a?.text ?? ''}
                  </div>
                  <div className="diff-box">
                    <span className="label">{t('quiz.correctAnswer')}</span>
                    {Array.isArray(q.answer) ? q.answer[0] : q.answer}
                  </div>
                </div>
                <p>
                  <Inline text={l(q.explanation)} />
                </p>
              </div>
            )}
            {q.type === 'code' && (
              <div className="small" style={{ marginTop: '0.3rem' }}>
                <strong>{l(q.title)}</strong>
                <details>
                  <summary>{t('exercise.showSolution')}</summary>
                  <div className="code-block" style={{ marginTop: '0.4rem' }}>
                    <pre>
                      <code>{q.solution}</code>
                    </pre>
                  </div>
                </details>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
