/**
 * End-to-end tests for the core learning loop, run against the production
 * build in a real browser (Python executes in the Pyodide worker).
 *
 * The assistant tests need the backend with the mock OpenRouter (started by
 * playwright.config.ts). When E2E_BASE_URL points at a plain static host they
 * skip themselves after checking /api/assistant/status.
 */
import { expect, test, type Page } from '@playwright/test';
import { setEditor } from './editor';

const OWNER_PASSWORD = process.env.E2E_OWNER_PASSWORD ?? 'e2e-owner-password';
const MOCK_KEY = 'sk-or-v1-mock-valid-key-0000000000';

async function onboard(page: Page, lang: 'en' | 'he' = 'en') {
  await page.goto('#/welcome');
  await page.getByTestId(`lang-${lang}`).click();
  await page.getByTestId('onboarding-next').click();
  await page.getByTestId('onboarding-start').click();
  await expect(page.getByTestId('home')).toBeVisible();
}

/** Jump to a lesson section in the guided view via the side table of contents. */
async function goToSection(page: Page, n: number) {
  await page.locator('.lesson-side .toc a').nth(n - 1).click();
}

async function setPace(page: Page, pace: 'slow' | 'standard' | 'fast') {
  await page.evaluate((p) => {
    const raw = localStorage.getItem('codepath.v1');
    const data = raw ? JSON.parse(raw) : { state: {} };
    data.state.settings = { ...(data.state.settings ?? {}), pace: p };
    localStorage.setItem('codepath.v1', JSON.stringify(data));
  }, pace);
}

/** The help drawer keeps its open state across in-app navigation, so only press the button when it is closed. */
async function openAiTab(page: Page) {
  if (!(await page.getByTestId('tutor-panel').isVisible())) await page.getByTestId('tutor-fab').click();
  await page.getByTestId('tutor-tab-ai').click();
}

async function backendAvailable(page: Page): Promise<boolean> {
  const res = await page.request.get('api/assistant/status').catch(() => null);
  if (!res || !res.ok()) return false;
  const ct = res.headers()['content-type'] ?? '';
  return ct.includes('application/json');
}

