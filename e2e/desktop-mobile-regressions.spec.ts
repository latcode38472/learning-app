import { expect, test, type Page } from '@playwright/test';
import { setEditor } from './editor';

const lessonPath = '#/lesson/l01-what-computers-do';

async function openLesson(page: Page, lang: 'en' | 'he' = 'en') {
  await page.goto('#/welcome');
  await page.getByTestId(`lang-${lang}`).click();
  await page.getByTestId('onboarding-next').click();
  await page.getByTestId('onboarding-start').click();
  await expect(page.getByTestId('home')).toBeVisible();
  await page.goto(lessonPath);
  // These checks target the full (all sections on one page) view.
  await page.getByTestId('view-full').click();
  await expect(page.getByTestId('exercise')).toBeVisible();
}

for (const lang of ['en', 'he'] as const) {
  test(`${lang}: section navigation keeps the lesson and focuses its destination`, async ({ page }) => {
    await openLesson(page, lang);
    const url = page.url();
    await page.locator('.toc a[href="#exercise"]').click();
    await expect(page).toHaveURL(url);
    await expect(page.locator('section#exercise')).toBeFocused();
    await expect(page.getByTestId('exercise')).toBeVisible();
    await page.locator('.skip-link').focus();
    await page.locator('.skip-link').press('Enter');
    await expect(page).toHaveURL(url);
    await expect(page.locator('main')).toBeFocused();
  });

  test(`${lang}: narrow lesson and tutor controls remain usable`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await openLesson(page, lang);
    await expect(page.locator('.lesson-side')).toHaveCSS('position', 'static');
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await page.getByTestId('tutor-fab').click();
    const panel = page.getByTestId('tutor-panel');
    const send = panel.locator('button[type="submit"]');
    const bounds = await send.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
    await panel.locator('input').fill('Explain variables');
    await send.click();
    await expect(panel.locator('.msg-user')).toHaveText('Explain variables');
  });
}

test('an edit is saved before an immediate reload', async ({ page }) => {
  await openLesson(page);
  const editor = page.getByTestId('exercise').locator('.cm-content').first();
  const draft = 'print("last edit survives")';
  // No polling or debounce delay between the edit and inspecting persistence.
  await editor.fill(draft);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('codepath.v1')!).state.progress.drafts);
  expect(Object.values(saved)).toContain(draft);
  await page.reload();
  await expect(editor).toHaveText(draft);
});

test('empty interactive answers survive later prompts and reruns', async ({ page }) => {
  await openLesson(page);
  await setEditor(page, 'exercise', 'first = input("First? ")\nsecond = input("Second? ")\nprint(repr(first), repr(second))');
  const run = page.getByTestId('exercise-run');
  const input = page.getByTestId('exercise-need-input');
  const output = page.getByTestId('exercise-console');
  await run.click();
  await expect(input).toBeVisible();
  await input.press('Enter');
  await expect(output).toContainText('Second?');
  await expect(input).toBeVisible();
  await input.fill('Maya');
  await input.press('Enter');
  await expect(output).toContainText("'' 'Maya'");
  await expect(input).toBeHidden();
  await run.click();
  await expect(output).toContainText("'' 'Maya'");
  await expect(input).toBeHidden();
});
