import { test, expect } from '@playwright/test';

const shouldCaptureScreenshot = process.env.NO_AI_VISION !== '1';

test.describe('Eco Quest layout (1366x768)', () => {
  test('renders without clipping; details reachable by scrolling', async ({ page }) => {
    // Disable onboarding overlays before navigation
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('eco_coach_done', '1');
        window.localStorage.setItem('ecoquest_tutorial_done', '1');
      } catch {}
    });
    await page.goto('/eco-quest/game');

    // Start the game
    await page.getByRole('button', { name: /게임 시작하기/ }).click();

    // In compact desktop view (<= 820px height), default should be non-sticky
    const stickyToggle = page.getByRole('button', { name: /고정 (사용|해제)/ });
    await expect(stickyToggle).toBeVisible();

    // The page should be taller than the viewport so we can scroll
    const canScroll = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight);
    expect(canScroll).toBeTruthy();

    // Open build panel (desktop overlay) and build a simple facility (연구소)
    const openBuild = page.getByRole('button', { name: '시설' });
    await openBuild.click();
    // If any overlay sneaks in, close it gracefully (mobile sheet or other)
    const closeBtn = page.getByRole('button', { name: '닫기' });
    if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      // close any unexpected modal then reopen build
      await closeBtn.click();
      await openBuild.click();
    }
    await page.getByRole('button', { name: '연구소', exact: false }).click();
    await page.locator('button[title="빈 타일"]').nth(10).click();

    // Expand side panels if collapsed, then reach a deep section
    const togglePanels = page.getByRole('button', { name: /패널 펼치기|패널 접기/ });
    if (await togglePanels.isVisible().catch(()=>false)) {
      const label = await togglePanels.textContent();
      if (label && /패널 펼치기/.test(label)) await togglePanels.click();
    }
    const detailsAside = page.locator('aside', { hasText: '상세 정보' }).first();
    await expect(detailsAside).toBeVisible();
    await detailsAside.scrollIntoViewIfNeeded();
    // Pick a stable section inside details (예상 수지/틱)
    await expect(detailsAside.getByText('예상 수지/틱')).toBeVisible();

    if (shouldCaptureScreenshot) {
      await page.screenshot({ path: 'test-results/eco-quest-1366x768.png', fullPage: true });
    }
  });
});
