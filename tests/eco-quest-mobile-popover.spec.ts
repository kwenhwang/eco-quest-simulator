import { test, expect } from '@playwright/test';

test.describe('Eco Quest mobile detail panel', () => {
  test('tap facility shows detail actions', async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('eco_coach_done', '1');
        window.localStorage.setItem('ecoquest_tutorial_done', '1');
      } catch {}
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/eco-quest/game');
    await page.getByRole('button', { name: /게임 시작하기/ }).click();

    // Open build sheet and select 연구소 (연구소 is available in list)
    await page.getByRole('button', { name: '시설 열기' }).click();
    await page.getByRole('button', { name: /연구소/ }).click();
    // Close the sheet if needed (it closes automatically on select in code)

    // Tap an empty tile to build (use nth to be stable)
    const emptyTiles = page.locator('button[title="빈 타일"]');
    await emptyTiles.nth(10).click();

    // Tap the newly placed tile to show the detail panel (same position)
    await emptyTiles.nth(10).click();

    // Expect detail actions to be present
    await expect(page.getByRole('button', { name: /업그레이드/ })).toBeVisible();
    await expect(page.getByRole('button', { name: '삭제' })).toBeVisible();
    await expect(page.getByText('상세 정보')).toBeVisible();
  });
});
