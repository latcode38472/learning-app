/**
 * Lesson page.
 *
 * Two views of the same eight-section lesson:
 *  - guided: one step at a time with Back / Next, a progress indicator and a
 *    remembered position. The steps depend on the learner's pace (see
 *    src/state/lessonSteps.ts).
 *  - full: the whole lesson on one page (the original reader).
 *
 * Completion (src/state/store.ts lessonCompletionState): the exercise passed,
 * the building task passed, and the understanding check passed.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Lesson, Question } from '@/content/schema';
import { conceptsKnownAt, glossaryById, lessons, moduleById, nextLessonId, previousLessonId } from '@/content';
import { hasMissingTranslation, useI18n } from '@/i18n';
import { languageInfo } from '@/i18n/languages';
import { lessonCompletionState, useStore } from '@/state/store';
import { buildLessonSteps, firstStepOfSection, restoreStepIndex, SECTION_ORDER, type LessonStep, type StepSection } from '@/state/lessonSteps';
import { isLessonUnlocked, lessonBlockedBy } from '@/state/unlock';
import { runtime, type RunResult } from '@/runtime/runner';
import { setTutorContext } from '@/tutor/context';
import { Blocks } from '@/components/Blocks';
import { ExercisePanel } from '@/components/ExercisePanel';
import { Inline } from '@/components/InlineText';
import { QuizRunner, isPredictCorrect, type QuizAnswer } from '@/components/QuizRunner';
import { Badge, Notice, ProgressBar, useDocumentTitle } from '@/components/ui';
import { NotFoundPage } from './NotFound';

export function LessonPage() {
  const { lessonId = '' } = useParams();
  const lesson = lessons[lessonId];
  if (!lesson) return <NotFoundPage />;
  return <LessonView key={lesson.id} lesson={lesson} />;
}

const SECTION_LABEL_KEY = {
  objective: 'lesson.objective',
  explanation: 'lesson.explanation',
  example: 'lesson.workedExample',
  predict: 'lesson.predict',
  exercise: 'lesson.exercise',
  build: 'lesson.build',
  check: 'lesson.understandingCheck',
  recap: 'lesson.recap',
} as const;

function LessonView({ lesson }: { lesson: Lesson }) {
  const { t, l, lang, dir } = useI18n();
  const progress = useStore((s) => s.progress);
  const pace = useStore((s) => s.settings.pace);
  const view = useStore((s) => s.settings.lessonView);
  const reduceMotion = useStore((s) => s.settings.reduceMotion);
  const updateSettings = useStore((s) => s.updateSettings);
  const startLesson = useStore((s) => s.startLesson);
  const completeLesson = useStore((s) => s.completeLesson);
  const saveLessonPosition = useStore((s) => s.saveLessonPosition);
  useDocumentTitle(l(lesson.title));

  const mod = moduleById[lesson.moduleId];
  const unlocked = isLessonUnlocked(lesson.id, progress);
  const state = lessonCompletionState(lesson.id, lesson.exercise.id, lesson.build.id, progress);
  const completed = state.complete;
  const lp = progress.lessons[lesson.id];
  const prevId = previousLessonId(lesson.id);
  const nextId = nextLessonId(lesson.id);
  const blockedBy = lessonBlockedBy(lesson.id, progress);
  const fellBack = useMemo(() => hasMissingTranslation(lesson, lang), [lesson, lang]);

  const steps = useMemo(() => buildLessonSteps(lesson, pace), [lesson, pace]);
  const [stepIndex, setStepIndex] = useState(() => restoreStepIndex(steps, useStore.getState().progress.lessonPositions[lesson.id]));
  const [resumed] = useState(() => !!useStore.getState().progress.lessonPositions[lesson.id]?.stepId && stepIndex > 0);
  const [miniDone, setMiniDone] = useState<Record<string, boolean>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

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

  // The single completion rule.
  useEffect(() => {
    if (state.practiceDone && state.understood && lp?.status !== 'completed') completeLesson(lesson.id);
  }, [state.practiceDone, state.understood, lp?.status, completeLesson, lesson.id]);

  // Keep the step index valid when the pace changes.
  useEffect(() => {
    setStepIndex((i) => Math.min(i, steps.length - 1));
  }, [steps]);

  // Remember the position.
  useEffect(() => {
    if (!unlocked || view !== 'guided') return;
    const step = steps[stepIndex];
    if (step) saveLessonPosition(lesson.id, { step: stepIndex, total: steps.length, pace, stepId: step.id });
  }, [stepIndex, steps, pace, lesson.id, saveLessonPosition, unlocked, view]);

  // On a step change: scroll up and move focus to the step heading.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    headingRef.current?.focus({ preventScroll: true });
  }, [stepIndex, reduceMotion]);

  const goTo = useCallback((i: number) => setStepIndex(Math.max(0, Math.min(steps.length - 1, i))), [steps.length]);
  const next = useCallback(() => goTo(stepIndex + 1), [goTo, stepIndex]);
  const back = useCallback(() => goTo(stepIndex - 1), [goTo, stepIndex]);

  // Keyboard: arrow keys move between steps when focus is not inside an editor or form control.
  useEffect(() => {
    if (view !== 'guided') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.closest('input, textarea, select, [contenteditable="true"], .cm-editor') || target.isContentEditable)) return;
      const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
      const backward = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
      if (e.key === forward) {
        e.preventDefault();
        next();
      } else if (e.key === backward) {
        e.preventDefault();
        back();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, dir, next, back]);

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

  const sectionDone: Record<StepSection, boolean> = {
    objective: true,
    explanation: true,
    example: true,
    predict: !!lp?.predictDone,
    exercise: state.exercisePassed,
    build: state.buildPassed,
    check: state.understood,
    recap: completed,
  };

  const paceLabel = pace === 'slow' ? t('onboarding.paceSlow') : pace === 'fast' ? t('onboarding.paceFast') : t('onboarding.paceStandard');

  const header = (
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
        <span className="small muted">
          {t('settings.pace')}: {paceLabel} · <Link to="/settings">{t('lesson.changePace')}</Link>
        </span>
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
  );

  const viewToggle = (
    <div className="view-toggle" role="group" aria-label={t('lesson.viewLabel')}>
      <button type="button" className={`btn btn-sm${view === 'guided' ? ' btn-primary' : ''}`} aria-pressed={view === 'guided'} onClick={() => updateSettings({ lessonView: 'guided' })} data-testid="view-guided">
        {t('lesson.guidedView')}
      </button>
      <button type="button" className={`btn btn-sm${view === 'full' ? ' btn-primary' : ''}`} aria-pressed={view === 'full'} onClick={() => updateSettings({ lessonView: 'full' })} data-testid="view-full">
        {t('lesson.fullView')}
      </button>
    </div>
  );

  const aside = (
    <aside className="lesson-side card" aria-label={t('lesson.sections')}>
      {viewToggle}
      <ol className="toc" style={{ marginTop: '0.6rem' }}>
        {SECTION_ORDER.map((section, i) => {
          const done = sectionDone[section];
          const current = view === 'guided' && steps[stepIndex]?.section === section;
          return (
            <li key={section}>
              <a
                href={`#${section}`}
                aria-current={current ? 'step' : undefined}
                style={current ? { background: 'var(--primary-soft)' } : undefined}
                onClick={(e) => {
                  if (view !== 'guided') return;
                  e.preventDefault();
                  goTo(firstStepOfSection(steps, section));
                }}
              >
                <span className={`dot${done && i >= 3 ? ' done' : ''}`} aria-hidden="true" />
                <span>
                  {i + 1}. {t(SECTION_LABEL_KEY[section])}
                </span>
              </a>
            </li>
          );
        })}
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
  );

  const requirements = (
    <RequirementsList
      state={state}
      completed={completed}
      onJump={view === 'guided' ? (section) => goTo(firstStepOfSection(steps, section)) : undefined}
    />
  );

  const lessonNav = (
    <nav className="lesson-nav" aria-label={t('lesson.navigation')}>
      {prevId ? (
        <Link to={`/lesson/${prevId}`} className="btn">
          {dir === 'rtl' ? '→' : '←'} {t('lesson.previousLesson')}
        </Link>
      ) : (
        <span />
      )}
      {nextId &&
        (isLessonUnlocked(nextId, progress) ? (
          <Link to={`/lesson/${nextId}`} className={`btn${completed ? ' btn-primary' : ''}`} data-testid="nav-next-lesson">
            {t('lesson.nextLesson')} {dir === 'rtl' ? '←' : '→'}
          </Link>
        ) : (
          <button type="button" className="btn" disabled title={t('lesson.completeRequirements')}>
            {t('lesson.nextLesson')} {dir === 'rtl' ? '←' : '→'}
          </button>
        ))}
    </nav>
  );

  const recapBox = (
    <>
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
        <Notice tone="info" title={t('lesson.requirementsTitle')}>
          {requirements}
        </Notice>
      )}
    </>
  );

  /* ------------------------------------------------------------ full view */
  if (view === 'full') {
    return (
      <div className="lesson-layout" data-testid={`lesson-${lesson.id}`} data-view="full">
        <article className="stack">
          {header}
          <FullSection n={1} id="objective" label={t('lesson.objective')}>
            <ObjectiveBody lesson={lesson} />
          </FullSection>
          <FullSection n={2} id="explanation" label={t('lesson.explanation')}>
            <Blocks blocks={lesson.explanation} />
            <Expandable label={t('lesson.explainSimpler')} hideLabel={t('lesson.hideSimpler')} testId="explain-simpler" open={pace === 'slow'}>
              <Blocks blocks={lesson.simpler} />
            </Expandable>
          </FullSection>
          <FullSection n={3} id="example" label={t('lesson.workedExample')}>
            <Blocks blocks={lesson.workedExample} />
            <ExtraExamples lesson={lesson} showAll={pace === 'slow'} />
            {lesson.harderChallenge && <HarderChallenge lesson={lesson} />}
          </FullSection>
          <FullSection n={4} id="predict" label={t('lesson.predict')} done={!!lp?.predictDone}>
            <PredictSection lesson={lesson} />
          </FullSection>
          <FullSection n={5} id="exercise" label={t('lesson.exercise')} done={state.exercisePassed}>
            <ExercisePanel exercise={lesson.exercise} testIdPrefix="exercise" />
          </FullSection>
          <FullSection n={6} id="build" label={t('lesson.build')} done={state.buildPassed}>
            <ExercisePanel exercise={lesson.build} testIdPrefix="build" />
          </FullSection>
          <FullSection n={7} id="check" label={t('lesson.understandingCheck')} done={state.understood}>
            <UnderstandingCheck lesson={lesson} />
          </FullSection>
          <FullSection n={8} id="recap" label={t('lesson.recap')} done={completed}>
            <Blocks blocks={lesson.recap} />
            {recapBox}
          </FullSection>
          {lessonNav}
        </article>
        {aside}
      </div>
    );
  }

  /* ------------------------------------------------------------ guided view */
  const step = steps[stepIndex];
  const sectionNumber = SECTION_ORDER.indexOf(step.section) + 1;
  const isLast = stepIndex === steps.length - 1;
  const stepTitle = stepLabel(step, t);

  return (
    <div className="lesson-layout" data-testid={`lesson-${lesson.id}`} data-view="guided">
      <article className="stack">
        {header}
        <div className="step-progress" data-testid="step-progress">
          <div className="step-progress-row">
            <span className="small">
              <strong>{t('lesson.stepOf', { i: stepIndex + 1, n: steps.length })}</strong> · {t(SECTION_LABEL_KEY[step.section])}
            </span>
            <span className="small muted">{t('lesson.keyboardHint')}</span>
          </div>
          <ProgressBar value={stepIndex + 1} max={steps.length} label={t('lesson.stepOf', { i: stepIndex + 1, n: steps.length })} />
          <ol className="step-dots" aria-label={t('lesson.sections')}>
            {steps.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={`step-dot${i === stepIndex ? ' current' : ''}${i < stepIndex ? ' seen' : ''}`}
                  onClick={() => goTo(i)}
                  aria-current={i === stepIndex ? 'step' : undefined}
                  aria-label={`${i + 1}. ${stepLabel(s, t)}`}
                  title={stepLabel(s, t)}
                />
              </li>
            ))}
          </ol>
        </div>

        {resumed && stepIndex > 0 && (
          <Notice tone="info">
            {t('lesson.resumedAt', { step: stepIndex + 1 })}{' '}
            <button type="button" className="btn btn-sm" onClick={() => goTo(0)}>
              {t('lesson.startFromBeginning')}
            </button>
          </Notice>
        )}

        <section className="card lesson-section step-card" key={step.id} aria-labelledby="h-step" data-testid={`step-${step.id}`}>
          <div className={`section-head${sectionDone[step.section] && sectionNumber > 3 ? ' section-done' : ''}`}>
            <span className="section-num" aria-hidden="true">
              {sectionDone[step.section] && sectionNumber > 3 ? '✓' : sectionNumber}
            </span>
            <h2 id="h-step" ref={headingRef} tabIndex={-1} style={{ margin: 0 }}>
              {stepTitle}
            </h2>
          </div>
          <StepBody
            step={step}
            lesson={lesson}
            state={state}
            miniDone={!!miniDone[step.id]}
            onMiniDone={() => setMiniDone((m) => ({ ...m, [step.id]: true }))}
            onSkipToCheck={() => goTo(firstStepOfSection(steps, 'check'))}
            recapBox={recapBox}
          />
          <div className="step-nav">
            <button type="button" className="btn" onClick={back} disabled={stepIndex === 0} data-testid="step-back">
              {dir === 'rtl' ? '→' : '←'} {t('lesson.stepBack')}
            </button>
            <span className="small muted step-nav-status">{stepStatus(step, state, lp?.predictDone, miniDone, t)}</span>
            {isLast ? (
              completed && nextId ? (
                <Link to={`/lesson/${nextId}`} className="btn btn-primary" data-testid="step-next-lesson">
                  {t('lesson.nextLesson')} {dir === 'rtl' ? '←' : '→'}
                </Link>
              ) : (
                <span />
              )
            ) : (
              <button type="button" className="btn btn-primary" onClick={next} data-testid="step-next">
                {t('lesson.stepNext')} {dir === 'rtl' ? '←' : '→'}
              </button>
            )}
          </div>
        </section>

        {isLast && lessonNav}
      </article>
      {aside}
    </div>
  );
}

