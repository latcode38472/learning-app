import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Project, ProjectStep } from '@/content/schema';
import { lessons, moduleById, projects } from '@/content';
import { hasMissingTranslation, localeTag, useI18n } from '@/i18n';
import { languageInfo } from '@/i18n/languages';
import { runtime, type GradeResult } from '@/runtime/runner';
import { useStore } from '@/state/store';
import { availableStepCount, isProjectStepUnlocked, isProjectUnlocked, missingProjectPrerequisites, missingStepPrerequisites } from '@/state/unlock';
import { setTutorContext } from '@/tutor/context';
import { Blocks } from '@/components/Blocks';
import { CheckResults } from '@/components/CheckResults';
import { Inline } from '@/components/InlineText';
import { Badge, Notice, ProgressBar, useDocumentTitle } from '@/components/ui';
import { Workbench } from '@/components/Workbench';
import { NotFoundPage } from './NotFound';

export function ProjectPage() {
  const { projectId = '' } = useParams();
  const project = projects[projectId];
  if (!project) return <NotFoundPage />;
  return <ProjectView key={project.id} project={project} />;
}

function ProjectView({ project }: { project: Project }) {
  const { t, l, lang, dir } = useI18n();
  const fellBack = useMemo(() => hasMissingTranslation(project, lang), [project, lang]);
  const progress = useStore((s) => s.progress);
  const saveProjectCode = useStore((s) => s.saveProjectCode);
  const markProjectStep = useStore((s) => s.markProjectStep);
  const resetProject = useStore((s) => s.resetProject);
  useDocumentTitle(l(project.title));

  const pp = progress.projects[project.id];
  const starter = l(project.starterCode);
  const stepsDone = pp?.stepsDone ?? [];
  const [code, setCode] = useState(pp?.code ?? starter);
  const [activeStep, setActiveStep] = useState(() => {
    const p = useStore.getState().progress;
    const firstOpen = project.steps.findIndex((s) => !(p.projects[project.id]?.stepsDone ?? []).includes(s.id) && isProjectStepUnlocked(project, s, p));
    if (firstOpen >= 0) return firstOpen;
    const lastUnlocked = project.steps.map((s) => isProjectStepUnlocked(project, s, p)).lastIndexOf(true);
    return Math.max(0, lastUnlocked);
  });
  const [result, setResult] = useState<GradeResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [hintsShown, setHintsShown] = useState<Record<string, number>>({});
  const [showRef, setShowRef] = useState<Record<string, boolean>>({});
  const timer = useRef<number | null>(null);
  const unlocked = isProjectUnlocked(project, progress);
  const step = project.steps[activeStep];
  const stepUnlocked = step ? isProjectStepUnlocked(project, step, progress) : false;
  const completed = stepsDone.length >= project.steps.length;
  const openSteps = availableStepCount(project, progress);

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => saveProjectCode(project.id, code), 500);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [code, project.id, saveProjectCode]);

  useEffect(() => {
    setTutorContext({
      lessonId: step ? (step.requires ?? project.prerequisites)[(step.requires ?? project.prerequisites).length - 1] : project.prerequisites[project.prerequisites.length - 1],
      lessonTitle: l(project.title),
      learnedConcepts: project.concepts,
      exerciseTitle: step ? l(step.title) : undefined,
      hints: step ? step.hints.map((h) => l(h)) : [],
      hintsUsed: step ? (hintsShown[step.id] ?? 0) : 0,
      examMode: false,
    });
  }, [project, step, hintsShown, l]);

  const missing = useMemo(() => missingProjectPrerequisites(project, progress).map((id) => lessons[id]).filter(Boolean), [project, progress]);
  const missingForStep = useMemo(() => (step ? missingStepPrerequisites(project, step, progress).map((id) => lessons[id]).filter(Boolean) : []), [project, step, progress]);

  if (!unlocked) {
    return (
      <div className="card" style={{ maxWidth: 640, margin: '2rem auto' }} data-testid="project-locked">
        <h1>{l(project.title)}</h1>
        <p className="muted">{l(project.tagline)}</p>
        <Notice tone="warning">{t('projects.lockedNote', { lessons: missing.map((ls) => l(ls.title)).join(', ') })}</Notice>
        <ul>
          {missing.map((ls) => (
            <li key={ls.id}>
              <Link to={`/lesson/${ls.id}`}>{l(ls.title)}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const checkStep = async (s: ProjectStep) => {
    if (!s.check) return;
    setChecking(true);
    try {
      saveProjectCode(project.id, code);
      const grade = await runtime.grade(code, s.check);
      setResult(grade);
      setTutorContext({ lastGrade: grade, currentCode: code });
      if (grade.passed) markProjectStep(project.id, s.id, project.steps.length);
    } finally {
      setChecking(false);
    }
  };

  const reset = () => {
    if (!window.confirm(t('editor.resetConfirm'))) return;
    resetProject(project.id);
    setCode(starter);
    setResult(null);
    setActiveStep(0);
  };

  const go = (i: number) => {
    setActiveStep(Math.max(0, Math.min(project.steps.length - 1, i)));
    setResult(null);
  };

  return (
    <div className="stack" data-testid={`project-${project.id}`}>
      <header>
        <div className="small muted">
          <Link to="/projects">{t('projects.title')}</Link> · {l(moduleById[project.moduleId]?.title ?? { en: project.moduleId })}
        </div>
        <h1>{l(project.title)}</h1>
        <p className="muted">{l(project.tagline)}</p>
        <Blocks blocks={project.description} />
        {project.finishedDescription && (
          <div className="callout callout-why">
            <div className="callout-title">{t('projects.finishedTitle')}</div>
            <p>
              <Inline text={l(project.finishedDescription)} />
            </p>
          </div>
        )}
        {fellBack && <Notice tone="warning">{t('lesson.fallbackNotice', { language: languageInfo(lang).nativeName })}</Notice>}
        <div className="pill-row">
          <Badge>{t('projects.steps', { count: project.steps.length })}</Badge>
          <Badge>{t('curriculum.minutes', { count: project.estimatedMinutes })}</Badge>
          {project.growing && <Badge tone="info">{t('projects.growing')}</Badge>}
          {project.growing && <Badge tone={openSteps === project.steps.length ? 'success' : 'neutral'}>{t('projects.stepsOpen', { open: openSteps, total: project.steps.length })}</Badge>}
          {completed && <Badge tone="success">{t('projects.completed')}</Badge>}
        </div>
        <div style={{ marginTop: '0.5rem', maxWidth: 480 }}>
          <ProgressBar value={stepsDone.length} max={project.steps.length} label={t('projects.progress', { done: stepsDone.length, total: project.steps.length })} />
          <div className="small muted">{t('projects.progress', { done: stepsDone.length, total: project.steps.length })}</div>
        </div>
      </header>

      <div className="lesson-layout">
        <div className="stack">
          <Workbench code={code} onCodeChange={setCode} starterCode={starter} sampleStdin={step?.sampleStdin ?? project.sampleStdin} fileName={project.id} testIdPrefix="project" onRunComplete={(res) => setTutorContext({ lastError: res.error, currentCode: code })} />

          {step && (
            <section className="card stack-sm" data-testid={`project-step-${step.id}`}>
              {step.milestone && <div className="small muted">{l(step.milestone)}</div>}
              <div className="section-head" style={{ marginBottom: 0 }}>
                <span className="section-num" style={stepsDone.includes(step.id) ? { background: 'var(--success)' } : !stepUnlocked ? { background: 'var(--surface-3)', color: 'var(--text-2)' } : undefined}>
                  {stepsDone.includes(step.id) ? '✓' : !stepUnlocked ? '🔒' : activeStep + 1}
                </span>
                <h2 style={{ margin: 0 }}>
                  {t('projects.step', { n: activeStep + 1 })}: {l(step.title)}
                </h2>
                {stepsDone.includes(step.id) && <Badge tone="success">{t('projects.stepDone')}</Badge>}
              </div>
              {!stepUnlocked ? (
                <Notice tone="info" title={t('projects.stepLockedTitle')}>
                  <p>{t('projects.stepLockedBody')}</p>
                  <ul style={{ marginBottom: 0 }}>
                    {missingForStep.map((ls) => (
                      <li key={ls.id}>
                        <Link to={`/lesson/${ls.id}`}>{l(ls.title)}</Link>
                      </li>
                    ))}
                  </ul>
                </Notice>
              ) : (
                <>
                  <Blocks blocks={step.instructions} />
                  <div className="btn-row">
                    {step.check ? (
                      <button type="button" className="btn btn-success" onClick={() => checkStep(step)} disabled={checking} data-testid="project-check-step">
                        ✓ {checking ? t('editor.checking') : t('projects.checkStep')}
                      </button>
                    ) : (
                      <>
                        <span className="small muted">{t('projects.noCheck')}</span>
                        <button type="button" className="btn btn-success btn-sm" onClick={() => markProjectStep(project.id, step.id, project.steps.length)} data-testid="project-mark-done">
                          {t('projects.markDone')}
                        </button>
                      </>
                    )}
                    {(hintsShown[step.id] ?? 0) < step.hints.length && (
                      <button type="button" className="btn btn-sm" onClick={() => setHintsShown((h) => ({ ...h, [step.id]: (h[step.id] ?? 0) + 1 }))} data-testid="project-hint">
                        💡 {t('exercise.showHint', { used: hintsShown[step.id] ?? 0, total: step.hints.length })}
                      </button>
                    )}
                    {step.referenceCode && (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowRef((r) => ({ ...r, [step.id]: !r[step.id] }))} data-testid="project-reference">
                        {showRef[step.id] ? t('projects.hideReference') : t('projects.reference')}
                      </button>
                    )}
                  </div>
                  {result && <CheckResults result={result} />}
                  {(hintsShown[step.id] ?? 0) > 0 && (
                    <ol style={{ listStyle: 'none', padding: 0, margin: 0 }} className="stack-sm">
                      {step.hints.slice(0, hintsShown[step.id]).map((h, i) => (
                        <li key={i} className="hint-box">
                          <strong>
                            {t('exercise.hint')} {i + 1}:
                          </strong>{' '}
                          <Inline text={l(h)} />
                        </li>
                      ))}
                    </ol>
                  )}
                  {showRef[step.id] && step.referenceCode && (
                    <div className="card-soft">
                      <p className="small muted">{t('projects.referenceNote')}</p>
                      <div className="code-block">
                        <pre>
                          <code>{step.referenceCode}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div className="btn-row">
                <button type="button" className="btn btn-sm" onClick={() => go(activeStep - 1)} disabled={activeStep === 0}>
                  {dir === 'rtl' ? '→' : '←'} {t('common.back')}
                </button>
                <button type="button" className="btn btn-sm btn-primary" onClick={() => go(activeStep + 1)} disabled={activeStep >= project.steps.length - 1} data-testid="project-next-step">
                  {t('common.continue')} {dir === 'rtl' ? '←' : '→'}
                </button>
              </div>
            </section>
          )}

          {completed && (
            <section className="card stack-sm">
              <h2>{t('projects.extensions')}</h2>
              <p className="muted">{t('projects.allSteps')}</p>
              <ul>
                {project.extensions.map((e, i) => (
                  <li key={i}>
                    <Inline text={l(e)} />
                  </li>
                ))}
              </ul>
              <Link to="/local" className="btn">
                {t('nav.continueLocally')}
              </Link>
            </section>
          )}
        </div>

        <aside className="lesson-side card">
          <ol className="toc">
            {project.steps.map((s, i) => {
              const open = isProjectStepUnlocked(project, s, progress);
              const done = stepsDone.includes(s.id);
              return (
                <li key={s.id}>
                  {s.milestone && (
                    <div className="tiny muted" style={{ marginTop: i === 0 ? 0 : '0.5rem', padding: '0 0.5rem' }}>
                      {l(s.milestone)}
                    </div>
                  )}
                  <a
                    href={`#step-${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(i);
                    }}
                    aria-current={i === activeStep ? 'step' : undefined}
                    style={i === activeStep ? { background: 'var(--primary-soft)' } : !open ? { opacity: 0.7 } : undefined}
                    data-testid={`project-toc-${s.id}`}
                  >
                    <span className={`dot${done ? ' done' : ''}`} aria-hidden="true" />
                    <span>
                      {open ? '' : '🔒 '}
                      {i + 1}. {l(s.title)}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
          <hr />
          <div className="small muted">{pp?.updatedAt ? `${t('projects.lastSaved')}: ${new Date(pp.updatedAt).toLocaleTimeString(localeTag(lang))}` : ''}</div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset} style={{ marginTop: '0.5rem' }}>
            {t('projects.resetProject')}
          </button>
        </aside>
      </div>
    </div>
  );
}
