import { test, expect } from '@playwright/test';

test.describe('Eco Quest controls (toggles)', () => {
  test('shows and toggles name labels control', async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('eco_coach_done', '1');
        window.localStorage.setItem('ecoquest_tutorial_done', '1');
      } catch {}
    });

    await page.goto('/eco-quest/game');
    await page.getByRole('button', { name: /게임 시작하기/ }).click();

    // Open mobile controls sheet via FAB to ensure toggle is accessible at any viewport
    await page.setViewportSize({ width: 390, height: 844 });
    const immersiveToggle = page.getByRole('button', { name: /전체|종료/ }).first();
    if (await immersiveToggle.count()) {
      const label = await immersiveToggle.textContent();
      if (label && label.includes('종료')) {
        await immersiveToggle.click();
      }
    }
    // Open the mobile summary menu (⋯ button) and switch to Controls tab
    const moreButton = page.getByRole('button', { name: /자세히|요약|⋯/ });
    await moreButton.click();
    await page.getByRole('button', { name: '설정' }).click();

    // Toggle "이름 표시" by locating the row and the inner On/Off button
    const nameRow = page.locator('div', { hasText: '이름 표시' }).filter({ has: page.locator('button') }).first();
    const onOff = nameRow.locator('button');
    await expect(onOff).toBeVisible();
    const before = await onOff.textContent();
    await onOff.click();
    const after = await onOff.textContent();
    expect(before).not.toEqual(after);

    // Close sheet
    const close = page.getByRole('button', { name: '닫기' });
    await close.click();
  });
});