/* ------------------------------------------------------------------ pieces */

type T = ReturnType<typeof useI18n>['t'];

function stepLabel(step: LessonStep, t: T): string {
  switch (step.kind) {
    case 'objective':
      return t('lesson.objective');
    case 'explain':
      return step.part && step.part.n > 1 ? t('lesson.explanationPart', { i: step.part.i, n: step.part.n }) : t('lesson.explanation');
    case 'simpler':
      return t('lesson.sameIdeaSimpler');
    case 'example':
      return t('lesson.workedExample');
    case 'extra-example':
      return t('lesson.anotherExampleN', { i: step.part?.i ?? 1, n: step.part?.n ?? 1 });
    case 'mini-check':
      return t('lesson.miniCheck');
    case 'predict':
      return t('lesson.predict');
    case 'exercise':
      return t('lesson.exercise');
    case 'build':
      return t('lesson.build');
    case 'check':
      return t('lesson.understandingCheck');
    case 'recap':
      return t('lesson.recap');
  }
}

function stepStatus(step: LessonStep, state: ReturnType<typeof lessonCompletionState>, predictDone: boolean | undefined, miniDone: Record<string, boolean>, t: T): string {
  switch (step.kind) {
    case 'exercise':
      return state.exercisePassed ? t('lesson.stepDone') : t('lesson.stepRequired');
    case 'build':
      return state.buildPassed ? t('lesson.stepDone') : t('lesson.stepRequired');
    case 'check':
      return state.understood ? t('lesson.stepDone') : t('lesson.stepRequired');
    case 'predict':
      return predictDone ? t('lesson.stepDone') : '';
    case 'mini-check':
      return miniDone[step.id] ? t('lesson.stepDone') : '';
    default:
      return '';
  }
}

