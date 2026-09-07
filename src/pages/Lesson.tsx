import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Lesson } from '@/content/schema';
import { conceptsKnownAt, glossaryById, lessons, moduleById, nextLessonId, previousLessonId } from '@/content';
import { hasMissingTranslation, useI18n } from '@/i18n';
import { languageInfo } from '@/i18n/languages';
import { useStore } from '@/state/store';
import { isLessonCompleted, isLessonUnlocked, lessonBlockedBy } from '@/state/unlock';
import { runtime, type RunResult } from '@/runtime/runner';
import { setTutorContext } from '@/tutor/context';
import { Blocks } from '@/components/Blocks';
import { ExercisePanel } from '@/components/ExercisePanel';
import { Inline } from '@/components/InlineText';
import { QuizRunner, isPredictCorrect, type QuizAnswer } from '@/components/QuizRunner';
import { Badge, Notice, useDocumentTitle } from '@/components/ui';
import { NotFoundPage } from './NotFound';

export function LessonPage() {
  const { lessonId = '' } = useParams();
  const lesson = lessons[lessonId];
  if (!lesson) return <NotFoundPage />;
  return <LessonView key={lesson.id} lesson={lesson} />;
}

function LessonView({ lesson }: { lesson: Lesson }) {
  const { t, l, lang } = useI18n();
  const progress = useStore((s) => s.progress);
  const pace = useStore((s) => s.settings.pace);
  const startLesson = useStore((s) => s.startLesson);
  const completeLesson = useStore((s) => s.completeLesson);
  const markPredictDone = useStore((s) => s.markPredictDone);
  const markCheckDone = useStore((s) => s.markCheckDone);
  const recordConcept = useStore((s) => s.recordConceptResult);
  useDocumentTitle(l(lesson.title));

  const mod = moduleById[lesson.moduleId];
  const unlocked = isLessonUnlocked(lesson.id, progress);
  const completed = isLessonCompleted(lesson.id, progress);
  const lp = progress.lessons[lesson.id];
  const exercisePassed = progress.exercises[lesson.exercise.id]?.passed ?? false;
  const buildPassed = progress.exercises[lesson.build.id]?.passed ?? false;
  const prevId = previousLessonId(lesson.id);
  const nextId = nextLessonId(lesson.id);
  const blockedBy = lessonBlockedBy(lesson.id, progress);
  const fellBack = useMemo(() => hasMissingTranslation(lesson, lang), [lesson, lang]);

  const [showSimpler, setShowSimpler] = useState(pace === 'slow');
  const [examplesShown, setExamplesShown] = useState(pace === 'slow' ? lesson.moreExamples.length : 0);
  const [showHarder, setShowHarder] = useState(false);
  const [checkResult, setCheckResult] = useState<QuizAnswer[] | null>(null);

  useEffect(() => {
    if (unlocked) startLesson(lesson.id);
  }, [lesson.id, startLesson, unlocked]);

  useEffect(() => {
    setTutorContext({
      lessonId: lesson.id,
      lessonTitle: l(lesson.title),
      lessonObjective: l(lesson.objective),
      learnedConcepts: Array.from(conceptsKnownAt(lesson.id, true)),
      examMode: false,
      lastError: null,
      lastGrade: null,
    });
  }, [lesson, l]);

  useEffect(() => {
    if (exercisePassed && buildPassed && !completed) completeLesson(lesson.id);
  }, [exercisePassed, buildPassed, completed, completeLesson, lesson.id]);

  if (!unlocked) {
    const blocker = blockedBy ? lessons[blockedBy] : undefined;
    return (
      <div className="card" style={{ maxWidth: 640, margin: '2rem auto' }} data-testid="lesson-locked">
        <h1>{t('lesson.lockedTitle')}</h1>
        {blocker ? (
          <>
            <p>{t('lesson.lockedBody', { lesson: l(blocker.title) })}</p>
            <Link to={`/lesson/${blocker.id}`} className="btn btn-primary">
              {t('lesson.goToLesson')}
            </Link>
          </>
        ) : (
          <p>{t('curriculum.unlockByCompleting', { modules: mod ? l(mod.title) : '' })}</p>
        )}{' '}
        <Link to={mod ? `/module/${mod.id}` : '/curriculum'} className="btn">
          {t('lesson.backToModule')}
        </Link>
      </div>
    );
  }

  const sections = [
    { id: 'objective', label: t('lesson.objective'), done: true },
    { id: 'explanation', label: t('lesson.explanation'), done: true },
    { id: 'example', label: t('lesson.workedExample'), done: true },
    { id: 'predict', label: t('lesson.predict'), done: !!lp?.predictDone },
    { id: 'exercise', label: t('lesson.exercise'), done: exercisePassed },
    { id: 'build', label: t('lesson.build'), done: buildPassed },
    { id: 'check', label: t('lesson.understandingCheck'), done: !!lp?.checkDone },
    { id: 'recap', label: t('lesson.recap'), done: completed },
  ];

  const Head = ({ n, id }: { n: number; id: string }) => {
    const s = sections[n - 1];
    return (
      <div className={`section-head${s.done && n > 3 ? ' section-done' : ''}`}>
        <span className="section-num" aria-hidden="true">
          {s.done && n > 3 ? '✓' : n}
        </span>
        <h2 id={id} style={{ margin: 0 }}>
          {s.label}
        </h2>
        <span className="sr-only">{t('lesson.section', { n })}</span>
      </div>
    );
  };

  return (
    <div className="lesson-layout" data-testid={`lesson-${lesson.id}`}>
      <article className="stack">
        <header>
          <div className="small muted">
            <Link to="/curriculum">{t('nav.curriculum')}</Link> · <Link to={`/module/${lesson.moduleId}`}>{mod ? l(mod.title) : lesson.moduleId}</Link>
          </div>
          <h1>{l(lesson.title)}</h1>
          <p className="muted">{l(lesson.tagline)}</p>
          <div className="pill-row">
            <Badge>{t('lesson.minutes', { count: lesson.estimatedMinutes })}</Badge>
            {completed && <Badge tone="success">{t('lesson.completed')}</Badge>}
            {lesson.runsInBrowser ? <Badge tone="info">{t('curriculum.computeBrowser')}</Badge> : <Badge tone="warning">{t('lesson.runningNeedsLocal')}</Badge>}
          </div>
          {fellBack && (
            <div style={{ marginTop: '0.6rem' }}>
              <Notice tone="warning">{t('lesson.fallbackNotice', { language: languageInfo(lang).nativeName })}</Notice>
            </div>
          )}
          {lesson.needsLocalSetup && (
            <div style={{ marginTop: '0.6rem' }}>
              <Notice tone="warning">
                <Inline text={l(lesson.needsLocalSetup)} />
              </Notice>
            </div>
          )}
        </header>

        {/* 1. Objective */}
        <section className="card lesson-section" id="objective" aria-labelledby="h-objective">
          <Head n={1} id="h-objective" />
          <p>
            <strong>
              <Inline text={l(lesson.objective)} />
            </strong>
          </p>
          <p className="small">
            <strong>{t('lesson.prerequisiteCheck')}:</strong> <Inline text={l(lesson.prerequisiteCheck)} />
          </p>
          <div className="pill-row">
            {lesson.introduces.map((c) => (
              <Badge key={c} tone="primary">
                {glossaryById[c] ? l(glossaryById[c].name) || glossaryById[c].term : c}
              </Badge>
            ))}
          </div>
        </section>

        {/* 2. Explanation */}
        <section className="card lesson-section" id="explanation" aria-labelledby="h-explanation">
          <Head n={2} id="h-explanation" />
          <Blocks blocks={lesson.explanation} />
          <button type="button" className="btn btn-sm" onClick={() => setShowSimpler((s) => !s)} aria-expanded={showSimpler} data-testid="explain-simpler">
            {showSimpler ? t('lesson.hideSimpler') : t('lesson.explainSimpler')}
          </button>
          {showSimpler && (
            <div className="card-soft" style={{ marginTop: '0.8rem' }} data-testid="simpler">
              <Blocks blocks={lesson.simpler} />
            </div>
          )}
        </section>

        {/* 3. Worked example */}
        <section className="card lesson-section" id="example" aria-labelledby="h-example">
          <Head n={3} id="h-example" />
          <Blocks blocks={lesson.workedExample} />
          {lesson.moreExamples.slice(0, examplesShown).map((ex, i) => (
            <div key={i} className="card-soft" style={{ marginTop: '0.8rem' }} data-testid={`extra-example-${i}`}>
              <Blocks blocks={ex} />
            </div>
          ))}
          <div className="btn-row" style={{ marginTop: '0.8rem' }}>
            {examplesShown < lesson.moreExamples.length ? (
              <button type="button" className="btn btn-sm" onClick={() => setExamplesShown((n) => n + 1)} data-testid="another-example">
                {t('lesson.anotherExample')}
              </button>
            ) : (
              <span className="small muted">{t('lesson.noMoreExamples')}</span>
            )}
            {lesson.harderChallenge && (
              <button type="button" className="btn btn-sm" onClick={() => setShowHarder((s) => !s)} aria-expanded={showHarder} data-testid="harder-challenge">
                {showHarder ? t('lesson.hideHarder') : t('lesson.harderChallenge')}
              </button>
            )}
          </div>
          {showHarder && lesson.harderChallenge && (
            <div style={{ marginTop: '1rem' }}>
              <ExercisePanel exercise={lesson.harderChallenge} heading={t('lesson.harderChallenge')} testIdPrefix="harder" />
            </div>
          )}
        </section>

        {/* 4. Predict */}
        <section className="card lesson-section" id="predict" aria-labelledby="h-predict">
          <Head n={4} id="h-predict" />
          <PredictSection
            lesson={lesson}
            onAnswered={(correct) => {
              markPredictDone(lesson.id);
              for (const c of lesson.introduces) recordConcept(c, correct);
            }}
          />
        </section>

        {/* 5. Exercise */}
        <section className="card lesson-section" id="exercise" aria-labelledby="h-exercise">
          <Head n={5} id="h-exercise" />
          <ExercisePanel exercise={lesson.exercise} testIdPrefix="exercise" />
        </section>

        {/* 6. Build */}
        <section className="card lesson-section" id="build" aria-labelledby="h-build">
          <Head n={6} id="h-build" />
          <ExercisePanel exercise={lesson.build} testIdPrefix="build" />
        </section>

        {/* 7. Understanding check */}
        <section className="card lesson-section" id="check" aria-labelledby="h-check">
          <Head n={7} id="h-check" />
          {checkResult ? (
            <Notice tone={checkResult.every((a) => a.correct) ? 'success' : 'warning'}>
              <strong>{checkResult.every((a) => a.correct) ? t('quiz.understandingPassed') : t('quiz.understandingFailed')}</strong>{' '}
              <span className="small">
                {t('quiz.score', { score: Math.round((checkResult.filter((a) => a.correct).length / checkResult.length) * 100) })}
              </span>{' '}
              <button type="button" className="btn btn-sm" onClick={() => setCheckResult(null)}>
                {t('quiz.retry')}
              </button>
            </Notice>
          ) : (
            <QuizRunner
              questions={lesson.check}
              mode="immediate"
              testIdPrefix="check"
              onAnswer={(a) => {
                for (const c of a.concepts) recordConcept(c, a.correct);
              }}
              onFinish={(answers) => {
                setCheckResult(answers);
                markCheckDone(lesson.id);
              }}
            />
          )}
        </section>

        {/* 8. Recap */}
        <section className="card lesson-section" id="recap" aria-labelledby="h-recap">
          <Head n={8} id="h-recap" />
          <Blocks blocks={lesson.recap} />
          <div className="callout callout-why">
            <div className="callout-title">{t('lesson.next')}</div>
            <p>
              <Inline text={l(lesson.next)} />
            </p>
          </div>
          {completed ? (
            <Notice tone="success" title={t('lesson.completed')}>
              {nextId ? (
                <Link to={`/lesson/${nextId}`} className="btn btn-primary" data-testid="next-lesson">
                  {t('lesson.nextLesson')}: {l(lessons[nextId].title)}
                </Link>
              ) : (
                <Link to={`/module/${lesson.moduleId}`} className="btn btn-primary">
                  {t('lesson.backToModule')}
                </Link>
              )}
            </Notice>
          ) : (
            <Notice tone="info">{t('lesson.completeRequirements')}</Notice>
          )}
        </section>

        <nav className="lesson-nav" aria-label="Lesson navigation">
          {prevId ? (
            <Link to={`/lesson/${prevId}`} className="btn">
              ← {t('lesson.previousLesson')}
            </Link>
          ) : (
            <span />
          )}
          {nextId &&
            (isLessonUnlocked(nextId, progress) ? (
              <Link to={`/lesson/${nextId}`} className={`btn${completed ? ' btn-primary' : ''}`}>
                {t('lesson.nextLesson')} →
              </Link>
            ) : (
              <button type="button" className="btn" disabled title={t('lesson.completeRequirements')}>
                {t('lesson.nextLesson')} →
              </button>
            ))}
        </nav>
      </article>

      <aside className="lesson-side card" aria-label={t('lesson.sections')}>
        <ol className="toc">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>
                <span className={`dot${s.done && i >= 3 ? ' done' : ''}`} aria-hidden="true" />
                <span>
                  {i + 1}. {s.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
        <hr />
        <div className="small muted">{t('lesson.concepts')}</div>
        <div className="pill-row" style={{ marginTop: '0.3rem' }}>
          {lesson.introduces.map((c) => (
            <Badge key={c}>{glossaryById[c] ? glossaryById[c].term : c}</Badge>
          ))}
        </div>
        <hr />
        <Link to="/local" className="small">
          {t('nav.continueLocally')}
        </Link>
      </aside>
    </div>
  );
}

function PredictSection({ lesson, onAnswered }: { lesson: Lesson; onAnswered: (correct: boolean) => void }) {
  const { t, l } = useI18n();
  const predict = lesson.predict;
  const [text, setText] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState<boolean | null>(null);
  const [run, setRun] = useState<RunResult | null>(null);

  const check = () => {
    let correct = false;
    if (predict.options) {
      if (selected === null) return;
      correct = !!predict.options[selected]?.correct;
    } else {
      if (text.trim() === '') return;
      correct = isPredictCorrect(predict.answer ?? '', text, predict.loose);
    }
    setChecked(correct);
    onAnswered(correct);
  };

  const runIt = async () => setRun(await runtime.run(predict.code));

  return (
    <div className="stack-sm">
      <p>{predict.prompt ? <Inline text={l(predict.prompt)} /> : t('lesson.predictPrompt')}</p>
      <div className="code-block">
        <pre>
          <code>{predict.code}</code>
        </pre>
      </div>
      {predict.options ? (
        <ul className="option-list">
          {predict.options.map((o, i) => (
            <li key={i}>
              <label className={`option${checked !== null && i === selected ? (o.correct ? ' correct' : ' wrong') : selected === i ? ' selected' : ''}${checked !== null && o.correct ? ' correct' : ''}`}>
                <input type="radio" name="predict" checked={selected === i} onChange={() => setSelected(i)} disabled={checked !== null} />
                <span>
                  <Inline text={l(o.text)} />
                  {checked !== null && (i === selected || o.correct) && o.feedback && (
                    <span className="feedback" style={{ display: 'block' }}>
                      <Inline text={l(o.feedback)} />
                    </span>
                  )}
                </span>
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <label className="small" htmlFor="predict-input">
            {t('lesson.predictInput')}
          </label>
          <textarea id="predict-input" className="predict-input" value={text} onChange={(e) => setText(e.target.value)} disabled={checked !== null} data-testid="predict-input" spellCheck={false} />
        </div>
      )}
      <div className="btn-row">
        {checked === null && (
          <button type="button" className="btn btn-primary" onClick={check} data-testid="predict-check">
            {t('lesson.check')}
          </button>
        )}
        <button type="button" className="btn btn-sm" onClick={runIt}>
          ▶ {t('lesson.predictRun')}
        </button>
      </div>
      {checked !== null && (
        <Notice tone={checked ? 'success' : 'warning'}>
          <strong>{checked ? t('lesson.predictCorrect') : t('lesson.predictIncorrect')}</strong>
          {!checked && predict.answer && (
            <div className="diff-box" style={{ marginTop: '0.3rem' }}>
              <span className="label">{t('quiz.correctAnswer')}</span>
              {Array.isArray(predict.answer) ? predict.answer[0] : predict.answer}
            </div>
          )}
          <p style={{ marginTop: '0.3rem' }}>
            <Inline text={l(predict.explanation)} />
          </p>
        </Notice>
      )}
      {run && (
        <div className="console" data-testid="predict-console">
          {run.stdout}
          {run.error ? `${run.error.type}: ${run.error.message}` : ''}
        </div>
      )}
    </div>
  );
}
