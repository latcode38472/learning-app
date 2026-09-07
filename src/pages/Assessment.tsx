import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { Assessment, Question } from '@/content/schema';
import { assessments, conceptToLesson, lessons, moduleById, modules } from '@/content';
import { hasMissingTranslation, localeTag, useI18n } from '@/i18n';
import { languageInfo } from '@/i18n/languages';
import { useStore } from '@/state/store';
import { allLessonsDone, canTakeModuleTest, isModuleCompleted } from '@/state/unlock';
import { setTutorContext } from '@/tutor/context';
import { Blocks } from '@/components/Blocks';
import { QuizReview, QuizRunner, type QuizAnswer } from '@/components/QuizRunner';
import { Badge, Notice, useDocumentTitle } from '@/components/ui';
import { NotFoundPage } from './NotFound';

/** Deterministic variant selection: attempt N picks a different variant of each pool. */
export function pickVariants(assessment: Assessment, attempt: number): Question[] {
  return assessment.pools.map((pool, i) => pool.variants[(attempt + i) % pool.variants.length]);
}

export function AssessmentPage() {
  const { assessmentId = '' } = useParams();
  const assessment = assessments[assessmentId];
  if (!assessment) return <NotFoundPage />;
  return <AssessmentView key={assessment.id} assessment={assessment} />;
}