function StepBody({
  step,
  lesson,
  state,
  miniDone,
  onMiniDone,
  onSkipToCheck,
  recapBox,
}: {
  step: LessonStep;
  lesson: Lesson;
  state: ReturnType<typeof lessonCompletionState>;
  miniDone: boolean;
  onMiniDone: () => void;
  onSkipToCheck: () => void;
  recapBox: React.ReactNode;
}) {
  const { t } = useI18n();
  const recordConcept = useStore((s) => s.recordConceptResult);
  switch (step.kind) {
    case 'objective':
      return (
        <>
          <ObjectiveBody lesson={lesson} />
          {step.offerSkipToCheck && !state.understood && (
            <div className="card-soft" style={{ marginTop: '0.8rem' }} data-testid="skip-to-check">
              <strong>{t('lesson.showWhatYouKnow')}</strong>
              <p className="small" style={{ margin: '0.3rem 0 0.6rem' }}>
                {t('lesson.showWhatYouKnowBody')}
              </p>
              <button type="button" className="btn btn-sm" onClick={onSkipToCheck}>
                {t('lesson.skipToCheck')}
              </button>
            </div>
          )}
          {step.offerSkipToCheck && state.understood && <Notice tone="success">{t('lesson.checkPassedEarly')}</Notice>}
        </>
      );
    case 'explain':
      return (
        <>
          <Blocks blocks={step.blocks ?? []} />
          {step.optional?.fullExplanation && (
            <Expandable label={t('lesson.briskFullExplanation')} hideLabel={t('lesson.briskHideFull')} testId="full-explanation">
              <Blocks blocks={lesson.explanation} />
            </Expandable>
          )}
          {step.optional?.simpler && (
            <Expandable label={t('lesson.explainSimpler')} hideLabel={t('lesson.hideSimpler')} testId="explain-simpler">
              <Blocks blocks={lesson.simpler} />
            </Expandable>
          )}
          {step.optional?.moreExamples && <ExtraExamples lesson={lesson} />}
        </>
      );
    case 'simpler':
      return (
        <>
          <p className="small muted">{t('lesson.sameIdeaSimplerIntro')}</p>
          <Blocks blocks={step.blocks ?? []} />
        </>
      );
    case 'example':
      return (
        <>
          <Blocks blocks={step.blocks ?? []} />
          {step.optional?.moreExamples && <ExtraExamples lesson={lesson} />}
          {step.optional?.harder && lesson.harderChallenge && <HarderChallenge lesson={lesson} />}
        </>
      );
    case 'extra-example':
      return <Blocks blocks={step.blocks ?? []} />;
    case 'mini-check':
      return (
        <>
          <p className="small muted">{t('lesson.miniCheckIntro')}</p>
          {step.question && (
            <MiniCheck
              question={step.question}
              done={miniDone}
              onDone={(correct) => {
                for (const c of step.question?.concepts ?? []) recordConcept(c, correct);
                onMiniDone();
              }}
            />
          )}
        </>
      );
    case 'predict':
      return <PredictSection lesson={lesson} />;
    case 'exercise':
      return <ExercisePanel exercise={lesson.exercise} testIdPrefix="exercise" />;
    case 'build':
      return (
        <>
          <ExercisePanel exercise={lesson.build} testIdPrefix="build" />
          {step.optional?.harder && lesson.harderChallenge && <HarderChallenge lesson={lesson} />}
        </>
      );
    case 'check':
      return <UnderstandingCheck lesson={lesson} />;
    case 'recap':
      return (
        <>
          <Blocks blocks={step.blocks ?? []} />
          {recapBox}
          {step.optional?.harder && lesson.harderChallenge && <HarderChallenge lesson={lesson} />}
        </>
      );
  }
}

