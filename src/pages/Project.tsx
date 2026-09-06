import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Project, ProjectStep } from '@/content/schema';
import { lessons, moduleById, projects } from '@/content';
import { useI18n } from '@/i18n';
import { runtime, type GradeResult } from '@/runtime/runner';
import { useStore } from '@/state/store';
import { isProjectUnlocked } from '@/state/unlock';
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
  const { t, l } = useI18n();
  const progress = useStore((s) => s.progress);
  const saveProjectCode = useStore((s) => s.saveProjectCode);
  const markProjectStep = useStore((s) => s.markProjectStep);
  const resetProject = useStore((s) => s.resetProject);
  useDocumentTitle(l(project.title));

  const pp = progress.projects[project.id];
  const starter = l(project.starterCode);
  const [code, setCode] = useState(pp?.code ?? starter);
  const [activeStep, setActiveStep] = useState(() => {
    const firstOpen = project.steps.findIndex((s) => !(pp?.stepsDone ?? []).includes(s.id));
    return firstOpen === -1 ? project.steps.length - 1 : firstOpen;
  });
  const [result, setResult] = useState<GradeResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [hintsShown, setHintsShown] = useState<Record<string, number>>({});
  const [showRef, setShowRef] = useState<Record<string, boolean>>({});
  const timer = useRef<number | null>(null);
  const unlocked = isProjectUnlocked(project, progress);
  const stepsDone = pp?.stepsDone ?? [];
  const step = project.steps[activeStep];
  const completed = stepsDone.length >= project.steps.length;

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => saveProjectCode(project.id, code), 500);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [code, project.id, saveProjectCode]);

  useEffect(() => {
    setTutorContext({
      lessonId: project.prerequisites[project.prerequisites.length - 1],
      lessonTitle: l(project.title),
      learnedConcepts: project.concepts,
      exerciseTitle: step ? l(step.title) : undefined,
      hints: step ? step.hints.map((h) => l(h)) : [],
      hintsUsed: step ? (hintsShown[step.id] ?? 0) : 0,
      examMode: false,
    });
  }, [project, step, hintsShown, l]);

  const missing = useMemo(() => project.prerequisites.filter((id) => progress.lessons[id]?.status !== 'completed').map((id) => lessons[id]).filter(Boolean), [project, progress]);

  if (!unlocked) {
    return (
      <div className="card" style={{ maxWidth: 640, margin: '2rem auto' }}>
        <h1>{l(project.title)}</h1>
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

  return (
    <div className="stack" data-testid={`project-${project.id}`}>
      <header>
        <div className="small muted">
          <Link to="/projects">{t('projects.title')}</Link> · {l(moduleById[project.moduleId]?.title ?? { en: project.moduleId })}
        </div>
        <h1>{l(project.title)}</h1>
        <p className="muted">{l(project.tagline)}</p>
        <Blocks blocks={project.description} />
        <div className="pill-row">
          <Badge>{t('projects.steps', { count: project.steps.length })}</Badge>
          <Badge>{t('curriculum.minutes', { count: project.estimatedMinutes })}</Badge>
          {completed && <Badge tone="success">{t('projects.completed')}</Badge>}
        </div>
        <div style={{ marginTop: '0.5rem', maxWidth: 480 }}>
          <ProgressBar value={stepsDone.length} max={project.steps.length} label={t('projects.progress', { done: stepsDone.length, total: project.steps.length })} />
          <div className="small muted">{t('projects.progress', { done: stepsDone.length, total: project.steps.length })}</div>
        </div>
      </header>

      <div className="lesson-layout">
        <div className="stack">
          <Workbench code={code} onCodeChange={setCode} starterCode={starter} sampleStdin={project.sampleStdin} fileName={project.id} testIdPrefix="project" onRunComplete={(res) => setTutorContext({ lastError: res.error, currentCode: code })} />

          {step && (
            <section className="card stack-sm" data-testid={`project-step-${step.id}`}>
              <div className="section-head" style={{ marginBottom: 0 }}>
                <span className={`section-num${stepsDone.includes(step.id) ? ' ' : ''}`} style={stepsDone.includes(step.id) ? { background: 'var(--success)' } : undefined}>
                  {stepsDone.includes(step.id) ? '✓' : activeStep + 1}
                </span>
                <h2 style={{ margin: 0 }}>
                  {t('projects.step', { n: activeStep + 1 })}: {l(step.title)}
                </h2>
                {stepsDone.includes(step.id) && <Badge tone="success">{t('projects.stepDone')}</Badge>}
              </div>
              <Blocks blocks={step.instructions} />
              <div className="btn-row">
                {step.check ? (
                  <button type="button" className="btn btn-success" onClick={() => checkStep(step)} disabled={checking} data-testid="project-check-step">
                    ✓ {checking ? t('editor.checking') : t('projects.checkStep')}
                  </button>
                ) : (
                  <>
                    <span className="small muted">{t('projects.noCheck')}</span>
                    <button type="button" className="btn btn-success btn-sm" onClick={() => markProjectStep(project.id, step.id, project.steps.length)}>
                      {t('projects.markDone')}
                    </button>
                  </>
                )}
                {(hintsShown[step.id] ?? 0) < step.hints.length && (
                  <button type="button" className="btn btn-sm" onClick={() => setHintsShown((h) => ({ ...h, [step.id]: (h[step.id] ?? 0) + 1 }))}>
                    💡 {t('exercise.showHint', { used: hintsShown[step.id] ?? 0, total: step.hints.length })}
                  </button>
                )}
                {step.referenceCode && (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowRef((r) => ({ ...r, [step.id]: !r[step.id] }))}>
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
                  <p className="small muted">{t('exercise.solutionWarning')}</p>
                  <div className="code-block">
                    <pre>
                      <code>{step.referenceCode}</code>
                    </pre>
                  </div>
                </div>
              )}
              <div className="btn-row">
                <button type="button" className="btn btn-sm" onClick={() => { setActiveStep((s) => Math.max(0, s - 1)); setResult(null); }} disabled={activeStep === 0}>
                  ← {t('common.back')}
                </button>
                <button type="button" className="btn btn-sm btn-primary" onClick={() => { setActiveStep((s) => Math.min(project.steps.length - 1, s + 1)); setResult(null); }} disabled={activeStep >= project.steps.length - 1} data-testid="project-next-step">
                  {t('common.continue')} →
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
            </section>
          )}
        </div>

        <aside className="lesson-side card">
          <ol className="toc">
            {project.steps.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#step-${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveStep(i);
                    setResult(null);
                  }}
                  aria-current={i === activeStep ? 'step' : undefined}
                  style={i === activeStep ? { background: 'var(--primary-soft)' } : undefined}
                >
                  <span className={`dot${stepsDone.includes(s.id) ? ' done' : ''}`} aria-hidden="true" />
                  <span>
                    {i + 1}. {l(s.title)}
                  </span>
                </a>
              </li>
            ))}
          </ol>
          <hr />
          <div className="small muted">{pp?.updatedAt ? `${t('projects.lastSaved')}: ${new Date(pp.updatedAt).toLocaleTimeString()}` : ''}</div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset} style={{ marginTop: '0.5rem' }}>
            {t('projects.resetProject')}
          </button>
        </aside>
      </div>
    </div>
  );
}
