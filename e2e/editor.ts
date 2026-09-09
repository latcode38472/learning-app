import { expect, type Page } from '@playwright/test';

export async function setEditor(page: Page, prefix: string, code: string) {
  const editor = page.getByTestId(prefix).locator('.cm-content').first();
  await editor.click();
  // CodeMirror uses the emulated browser platform; Playwright's
  // ControlOrMeta uses the host OS, which is Linux in CI even for iPhones.
  const apple = await page.evaluate(() => /Mac/.test(navigator.platform) || /iPhone|iPad|iPod/.test(navigator.userAgent));
  await page.keyboard.press(apple ? 'Meta+A' : 'Control+A');
  // Insert the whole document in one edit; mobile browsers handle Home/End
  // and contenteditable fill differently from desktop browsers.
  await page.keyboard.insertText(code);
  await expect.poll(async () => page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('codepath.v1')!).state;
    return [...Object.values(state.progress.drafts), ...Object.values(state.progress.projects).map((p) => (p as { code: string }).code)];
  }), { timeout: 5_000 }).toContain(code);
}