function FullSection({ n, id, label, done, children }: { n: number; id: string; label: string; done?: boolean; children: React.ReactNode }) {
  const { t } = useI18n();
  const showDone = done && n > 3;
  return (
    <section className="card lesson-section" id={id} aria-labelledby={`h-${id}`}>
      <div className={`section-head${showDone ? ' section-done' : ''}`}>
        <span className="section-num" aria-hidden="true">
          {showDone ? '✓' : n}
        </span>
        <h2 id={`h-${id}`} style={{ margin: 0 }}>
          {label}
        </h2>
        <span className="sr-only">{t('lesson.section', { n })}</span>
      </div>
      {children}
    </section>
  );
}

function ObjectiveBody({ lesson }: { lesson: Lesson }) {
  const { t, l } = useI18n();
  return (
    <>
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
    </>
  );
}

function Expandable({ label, hideLabel, testId, open = false, children }: { label: string; hideLabel: string; testId: string; open?: boolean; children: React.ReactNode }) {
  const [show, setShow] = useState(open);
  return (
    <div style={{ marginTop: '0.8rem' }}>
      <button type="button" className="btn btn-sm" onClick={() => setShow((s) => !s)} aria-expanded={show} data-testid={testId}>
        {show ? hideLabel : label}
      </button>
      {show && (
        <div className="card-soft" style={{ marginTop: '0.8rem' }} data-testid={`${testId}-body`}>
          {children}
        </div>
      )}
    </div>
  );
}

