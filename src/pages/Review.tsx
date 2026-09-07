import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Question } from '@/content/schema';
import { assessments, conceptToLesson, glossaryById, lessonOrder, lessons } from '@/content';
import { useI18n } from '@/i18n';
import { useStore } from '@/state/store';
import { daysUntil, isWeak } from '@/state/review';
import { dueConceptIds, isLessonLearned } from '@/state/unlock';
import { QuizRunner, type QuizAnswer } from '@/components/QuizRunner';
import { Notice, useDocumentTitle } from '@/components/ui';

/** Pick review questions about the due concepts from lessons the learner completed. */
export function buildReviewQuestions(due: Set<string>, completedLessons: Set<string>, limit = 10): Question[] {
  const pool: Question[] = [];
  for (const id of lessonOrder) {
    if (!completedLessons.has(id)) continue;
    const lesson = lessons[id];
    for (const q of lesson.check) if (q.concepts.some((c) => due.has(c))) pool.push(q);
  }
  for (const a of Object.values(assessments)) {
    if (a.kind !== 'module-test') continue;
    for (const p of a.pools) {
      for (const q of p.variants) {
        if (q.type === 'code') continue; // keep reviews quick
        if (q.concepts.some((c) => due.has(c) && completedLessons.has(conceptToLesson[c] ?? ''))) pool.push(q);
      }
    }
  }
  // Spread across concepts: one question per concept first, then fill.
  const chosen: Question[] = [];
  const seenConcepts = new Set<string>();
  for (const q of pool) {
    if (chosen.length >= limit) break;
    if (q.concepts.some((c) => due.has(c) && !seenConcepts.has(c))) {
      chosen.push(q);
      q.concepts.forEach((c) => seenConcepts.add(c));
    }
  }
  for (const q of pool) {
    if (chosen.length >= limit) break;
    if (!chosen.includes(q)) chosen.push(q);
  }
  return chosen;
}

export function ReviewPage() {
  const { t, l } = useI18n();
  const progress = useStore((s) => s.progress);
  const recordConcept = useStore((s) => s.recordConceptResult);
  const recordReviewSession = useStore((s) => s.recordReviewSession);
  useDocumentTitle(t('review.title'));
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState<QuizAnswer[] | null>(null);

  // Only concepts from lessons the learner has actually learned (completed, or module tested out) are reviewable.
  const due = useMemo(() => new Set(dueConceptIds(progress)), [progress]);
  const completedLessons = useMemo(() => new Set(lessonOrder.filter((id) => isLessonLearned(id, progress))), [progress]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const weak = Object.entries(progress.concepts).filter(([id, s]) => isWeak(s) && conceptToLesson[id] && isLessonLearned(conceptToLesson[id], progress));
  const nextDue = Object.entries(progress.concepts)
    .filter(([id]) => conceptToLesson[id] && isLessonLearned(conceptToLesson[id], progress))
    .map(([, s]) => daysUntil(s.nextReview))
    .filter((d) => d > 0)
    .sort((a, b) => a - b)[0];

  const start = () => {
    const qs = buildReviewQuestions(due, completedLessons);
    setQuestions(qs);
    setFinished(null);
    setRunning(qs.length > 0);
  };

  return (
    <div className="stack" data-testid="review">
      <div>
        <h1>{t('review.title')}</h1>
        <p className="muted">{t('review.intro')}</p>
      </div>

      {running && !finished ? (
        <section className="card">
          {questions.length === 0 ? (
            <p className="muted">{t('review.nothingDue')}</p>
          ) : (
            <QuizRunner
              questions={questions}
              mode="immediate"
              testIdPrefix="review"
              onAnswer={(a) => {
                for (const c of a.concepts) recordConcept(c, a.correct);
              }}
              onFinish={(answers) => {
                setFinished(answers);
                setRunning(false);
                recordReviewSession();
              }}
            />
          )}
        </section>
      ) : (
        <section className="card stack-sm">
          {finished && (
            <Notice tone="success" title={t('review.finished')}>
              {t('quiz.score', { score: Math.round((finished.filter((a) => a.correct).length / Math.max(1, finished.length)) * 100) })}
            </Notice>
          )}
          {due.size > 0 ? (
            <>
              <p>{t('review.due', { count: due.size })}</p>
              <button type="button" className="btn btn-primary" onClick={start} data-testid="review-start">
                {t('review.start')}
              </button>
            </>
          ) : (
            <p className="muted">
              {t('review.nothingDue')}{' '}
              {nextDue !== undefined && (
                <span>{t('review.nextDue', { when: nextDue === 1 ? t('common.tomorrow') : t('common.inDays', { count: nextDue }) })}</span>
              )}
            </p>
          )}
        </section>
      )}

      <section className="card stack-sm">
        <h2>{t('review.weakTitle')}</h2>
        <p className="muted small">{t('review.weakIntro')}</p>
        {weak.length === 0 ? (
          <p className="muted">{t('review.noWeak')}</p>
        ) : (
          <ul className="lesson-list">
            {weak.map(([id, s]) => {
              const lessonId = conceptToLesson[id];
              const lesson = lessonId ? lessons[lessonId] : undefined;
              const g = glossaryById[id];
              return (
                <li key={id} className="lesson-row">
                  <div className="grow">
                    <div className="title">{g ? l(g.name) || g.term : id}</div>
                    <div className="small muted">{t('review.accuracy', { correct: s.correct, wrong: s.wrong })}</div>
                  </div>
                  {lesson && (
                    <Link to={`/lesson/${lesson.id}`} className="btn btn-sm">
                      {t('review.practiceLesson')}: {l(lesson.title)}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
