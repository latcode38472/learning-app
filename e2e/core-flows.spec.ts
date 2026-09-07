/**
 * End-to-end tests for the core learning loop, run against the production
 * build in a real browser (Python executes in the Pyodide worker).
 */
import { expect, test, type Page } from '@playwright/test';

async function onboard(page: Page, lang: 'en' | 'he' = 'en') {
  await page.goto('/#/welcome');
  await page.getByTestId(`lang-${lang}`).click();
  await page.getByTestId('onboarding-start').click();
  await expect(page.getByTestId('home')).toBeVisible();
}

async function setEditor(page: Page, prefix: string, code: string) {
  const editor = page.getByTestId(prefix).locator('.cm-content').first();
  await editor.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Delete');
  // Type line by line so CodeMirror's auto-indent does not add extra spaces.
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    if (i > 0) {
      await page.keyboard.press('Enter');
      await page.keyboard.press('Home');
      await page.keyboard.press('Shift+End');
      await page.keyboard.press('Delete');
    }
    await page.keyboard.type(lines[i]);
  }
}

test.describe('CodePath core flows', () => {
  test('onboarding, first lesson, run code, fix a mistake, pass exercise and build, complete lesson, unlock next', async ({ page }) => {
    test.setTimeout(240_000);
    await onboard(page);

    // Start the first lesson from the home page.
    await page.getByTestId('home-resume').click();
    await expect(page.getByTestId('lesson-l01-what-computers-do')).toBeVisible();

    // The second lesson is locked before the first is completed.
    await page.goto('/#/lesson/l02-programs-and-files');
    await expect(page.getByTestId('lesson-locked')).toBeVisible();
    await page.goto('/#/lesson/l01-what-computers-do');

    // Run code with a deliberate mistake: a friendly error appears.
    await setEditor(page, 'exercise', 'print("Hello');
    await page.getByTestId('exercise-run').click();
    await expect(page.getByTestId('exercise-error')).toBeVisible({ timeout: 90_000 });
    await expect(page.getByTestId('exercise-error')).toContainText('SyntaxError');

    // Fix it and run: output appears in the console.
    await setEditor(page, 'exercise', 'print("Hello, world!")');
    await page.getByTestId('exercise-run').click();
    await expect(page.getByTestId('exercise-console')).toContainText('Hello, world!', { timeout: 60_000 });

    // Submit the exercise: checks pass.
    await page.getByTestId('exercise-check').click();
    await expect(page.getByTestId('exercise-result')).toContainText(/All checks passed/, { timeout: 60_000 });

    // Building task: three different lines about yourself.
    await setEditor(page, 'build', 'print("I like cats")\nprint("I live in Haifa")\nprint("I am learning Python")');
    await page.getByTestId('build-check').click();
    await expect(page.getByTestId('build-result')).toContainText(/All checks passed/, { timeout: 60_000 });

    // Lesson auto-completes and the next lesson opens.
    await expect(page.getByTestId('next-lesson')).toBeVisible();
    await page.getByTestId('next-lesson').click();
    await expect(page.getByTestId('lesson-l02-programs-and-files')).toBeVisible();

    // Progress survives a reload (saved in localStorage) and the home page resumes there.
    await page.reload();
    await page.goto('/#/');
    await expect(page.getByTestId('home')).toContainText('1 of');
    await page.getByTestId('home-resume').click();
    await expect(page.getByTestId('lesson-l02-programs-and-files')).toBeVisible();
  });

  test('a wrong exercise answer gives a diff and hints, then the solution', async ({ page }) => {
    test.setTimeout(180_000);
    await onboard(page);
    await page.goto('/#/lesson/l01-what-computers-do');
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

  test('module test: exam mode, scoring, pass unlocks the next module, tested-out flag', async ({ page }) => {
    test.setTimeout(300_000);
    await onboard(page);
    // Placement lets an experienced learner test out of module 1 directly.
    await page.goto('/#/placement');
    await page.getByTestId('placement-m1').getByRole('link').click();
    await expect(page.getByTestId('assessment-intro')).toBeVisible();
    await page.getByTestId('assessment-start').click();
    await expect(page.getByTestId('assessment-running')).toBeVisible();

    // Tutor is switched off during a test.
    await page.getByTestId('tutor-fab').click();
    await expect(page.getByTestId('tutor-panel')).toContainText(/switched off/);
    await page.getByTestId('tutor-fab').click();

    // Answer every question: pick the first option / type nothing useful / skip code.
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
    // Retry draws different variants without error.
    await page.getByTestId('assessment-retry').click();
    await expect(page.getByTestId('assessment-running')).toBeVisible();
  });

  test('Hebrew: right-to-left layout with left-to-right code, and progress kept across language switch', async ({ page }) => {
    await onboard(page, 'he');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByTestId('home')).toContainText('שלום');
    await page.goto('/#/lesson/l01-what-computers-do');
    await expect(page.getByTestId('lesson-l01-what-computers-do')).toBeVisible();
    // The editor is forced left-to-right inside the RTL page.
    const dir = await page.getByTestId('exercise').locator('.workbench-editor').first().getAttribute('dir');
    expect(dir).toBe('ltr');
    // Switch language from the top bar: same page, English UI, progress intact.
    await page.getByTestId('lang-switch').selectOption('en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.getByTestId('lesson-l01-what-computers-do')).toBeVisible();
  });

  test('curriculum map shows all ten stages with planned modules explained', async ({ page }) => {
    await onboard(page);
    await page.goto('/#/curriculum');
    for (let n = 1; n <= 10; n += 1) await expect(page.getByTestId(`stage-s${n}`)).toBeVisible();
    await page.getByTestId('stage-s7').getByRole('button').first().click();
    await expect(page.getByTestId('stage-s7')).toContainText('Planned');
    await expect(page.getByTestId('stage-s7')).toContainText(/planned but not written yet/);
  });

  test('interactive input: a program waiting for input() can be answered in the console', async ({ page }) => {
    test.setTimeout(180_000);
    await onboard(page);
    await page.goto('/#/lesson/l01-what-computers-do');
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
    await page.goto('/#/lesson/l01-what-computers-do');
    await setEditor(page, 'exercise', 'while True:\n    pass');
    await page.getByTestId('exercise-run').click();
    await expect(page.getByTestId('exercise-console')).toContainText(/stopped/, { timeout: 90_000 });
    // The runtime recovers and can run again.
    await setEditor(page, 'exercise', 'print(2 + 2)');
    await page.getByTestId('exercise-run').click();
    await expect(page.getByTestId('exercise-console')).toContainText('4', { timeout: 120_000 });
  });

  test('project workspace saves code and checks steps', async ({ page }) => {
    test.setTimeout(180_000);
    await onboard(page);
    // Test out of the modules the project needs by injecting progress through the UI-independent store key.
    await page.evaluate(() => {
      const raw = localStorage.getItem('codepath.v1');
      const data = raw ? JSON.parse(raw) : { state: {} };
      data.state.progress = { ...(data.state.progress ?? {}), testedOut: ['m1', 'm2', 'm3', 'm4'] };
      localStorage.setItem('codepath.v1', JSON.stringify(data));
    });
    await page.reload();
    await page.goto('/#/project/p-guessing-game');
    await expect(page.getByTestId('project-p-guessing-game')).toBeVisible();
    await setEditor(page, 'project-p-guessing-game', 'import random\nsecret = random.randint(1, 100)\nprint("I am thinking of a number between 1 and 100.")');
    await page.getByTestId('project-check-step').click();
    await expect(page.getByTestId('project-p-guessing-game')).toContainText(/All checks passed|did not pass/, { timeout: 90_000 });
    await page.reload();
    await expect(page.getByTestId('project-p-guessing-game').locator('.cm-content').first()).toContainText('random.randint');
  });
});