/** Extra examples, revealed one at a time (or all at once in slow pace on the full page). */
function ExtraExamples({ lesson, showAll = false }: { lesson: Lesson; showAll?: boolean }) {
  const { t } = useI18n();
  const [shown, setShown] = useState(showAll ? lesson.moreExamples.length : 0);
  if (lesson.moreExamples.length === 0) return null;
  return (
    <div style={{ marginTop: '0.8rem' }}>
      {lesson.moreExamples.slice(0, shown).map((ex, i) => (
        <div key={i} className="card-soft" style={{ marginTop: '0.8rem' }} data-testid={`extra-example-${i}`}>
          <Blocks blocks={ex} />
        </div>
      ))}
      <div className="btn-row" style={{ marginTop: '0.8rem' }}>
        {shown < lesson.moreExamples.length ? (
          <button type="button" className="btn btn-sm" onClick={() => setShown((n) => n + 1)} data-testid="another-example">
            {t('lesson.anotherExample')} ({shown}/{lesson.moreExamples.length})
          </button>
        ) : (
          <span className="small muted">{t('lesson.noMoreExamples')}</span>
        )}
      </div>
    </div>
  );
}

function HarderChallenge({ lesson }: { lesson: Lesson }) {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  if (!lesson.harderChallenge) return null;
  return (
    <div style={{ marginTop: '0.8rem' }}>
      <button type="button" className="btn btn-sm" onClick={() => setShow((s) => !s)} aria-expanded={show} data-testid="harder-challenge">
        {show ? t('lesson.hideHarder') : t('lesson.harderChallenge')} · {t('common.optional')}
      </button>
      {show && (
        <div style={{ marginTop: '1rem' }}>
          <ExercisePanel exercise={lesson.harderChallenge} heading={t('lesson.harderChallenge')} testIdPrefix="harder" />
        </div>
      )}
    </div>
  );
}