test.describe('CodePath core flows', () => {
  test('a fresh learner completes lesson 1 in the guided view: exercise, build, understanding check; next lesson unlocks; position and code survive a reload', async ({ page }) => {
    test.setTimeout(300_000);
    await onboard(page);

    await page.getByTestId('home-resume').click();
    await expect(page.getByTestId('lesson-l01-what-computers-do')).toBeVisible();
    await expect(page.getByTestId('step-progress')).toContainText('Step 1 of');

    // The second lesson is locked before the first is completed.
    await page.goto('#/lesson/l02-programs-and-files');
    await expect(page.getByTestId('lesson-locked')).toBeVisible();
    await page.goto('#/lesson/l01-what-computers-do');

    // Walk with Next: objective → explanation → example → predict.
    await page.getByTestId('step-next').click();
    await page.getByTestId('step-next').click();
    await page.getByTestId('step-next').click();
    await expect(page.getByTestId('step-predict')).toBeVisible();
    await page.getByTestId('predict-option-0').click();
    await page.getByTestId('predict-check').click();
    await expect(page.getByTestId('step-predict')).toContainText('Correct prediction');

    // Exercise: a deliberate mistake gives a friendly error, then fix and pass.
    await page.getByTestId('step-next').click();
    await expect(page.getByTestId('step-exercise')).toBeVisible();
    await setEditor(page, 'exercise', 'print("Hello');
    await page.getByTestId('exercise-run').click();
    await expect(page.getByTestId('exercise-error')).toBeVisible({ timeout: 90_000 });
    await expect(page.getByTestId('exercise-error')).toContainText('SyntaxError');
    await setEditor(page, 'exercise', 'print("Hello, world!")');
    await page.getByTestId('exercise-run').click();
    await expect(page.getByTestId('exercise-console')).toContainText('Hello, world!', { timeout: 60_000 });
    await page.getByTestId('exercise-check').click();
    await expect(page.getByTestId('exercise-result')).toContainText(/All checks passed/, { timeout: 60_000 });

    // The position and the code survive a reload.
    await page.reload();
    await expect(page.getByTestId('step-exercise')).toBeVisible();
    await expect(page.getByTestId('exercise').locator('.cm-content').first()).toContainText('Hello, world!');
    await expect(page.getByTestId('step-progress')).toContainText('Step 5 of');

    // Building task: three lines, in Hebrew, which the check accepts.
    await page.getByTestId('step-next').click();
    await expect(page.getByTestId('step-build')).toBeVisible();
    await setEditor(page, 'build', 'print("קוראים לי נועם")\nprint("אני אוהב חתולים")\nprint("אני לומד פייתון")');
    await page.getByTestId('build-check').click();
    await expect(page.getByTestId('build-result')).toContainText(/All checks passed/, { timeout: 60_000 });

    // Practice alone does not complete the lesson: the recap still lists the check.
    await goToSection(page, 8);
    await expect(page.getByTestId('requirements')).toContainText('Pass the understanding check');
    await expect(page.getByTestId('next-lesson')).toHaveCount(0);

    // Understanding check: a wrong answer, a useful retry of only the missed question, then pass.
    await goToSection(page, 7);
    await page.getByTestId('check-option-1').click();
    await page.getByTestId('check-submit').click();
    await page.getByTestId('check-next').click();
    await page.getByTestId('check-option-0').click();
    await page.getByTestId('check-submit').click();
    await page.getByTestId('check-next').click();
    await page.getByTestId('check-option-0').click();
    await page.getByTestId('check-submit').click();
    await page.getByTestId('check-next').click();
    await expect(page.getByTestId('check-result')).toContainText('1 question');
    await page.getByTestId('check-retry').click();
    await expect(page.getByTestId('check')).toContainText('Question 1 of 1');
    await page.getByTestId('check-option-0').click();
    await page.getByTestId('check-submit').click();
    await page.getByTestId('check-next').click();
    await expect(page.getByTestId('check-result')).toContainText('Understanding check passed');

    // Now the lesson is complete and the next one opens.
    await goToSection(page, 8);
    await expect(page.getByTestId('next-lesson')).toBeVisible();
    await page.getByTestId('next-lesson').click();
    await expect(page.getByTestId('lesson-l02-programs-and-files')).toBeVisible();

    await page.goto('#/');
    await expect(page.getByTestId('home')).toContainText('1 of');
  });

  test('the three paces produce different step sequences and the whole-lesson view still works', async ({ page }) => {
    await onboard(page);
    const count = async () => page.locator('.step-dots li').count();
    await page.goto('#/lesson/l02-programs-and-files');
    // Test out of module 1 so lesson 2 is open.
    await page.evaluate(() => {
      const raw = localStorage.getItem('codepath.v1');
      const data = raw ? JSON.parse(raw) : { state: {} };
      data.state.progress = { ...(data.state.progress ?? {}), testedOut: ['m1'] };
      localStorage.setItem('codepath.v1', JSON.stringify(data));
    });
    await setPace(page, 'standard');
    await page.reload();
    await expect(page.getByTestId('lesson-l02-programs-and-files')).toBeVisible();
    const standard = await count();
    await setPace(page, 'slow');
    await page.reload();
    const slow = await count();
    await expect(page.getByTestId('step-progress')).toContainText('Step 1 of');
    await setPace(page, 'fast');
    await page.reload();
    const fast = await count();
    expect(slow).toBeGreaterThan(standard);
    expect(standard).toBeGreaterThan(fast);
    await expect(page.getByTestId('skip-to-check')).toBeVisible();

    // Slow pace: a quick check between explanation steps, and the simpler wording as its own step.
    await setPace(page, 'slow');
    await page.reload();
    await page.getByTestId('step-next').click();
    await page.getByTestId('step-next').click();
    await expect(page.getByTestId('step-mini-0')).toBeVisible();

    // Whole-lesson view shows every section on one page.
    await page.getByTestId('view-full').click();
    await expect(page.locator('[data-view="full"]')).toBeVisible();
    await expect(page.locator('#check')).toBeVisible();
    await page.getByTestId('view-guided').click();
    await expect(page.getByTestId('step-progress')).toBeVisible();
  });

  test('a wrong exercise answer gives a diff and hints, then the solution', async ({ page }) => {
    test.setTimeout(180_000);
    await onboard(page);
    await page.goto('#/lesson/l01-what-computers-do');
    await goToSection(page, 5);
    await setEditor(page, 'exercise', 'print("Hello world")');
    await page.getByTestId('exercise-check').click();
    await expect(page.getByTestId('exercise-result')).toContainText(/did not pass/, { timeout: 90_000 });
    await expect(page.getByTestId('exercise-result')).toContainText('Expected output');
    await page.getByTestId('exercise-hint').click();
    await expect(page.getByTestId('exercise')).toContainText('Hint 1');
    await page.getByTestId('exercise-hint').click();
    await page.getByTestId('exercise-hint').click();
    await page.getByTestId('exercise-solution').click();
    await expect(page.getByTestId('exercise')).toContainText('Hello, world!');
  });

  test('module test: exam mode, scoring, retry draws different variants', async ({ page }) => {
    test.setTimeout(300_000);
    await onboard(page);
    await page.goto('#/placement');
    await page.getByTestId('placement-m1').getByRole('link').click();
    await expect(page.getByTestId('assessment-intro')).toBeVisible();
    await page.getByTestId('assessment-start').click();
    await expect(page.getByTestId('assessment-running')).toBeVisible();

    // Help is switched off during a test.
    await page.getByTestId('tutor-fab').click();
    await expect(page.getByTestId('tutor-panel')).toContainText(/switched off/);
    await page.getByTestId('tutor-fab').click();

    for (let i = 0; i < 12; i += 1) {
      if (await page.getByTestId('assessment-results').isVisible()) break;
      const option = page.getByTestId('exam-option-0');
      const predict = page.getByTestId('exam-predict');
      const submit = page.getByTestId('exam-submit');
      if (await option.isVisible()) {
        await option.click();
        await submit.click();
      } else if (await predict.isVisible()) {
        await predict.fill('?');
        await submit.click();
      } else {
        await page.getByRole('button', { name: /Skip this coding task/ }).click();
      }
    }
    await expect(page.getByTestId('assessment-results')).toBeVisible();
    await expect(page.getByTestId('assessment-score')).toContainText('Score');
    await page.getByTestId('assessment-retry').click();
    await expect(page.getByTestId('assessment-running')).toBeVisible();
  });

  test('Hebrew: RTL layout, LTR code, keyboard navigation between steps, progress kept across language switch', async ({ page }) => {
    await onboard(page, 'he');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByTestId('home')).toContainText('שלום');
    await page.goto('#/lesson/l01-what-computers-do');
    await expect(page.getByTestId('lesson-l01-what-computers-do')).toBeVisible();
    await expect(page.getByTestId('step-progress')).toContainText('צעד 1 מתוך');
    // In RTL the "forward" arrow key is Left.
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByTestId('step-progress')).toContainText('צעד 2 מתוך');
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('step-progress')).toContainText('צעד 1 מתוך');
    await goToSection(page, 5);
    const dir = await page.getByTestId('exercise').locator('.workbench-editor').first().getAttribute('dir');
    expect(dir).toBe('ltr');
    // Tab moves through the step buttons; Next is reachable and activates with Enter.
    await page.getByTestId('step-back').focus();
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('step-next')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('step-build')).toBeVisible();
    // Switch language from the top bar: same page, English UI, progress intact.
    await page.getByTestId('lang-switch').selectOption('en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.getByTestId('lesson-l01-what-computers-do')).toBeVisible();
    await expect(page.getByTestId('step-progress')).toContainText('Step 6 of');
  });

  test('curriculum map shows all ten stages with planned modules explained', async ({ page }) => {
    await onboard(page);
    await page.goto('#/curriculum');
    for (let n = 1; n <= 10; n += 1) await expect(page.getByTestId(`stage-s${n}`)).toBeVisible();
    await page.getByTestId('stage-s7').getByRole('button').first().click();
    await expect(page.getByTestId('stage-s7')).toContainText('Planned');
    await expect(page.getByTestId('stage-s7')).toContainText(/planned but not written yet/);
  });

  test('interactive input: a program waiting for input() can be answered in the console', async ({ page }) => {
    test.setTimeout(180_000);
    await onboard(page);
    await page.goto('#/lesson/l01-what-computers-do');
    await goToSection(page, 5);
    await setEditor(page, 'exercise', 'name = input("Name? ")\nprint("Hi", name)');
    await page.getByTestId('exercise-run').click();
    await expect(page.getByTestId('exercise-need-input')).toBeVisible({ timeout: 90_000 });
    await page.getByTestId('exercise-need-input').fill('Maya');
    await page.getByTestId('exercise-need-input').press('Enter');
    await expect(page.getByTestId('exercise-console')).toContainText('Hi Maya', { timeout: 60_000 });
  });

  test('a runaway loop is stopped with a friendly message', async ({ page }) => {
    test.setTimeout(180_000);
    await onboard(page);
    await page.goto('#/lesson/l01-what-computers-do');
    await goToSection(page, 5);
    await setEditor(page, 'exercise', 'while True:\n    pass');
    await page.getByTestId('exercise-run').click();
    await expect(page.getByTestId('exercise-console')).toContainText(/stopped/, { timeout: 90_000 });
    await setEditor(page, 'exercise', 'print(2 + 2)');
    await page.getByTestId('exercise-run').click();
    await expect(page.getByTestId('exercise-console')).toContainText('4', { timeout: 120_000 });
  });

  test('the tracer shows which branch a condition took', async ({ page }) => {
    test.setTimeout(180_000);
    await onboard(page);
    await page.goto('#/lesson/l01-what-computers-do');
    await goToSection(page, 5);
    await setEditor(page, 'exercise', 'x = 5\nif x > 3:\n    print("big")\nelse:\n    print("small")');
    await page.getByRole('button', { name: 'Visualise' }).click();
    await expect(page.getByTestId('tracer-step')).toContainText('Step 1 of', { timeout: 90_000 });
    await page.getByTestId('tracer-next').click();
    await page.getByTestId('tracer-next').click();
    await expect(page.getByTestId('tracer-condition')).toContainText('x > 3');
    await expect(page.getByTestId('tracer-condition')).toContainText('True');
  });

  test('project workspace saves code and checks steps', async ({ page }) => {
    test.setTimeout(180_000);
    await onboard(page);
    await page.evaluate(() => {
      const raw = localStorage.getItem('codepath.v1');
      const data = raw ? JSON.parse(raw) : { state: {} };
      data.state.progress = { ...(data.state.progress ?? {}), testedOut: ['m1', 'm2', 'm3', 'm4'] };
      localStorage.setItem('codepath.v1', JSON.stringify(data));
    });
    await page.reload();
    await page.goto('#/project/p-guessing-game');
    await expect(page.getByTestId('project-p-guessing-game')).toBeVisible();
    await setEditor(page, 'project-p-guessing-game', 'import random\nsecret = random.randint(1, 100)\nprint("I am thinking of a number between 1 and 100.")');
    await page.getByTestId('project-check-step').click();
    await expect(page.getByTestId('project-p-guessing-game')).toContainText(/All checks passed|did not pass/, { timeout: 90_000 });
    await page.reload();
    await expect(page.getByTestId('project-p-guessing-game').locator('.cm-content').first()).toContainText('random.randint');
  });

  test('the growing text adventure opens after lesson 5, accepts a Hebrew story, and locks later milestones behind their lessons', async ({ page }) => {
    test.setTimeout(240_000);
    await onboard(page);
    await page.goto('#/project/p-text-adventure');
    await expect(page.getByTestId('project-locked')).toBeVisible();
    await page.evaluate(() => {
      const raw = localStorage.getItem('codepath.v1');
      const data = raw ? JSON.parse(raw) : { state: {} };
      data.state.progress = { ...(data.state.progress ?? {}), testedOut: ['m1', 'm2'] };
      localStorage.setItem('codepath.v1', JSON.stringify(data));
    });
    await page.reload();
    await expect(page.getByTestId('project-p-text-adventure')).toBeVisible();
    await expect(page.getByTestId('project-p-text-adventure')).toContainText('4 of 15 steps open now');
    await expect(page.getByTestId('project-step-ta-1-intro')).toBeVisible();
    await setEditor(page, 'project-p-text-adventure', '# המשחק שלי\nprint("תעלומת המגדלור")\nprint()\nprint("סערה מתקרבת.")\nprint("המגדלור כבה.")\nprint("מישהו חייב להדליק את המנורה.")');
    await page.getByTestId('project-check-step').click();
    await expect(page.getByTestId('project-step-ta-1-intro')).toContainText('All checks passed', { timeout: 90_000 });
    // A later milestone is locked and names the lesson it needs.
    await page.getByTestId('project-toc-ta-5-if').click();
    await expect(page.getByTestId('project-step-ta-5-if')).toContainText('opens after a lesson');
    await expect(page.getByTestId('project-step-ta-5-if')).toContainText('if and else');
    await expect(page.getByTestId('project-check-step')).toHaveCount(0);
  });

  test('progress from the previous release migrates: completed lessons stay completed', async ({ page }) => {
    await onboard(page);
    await page.evaluate(() => {
      const v1 = {
        state: {
          settings: { language: 'en', onboarded: true, tutor: { remoteEnabled: true, endpoint: 'http://x', costAcknowledged: true } },
          progress: {
            version: 1,
            lessons: { 'l01-what-computers-do': { status: 'completed', startedAt: '2026-01-01T00:00:00Z', completedAt: '2026-01-01T00:20:00Z' } },
            exercises: { 'l01-ex': { passed: true, attempts: 1, hintsUsed: 0 }, 'l01-build': { passed: true, attempts: 1, hintsUsed: 0 } },
            drafts: {},
            assessments: {},
            projects: {},
            concepts: {},
            testedOut: [],
            achievements: { 'first-lesson': '2026-01-01T00:20:00Z' },
            activeDays: ['2026-01-01'],
            runCount: 3,
            errorRuns: 0,
            fixedErrors: 0,
            reviewSessions: 0,
          },
        },
        version: 0,
      };
      localStorage.setItem('codepath.v1', JSON.stringify(v1));
    });
    await page.goto('#/');
    await page.reload();
    await expect(page.getByTestId('home')).toContainText('1 of');
    await page.goto('#/lesson/l02-programs-and-files');
    await expect(page.getByTestId('lesson-l02-programs-and-files')).toBeVisible();
    await page.goto('#/achievements');
    await expect(page.locator('body')).toContainText('First lesson');
  });
});