function AssessmentView({ assessment }: { assessment: Assessment }) {
  const { t, l, lang } = useI18n();
  const fellBack = useMemo(() => hasMissingTranslation(assessment, lang), [assessment, lang]);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const fromPlacement = params.get('from') === 'placement';
  const progress = useStore((s) => s.progress);
  const recordAttempt = useStore((s) => s.recordAssessmentAttempt);
  const recordConcept = useStore((s) => s.recordConceptResult);
  const markTestedOut = useStore((s) => s.markTestedOut);
  useDocumentTitle(l(assessment.title));

  const mod = assessment.moduleId ? moduleById[assessment.moduleId] : undefined;
  const ap = progress.assessments[assessment.id];
  const attemptNumber = ap?.attemptCount ?? ap?.attempts.length ?? 0;
  const [phase, setPhase] = useState<'intro' | 'running' | 'results'>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [outcome, setOutcome] = useState<{ score: number; passed: boolean; unlockedNext: boolean; testedOut: boolean } | null>(null);
  const allowed = mod ? canTakeModuleTest(mod.id, progress) : true;
  const wasTestOut = mod ? !allLessonsDone(mod.id, progress) : false;

  useEffect(() => {
    setTutorContext({ examMode: phase === 'running', lessonId: undefined, lessonTitle: l(assessment.title), learnedConcepts: [] });
    return () => setTutorContext({ examMode: false });
  }, [phase, assessment.title, l]);

  const start = () => {
    setQuestions(pickVariants(assessment, attemptNumber));
    setAnswers([]);
    setPhase('running');
  };

  const finish = (all: QuizAnswer[]) => {
    const correct = all.filter((a) => a.correct).length;
    const score = all.length ? correct / all.length : 0;
    const passed = score >= assessment.passScore;
    const wrong = new Set<string>();
    const right = new Set<string>();
    for (const a of all) for (const c of a.concepts) (a.correct ? right : wrong).add(c);
    for (const c of wrong) recordConcept(c, false);
    for (const c of right) if (!wrong.has(c)) recordConcept(c, true);
    recordAttempt(assessment.id, { at: new Date().toISOString(), score, passed, wrongConcepts: [...wrong], correctConcepts: [...right] });
    let unlockedNext = false;
    let testedOut = false;
    if (passed && mod) {
      const before = isModuleCompleted(mod.id, progress);
      if (wasTestOut) {
        markTestedOut(mod.id);
        testedOut = true;
      }
      unlockedNext = !before;
    }
    setAnswers(all);
    setOutcome({ score, passed, unlockedNext, testedOut });
    setPhase('results');
  };

  const weakLessons = useMemo(() => {
    if (!outcome) return [];
    const wrong = new Set(answers.filter((a) => !a.correct).flatMap((a) => a.concepts));
    const ids = new Set<string>();
    for (const c of wrong) if (conceptToLesson[c]) ids.add(conceptToLesson[c]);
    return [...ids].map((id) => lessons[id]).filter(Boolean);
  }, [answers, outcome]);

  const nextModule = mod ? modules.find((m) => m.prerequisites.includes(mod.id) && m.status === 'available') : undefined;

  if (phase === 'running') {
    return (
      <div className="stack" data-testid="assessment-running">
        <div className="section-head">
          <h1 style={{ margin: 0 }}>{l(assessment.title)}</h1>
          <Badge tone="warning">{t('quiz.examMode')}</Badge>
        </div>
        <Notice tone="info">{t('quiz.examModeNote', { hints: assessment.hintsAllowed })}</Notice>
        <div className="card">
          <QuizRunner questions={questions} mode="exam" hintsAllowed={assessment.hintsAllowed} onFinish={finish} testIdPrefix="exam" draftPrefix={`${assessment.id}:${attemptNumber}:`} />
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPhase('intro')}>
          {t('quiz.cancel')}
        </button>
      </div>
    );
  }

  if (phase === 'results' && outcome) {
    return (
      <div className="stack" data-testid="assessment-results">
        <h1>
          {t('quiz.resultsTitle')}: {l(assessment.title)}
        </h1>
        <Notice tone={outcome.passed ? 'success' : 'warning'} title={outcome.passed ? t('quiz.passed') : t('quiz.failed')}>
          <div data-testid="assessment-score">{t('quiz.score', { score: Math.round(outcome.score * 100) })} · {t('quiz.passMark', { score: Math.round(assessment.passScore * 100) })}</div>
          {outcome.testedOut && <div>{t('quiz.testedOut')}</div>}
          {outcome.passed && outcome.unlockedNext && nextModule && <div>{t('quiz.unlockedNext')}</div>}
        </Notice>
        <div className="btn-row">
          {mod && (
            <Link to={`/module/${mod.id}`} className="btn">
              {t('lesson.backToModule')}
            </Link>
          )}
          {outcome.passed && nextModule && (
            <Link to={`/module/${nextModule.id}`} className="btn btn-primary" data-testid="go-next-module">
              {l(nextModule.title)} →
            </Link>
          )}
          {fromPlacement && (
            <Link to="/placement" className="btn btn-primary">
              {t('placement.title')}
            </Link>
          )}
          <button type="button" className="btn" onClick={start} data-testid="assessment-retry">
            {t('quiz.retry')}
          </button>
        </div>
        <section className="card">
          <h2>{t('quiz.reviewPath')}</h2>
          {weakLessons.length === 0 ? (
            <p className="muted">{t('quiz.allGood')}</p>
          ) : (
            <>
              <p>{t('quiz.reviewPathIntro')}</p>
              <ul>
                {weakLessons.map((ls) => (
                  <li key={ls.id}>
                    <Link to={`/lesson/${ls.id}`}>{l(ls.title)}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
        <section className="card">
          <h2>{t('quiz.review')}</h2>
          <QuizReview questions={questions} answers={answers} />
        </section>
      </div>
    );
  }

  return (
    <div className="stack" data-testid="assessment-intro">
      <div>
        <div className="small muted">
          {mod && (
            <>
              <Link to={`/module/${mod.id}`}>{l(mod.title)}</Link> ·{' '}
            </>
          )}
          {t('curriculum.moduleTest')}
        </div>
        <h1>{l(assessment.title)}</h1>
        <Blocks blocks={assessment.description} />
        <div className="pill-row">
          <Badge>{t('quiz.timeEstimate', { minutes: assessment.estimatedMinutes })}</Badge>
          <Badge>{t('quiz.passMark', { score: Math.round(assessment.passScore * 100) })}</Badge>
          <Badge>{t('quiz.hintsLeft', { count: assessment.hintsAllowed })}</Badge>
          {ap?.passed && <Badge tone="success">{t('quiz.passed')}</Badge>}
        </div>
      </div>
      <Notice tone="info" title={t('quiz.examMode')}>
        {t('quiz.examModeNote', { hints: assessment.hintsAllowed })}
      </Notice>
      {fellBack && <Notice tone="warning">{t('lesson.fallbackNotice', { language: languageInfo(lang).nativeName })}</Notice>}
      {!allowed && <Notice tone="warning">{t('placement.lockedUntil')}</Notice>}
      <div className="btn-row">
        <button type="button" className="btn btn-primary btn-lg" onClick={start} disabled={!allowed} data-testid="assessment-start">
          {t('quiz.startTest')}
        </button>
        <button type="button" className="btn" onClick={() => navigate(-1)}>
          {t('common.back')}
        </button>
      </div>
      {ap && ap.attempts.length > 0 && (
        <section className="card-soft">
          <strong>{t('quiz.attemptsHistory')}</strong> · {t('quiz.bestScore', { score: Math.round(ap.best * 100) })}
          <ul className="small" style={{ marginTop: '0.4rem' }}>
            {ap.attempts
              .slice()
              .reverse()
              .slice(0, 5)
              .map((a, i) => (
                <li key={i}>
                  {new Date(a.at).toLocaleString(localeTag(lang))} — {t('quiz.score', { score: Math.round(a.score * 100) })} — {a.passed ? t('quiz.passed') : t('quiz.failed')}
                </li>
              ))}
          </ul>
        </section>
      )}
    </div>
  );
}