function RequirementsList({ state, completed, onJump }: { state: ReturnType<typeof lessonCompletionState>; completed: boolean; onJump?: (section: StepSection) => void }) {
  const { t } = useI18n();
  if (completed) return null;
  const rows: Array<[StepSection, string, boolean]> = [
    ['exercise', t('lesson.reqExercise'), state.exercisePassed],
    ['build', t('lesson.reqBuild'), state.buildPassed],
    ['check', t('lesson.reqCheck'), state.understood],
  ];
  return (
    <ul className="req-list" data-testid="requirements">
      {rows.map(([section, label, done]) => (
        <li key={section} className={done ? 'done' : ''}>
          <span aria-hidden="true">{done ? '✓' : '○'}</span> {label}
          {!done && onJump && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onJump(section)}>
              {t('lesson.jumpTo')}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

function MiniCheck({ question, done, onDone }: { question: Question; done: boolean; onDone: (correct: boolean) => void }) {
  const { t } = useI18n();
  const [result, setResult] = useState<boolean | null>(null);
  if (done && result === null) return <Notice tone="success">{t('lesson.stepDone')}</Notice>;
  return (
    <>
      <QuizRunner questions={[question]} mode="immediate" testIdPrefix="mini" onFinish={(answers) => {
        const ok = answers.every((a) => a.correct);
        setResult(ok);
        onDone(ok);
      }} />
      {result !== null && <Notice tone={result ? 'success' : 'info'}>{result ? t('lesson.miniCheckRight') : t('lesson.miniCheckWrong')}</Notice>}
    </>
  );
}

/**
 * The understanding check. Every question must be answered correctly. After
 * a wrong answer the learner reads the explanation and retries only the
 * questions they missed; each finished round is recorded as an attempt.
 */
function UnderstandingCheck({ lesson }: { lesson: Lesson }) {
  const { t } = useI18n();
  const lp = useStore((s) => s.progress.lessons[lesson.id]);
  const recordCheckAttempt = useStore((s) => s.recordCheckAttempt);
  const recordConcept = useStore((s) => s.recordConceptResult);
  const [correctIds, setCorrectIds] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<Question[]>(lesson.check);
  const [lastRound, setLastRound] = useState<QuizAnswer[] | null>(null);
  const [round, setRound] = useState(0);
  const passed = !!lp?.checkPassed || !!lp?.completedUnderV1;

  if (passed && !lastRound) {
    return (
      <div className="stack-sm" data-testid="check-passed">
        <Notice tone="success">
          <strong>{t('quiz.understandingPassed')}</strong>
          {lp?.checkAttempts ? <span className="small"> · {t('lesson.checkAttempts', { count: lp.checkAttempts })}</span> : null}
        </Notice>
        <button type="button" className="btn btn-sm" onClick={() => { setPending(lesson.check); setCorrectIds(new Set()); setLastRound([]); setRound((r) => r + 1); }}>
          {t('lesson.practiseCheckAgain')}
        </button>
      </div>
    );
  }

  if (lastRound && lastRound.length > 0) {
    const missed = lastRound.filter((a) => !a.correct);
    const allDone = missed.length === 0;
    return (
      <div className="stack-sm" data-testid="check-result">
        <Notice tone={allDone ? 'success' : 'warning'}>
          <strong>{allDone ? t('quiz.understandingPassed') : t('lesson.checkMissed', { count: missed.length })}</strong>
          <div className="small" style={{ marginTop: '0.3rem' }}>{allDone ? t('lesson.checkPassedBody') : t('lesson.checkRetryBody')}</div>
        </Notice>
        {!allDone && (
          <button
            type="button"
            className="btn btn-primary"
            data-testid="check-retry"
            onClick={() => {
              setPending(lesson.check.filter((q) => missed.some((m) => m.questionId === q.id)));
              setLastRound(null);
              setRound((r) => r + 1);
            }}
          >
            {t('lesson.retryMissed', { count: missed.length })}
          </button>
        )}
      </div>
    );
  }

  return (
    <QuizRunner
      key={round}
      questions={pending}
      mode="immediate"
      testIdPrefix="check"
      onAnswer={(a) => {
        for (const c of a.concepts) recordConcept(c, a.correct);
      }}
      onFinish={(answers) => {
        const nowCorrect = new Set(correctIds);
        for (const a of answers) if (a.correct) nowCorrect.add(a.questionId);
        setCorrectIds(nowCorrect);
        const total = lesson.check.length;
        const score = answers.filter((a) => a.correct).length / Math.max(1, answers.length);
        const allCorrect = lesson.check.every((q) => nowCorrect.has(q.id));
        recordCheckAttempt(lesson.id, score, allCorrect);
        setLastRound(answers);
        void total;
      }}
    />
  );
}

function PredictSection({ lesson }: { lesson: Lesson }) {
  const { t, l } = useI18n();
  const markPredictDone = useStore((s) => s.markPredictDone);
  const recordConcept = useStore((s) => s.recordConceptResult);
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
    markPredictDone(lesson.id);
    for (const c of lesson.introduces) recordConcept(c, correct);
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
              <label className={`option${checked !== null && i === selected ? (o.correct ? ' correct' : ' wrong') : selected === i ? ' selected' : ''}${checked !== null && o.correct ? ' correct' : ''}`} data-testid={`predict-option-${i}`}>
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