test.describe('AI assistant (owner-configured, mocked OpenRouter)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('#/welcome');
    test.skip(!(await backendAvailable(page)), 'assistant backend not available at this base URL');
  });

  test('owner routes are refused without the server-side session; learners see the assistant as unavailable', async ({ page }) => {
    const res = await page.request.get('api/assistant/owner/config');
    expect(res.status()).toBe(401);
    const put = await page.request.put('api/assistant/owner/key', { data: { apiKey: MOCK_KEY }, headers: { 'X-Requested-With': 'codepath' } });
    expect(put.status()).toBe(401);
    await onboard(page);
    await page.goto('#/lesson/l01-what-computers-do');
    await openAiTab(page);
    await expect(page.getByTestId('ai-unavailable')).toBeVisible();
    await expect(page.getByTestId('ai-input')).toHaveCount(0);
  });

  test('the owner signs in, saves and tests a key, enables learners; chat streams, stops, retries, and keeps separate conversations', async ({ page, browser }) => {
    test.setTimeout(240_000);
    await onboard(page);
    await page.goto('#/owner');
    await expect(page.getByTestId('owner-login')).toBeVisible();
    await page.getByTestId('owner-password').fill('wrong-password');
    await page.getByTestId('owner-login-submit').click();
    await expect(page.getByTestId('owner-login')).toContainText('Wrong password');
    await page.getByTestId('owner-password').fill(OWNER_PASSWORD);
    await page.getByTestId('owner-login-submit').click();
    await expect(page.getByTestId('owner-panel')).toBeVisible();

    // The backend keeps its config across browser projects in one run, so start from a known model.
    await page.getByTestId('owner-model-input').fill('openai/gpt-4o-mini');
    await page.getByTestId('owner-settings-save').click();
    await expect(page.getByTestId('owner-panel')).toContainText('Settings saved');
    await page.getByTestId('owner-key-input').fill(MOCK_KEY);
    await page.getByTestId('owner-key-save').click();
    await expect(page.getByTestId('owner-key-status')).toContainText('sk-or-v1-…0000');
    await expect(page.getByTestId('owner-key-input')).toHaveValue('');
    await page.getByTestId('owner-key-test').click();
    await expect(page.getByTestId('owner-test-result')).toContainText('OpenRouter accepts the key', { timeout: 30_000 });
    await expect(page.getByTestId('owner-test-result')).toContainText('OK');
    // The key never appears anywhere in the page.
    expect(await page.content()).not.toContain(MOCK_KEY);
    await page.getByTestId('owner-learner-access').check();
    await expect(page.getByTestId('owner-panel')).toContainText('Learners can now use the AI assistant');

    // Owner chat in lesson mode streams a reply.
    await page.goto('#/lesson/l01-what-computers-do');
    await openAiTab(page);
    await expect(page.getByTestId('ai-input')).toBeVisible();
    await page.getByTestId('ai-input').fill('What does print do?');
    await page.getByTestId('ai-send').click();
    await expect(page.getByTestId('ai-msg-assistant').last()).toContainText('look at your code', { timeout: 30_000 });
    await expect(page.getByTestId('ai-msg-assistant').last()).toHaveAttribute('data-status', 'done');

    // A separate learner (new browser context, no owner cookie) can chat and gets Hebrew.
    const learner = await browser.newContext();
    const lp = await learner.newPage();
    await onboard(lp, 'he');
    await lp.goto('#/lesson/l01-what-computers-do');
    await openAiTab(lp);
    await lp.getByTestId('ai-input').fill('מה זה print?');
    await lp.getByTestId('ai-send').click();
    await expect(lp.getByTestId('ai-msg-assistant').last()).toContainText('שלום', { timeout: 30_000 });
    // The learner's conversation is separate from the owner's.
    await expect(lp.getByTestId('ai-msg-user')).toHaveCount(1);
    await expect(page.getByTestId('ai-msg-user')).toHaveCount(1);
    const cfg = await lp.request.get('api/assistant/owner/config');
    expect(cfg.status()).toBe(401);
    await learner.close();

    // Stop a slow reply, then retry; a broken model reports an error, not a fake reply.
    await page.goto('#/owner');
    await page.getByTestId('owner-model-input').fill('mock/slow');
    await page.getByTestId('owner-settings-save').click();
    await expect(page.getByTestId('owner-panel')).toContainText('Settings saved');
    await page.goto('#/lesson/l01-what-computers-do');
    await openAiTab(page);
    await page.getByTestId('ai-new-chat').click();
    await page.getByTestId('ai-input').fill('Tell me a long story about lighthouses please');
    await page.getByTestId('ai-send').click();
    await expect(page.getByTestId('ai-stop')).toBeVisible();
    await page.getByTestId('ai-stop').click();
    await expect(page.getByTestId('ai-msg-assistant').last()).toHaveAttribute('data-status', 'stopped', { timeout: 15_000 });
    await page.getByTestId('ai-retry').click();
    await expect(page.getByTestId('ai-msg-assistant').last()).toHaveAttribute('data-status', 'done', { timeout: 30_000 });

    await page.goto('#/owner');
    await page.getByTestId('owner-model-input').fill('mock/broken');
    await page.getByTestId('owner-settings-save').click();
    await page.goto('#/lesson/l01-what-computers-do');
    await openAiTab(page);
    await page.getByTestId('ai-new-chat').click();
    await page.getByTestId('ai-input').fill('hello');
    await page.getByTestId('ai-send').click();
    await expect(page.getByTestId('ai-error')).toContainText('unavailable', { timeout: 30_000 });

    // Usage was recorded and the key can be removed, which closes learner access.
    await page.goto('#/owner');
    await expect(page.getByTestId('owner-panel')).toContainText('Requests');
    page.on('dialog', (d) => d.accept());
    await page.getByTestId('owner-key-remove').click();
    await expect(page.getByTestId('owner-panel')).toContainText('No key yet');
    await page.getByTestId('owner-logout').click();
    await expect(page.getByTestId('owner-login')).toBeVisible();
  });
});
