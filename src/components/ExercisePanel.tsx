/**
 * An exercise: instructions, editor, Run, "Check my answer", progressive
 * hints and (outside tests) a solution reveal. Drafts are saved automatically.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Block, CodeCheck, ExerciseMode, Localized, Text } from '@/content/schema';
import { useI18n } from '@/i18n';
import { runtime, type GradeResult } from '@/runtime/runner';
import { useStore } from '@/state/store';
import { setTutorContext } from '@/tutor/context';
import { Blocks } from './Blocks';
import { CheckResults } from './CheckResults';
import { Inline } from './InlineText';
import { Badge } from './ui';
import { Workbench } from './Workbench';

export interface ExerciseLike {
  id: string;
  title: Text;
  mode: ExerciseMode;
  instructions: Block[];
  starterCode: string | Localized<string>;
  sampleStdin?: string[];
  check: CodeCheck;
  hints: Text[];
  solution: string;
  solutionNote?: Text;
  concepts: string[];
}

interface Props {
  exercise: ExerciseLike;
  /** Test mode: limited hints, hidden solution, no concept tracking. */
  exam?: { hintsAllowed: number };
  onResult?: (passed: boolean, result: GradeResult) => void;
  heading?: string;
  draftKey?: string;
  testIdPrefix?: string;
  showTitle?: boolean;
}

const MODE_KEY: Record<ExerciseMode, 'exercise.modeWrite' | 'exercise.modeFix' | 'exercise.modeComplete' | 'exercise.modeModify' | 'exercise.modeBuild'> = {
  write: 'exercise.modeWrite',
  fix: 'exercise.modeFix',
  complete: 'exercise.modeComplete',
  modify: 'exercise.modeModify',
  build: 'exercise.modeBuild',
};

export function ExercisePanel({ exercise, exam, onResult, heading, draftKey, testIdPrefix, showTitle = true }: Props) {
  const { t, l } = useI18n();
  const key = draftKey ?? exercise.id;
  const prefix = testIdPrefix ?? `ex-${exercise.id}`;
  const starter = l(exercise.starterCode);
  const draft = useStore((s) => s.progress.drafts[key]);
  const saveDraft = useStore((s) => s.saveDraft);
  const recordAttempt = useStore((s) => s.recordExerciseAttempt);
  const recordConcept = useStore((s) => s.recordConceptResult);
  const previouslyPassed = useStore((s) => s.progress.exercises[exercise.id]?.passed ?? false);

  const [code, setCode] = useState<string>(draft ?? starter);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const recordedFirst = useRef(false);
  const saveTimer = useRef<number | null>(null);

  // Reset local state when the exercise changes.
  useEffect(() => {
    setCode(useStore.getState().progress.drafts[key] ?? l(exercise.starterCode));
    setResult(null);
    setHintsShown(0);
    setShowSolution(false);
    setAttempts(0);
    recordedFirst.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id, key]);

  // Debounced draft saving.
  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => saveDraft(key, code), 400);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [code, key, saveDraft]);

  const hintsAllowed = exam ? exam.hintsAllowed : exercise.hints.length;
  const hintsAvailable = Math.min(hintsAllowed, exercise.hints.length);

  const publishTutor = useCallback(
    (grade: GradeResult | null) => {
      setTutorContext({
        exerciseTitle: l(exercise.title),
        currentCode: code,
        lastGrade: grade,
        hints: exercise.hints.map((h) => l(h)),
        hintsUsed: hintsShown,
      });
    },
    [code, exercise.hints, exercise.title, hintsShown, l],
  );

  const check = async () => {
    setChecking(true);
    try {
      saveDraft(key, code);
      const grade = await runtime.grade(code, exercise.check);
      setResult(grade);
      setAttempts((a) => a + 1);
      recordAttempt(exercise.id, grade.passed, hintsShown);
      if (!exam) {
        if (grade.passed) {
          for (const c of exercise.concepts) recordConcept(c, true);
        } else if (!recordedFirst.current) {
          for (const c of exercise.concepts) recordConcept(c, false);
        }
        recordedFirst.current = true;
      }
      publishTutor(grade);
      onResult?.(grade.passed, grade);
    } finally {
      setChecking(false);
    }
  };

  const canShowSolution = !exam && (hintsShown >= hintsAvailable || attempts >= 3 || previouslyPassed);

  return (
    <div className="stack" data-testid={prefix}>
      {showTitle && (
        <div className="section-head" style={{ marginBottom: 0 }}>
          <h3 style={{ margin: 0 }}>{heading ? `${heading}: ` : ''}{l(exercise.title)}</h3>
          <Badge tone="info">{t(MODE_KEY[exercise.mode])}</Badge>
          {previouslyPassed && <Badge tone="success">{t('exercise.passed')}</Badge>}
        </div>
      )}
      <div>
        <Blocks blocks={exercise.instructions} />
      </div>
      <Workbench
        code={code}
        onCodeChange={setCode}
        starterCode={starter}
        sampleStdin={exercise.sampleStdin}
        fileName={exercise.id}
        testIdPrefix={prefix}
        onRunComplete={(res) => {
          setTutorContext({ lastError: res.error, currentCode: code });
        }}
        extraToolbar={
          <button type="button" className="btn btn-success" onClick={check} disabled={checking} data-testid={`${prefix}-check`}>
            ✓ {checking ? t('editor.checking') : t('editor.checkAnswer')}
          </button>
        }
      />
      {result && (
        <div data-testid={`${prefix}-result`}>
          <CheckResults result={result} />
          {!result.passed && <p className="small muted" style={{ marginTop: '0.4rem' }}>{t('exercise.tryAgain')}</p>}
        </div>
      )}

      <div className="btn-row">
        {hintsShown < hintsAvailable && (
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => {
              setHintsShown((h) => h + 1);
              publishTutor(result);
            }}
            data-testid={`${prefix}-hint`}
          >
            💡 {t('exercise.showHint', { used: hintsShown, total: hintsAvailable })}
          </button>
        )}
        {hintsShown >= hintsAvailable && !exam && !canShowSolution && <span className="small muted">{t('exercise.noMoreHints')}</span>}
        {exam && <span className="small muted">{t('exercise.examLimited')}</span>}
        {canShowSolution && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowSolution((s) => !s)} data-testid={`${prefix}-solution`}>
            {showSolution ? t('exercise.hideSolution') : t('exercise.showSolution')}
          </button>
        )}
        {attempts > 0 && <span className="small muted">{t('exercise.attempts', { count: attempts })}</span>}
      </div>

      {hintsShown > 0 && (
        <ol className="stack-sm" style={{ listStyle: 'none', padding: 0, margin: 0 }} aria-label={t('exercise.hint')}>
          {exercise.hints.slice(0, hintsShown).map((h, i) => (
            <li key={i} className="hint-box">
              <strong>
                {t('exercise.hint')} {i + 1}:
              </strong>{' '}
              <Inline text={l(h)} />
            </li>
          ))}
        </ol>
      )}

      {showSolution && (
        <div className="card-soft">
          <p className="small muted">{t('exercise.solutionWarning')}</p>
          <div className="code-block">
            <pre>
              <code>{exercise.solution}</code>
            </pre>
          </div>
          {exercise.solutionNote && (
            <p className="small">
              <strong>{t('exercise.solutionNote')}:</strong> <Inline text={l(exercise.solutionNote)} />
            </p>
          )}
        </div>
      )}
    </div>
  );
}
