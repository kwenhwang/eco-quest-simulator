import { test, expect, Page, Locator } from '@playwright/test';

const setViewport = { width: 1280, height: 900 } as const;

async function prepareGame(page: Page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem('eco_coach_done', '1');
      window.localStorage.setItem('ecoquest_tutorial_done', '1');
    } catch {}
  });
  await page.setViewportSize(setViewport);
  await page.goto('/eco-quest/game');
  await page.getByRole('button', { name: /게임 시작하기/ }).click();
  const panelToggle = page.getByRole('button', { name: /패널 펼치기|패널 접기/ });
  if (await panelToggle.count()) {
    const label = await panelToggle.textContent();
    if (label && /패널 펼치기/.test(label)) {
      await panelToggle.click();
    }
  }
}

function getDetailPanel(page: Page): Locator {
  return page.locator('aside', { hasText: '정책 패널' }).first();
}

async function ensureDetailsExpanded(detailPanel: Locator) {
  if (await detailPanel.getByRole('button', { name: '간단히' }).count()) {
    return;
  }
  const expandButton = detailPanel.getByRole('button', { name: '자세히' }).first();
  if (await expandButton.count()) {
    await expandButton.click();
  }
}

async function buildFacility(page: Page, label: string, tileIndex = 10, options?: { category?: string }) {
  const dock = page.locator('.kingdom-dock');
  await expect(dock).toBeVisible();
  if (options?.category) {
    await dock.getByRole('button', { name: options.category }).click();
  }
  const buildButton = dock.getByRole('button', { name: `${label} 건설` }).first();
  await expect(buildButton).toBeVisible();
  await buildButton.click();
  await page.locator('button[title="빈 타일"]').nth(tileIndex).click();
  const tile = page.locator(`button[title="${label}"]`).first();
  await expect(tile).toBeVisible();
  await tile.click();
}

function parseNumberFromText(text: string | null): number {
  if (!text) return Number.NaN;
  const match = text.match(/-?\d+/);
  return match ? parseInt(match[0], 10) : Number.NaN;
}

async function getCostRowValue(detailPanel: Locator, label: string) {
  const row = detailPanel.locator(`div:has(> span:has-text("${label}")):has(> span.tabular-nums)`).first();
  const valueText = await row.locator('span.tabular-nums').last().textContent();
  return parseNumberFromText(valueText);
}

test.describe('Eco Quest educational mechanics', () => {
  test('externality ledger contrasts green and polluting builds', async ({ page }) => {
    await prepareGame(page);
    const detailPanel = getDetailPanel(page);

    await ensureDetailsExpanded(detailPanel);
    await buildFacility(page, '연구소', 8, { category: '제조' });
    await ensureDetailsExpanded(detailPanel);
    await expect(detailPanel).toContainText('연구소');

    const ledger = detailPanel.locator('[data-testid="externality-ledger"]').first();
    await expect(ledger).toContainText('대기(월)');
    await expect(ledger).toContainText('+1');

    const greenSocialCost = parseNumberFromText(await detailPanel.getByTestId('social-cost-daily').textContent());
    const greenSocialNet = parseNumberFromText(await detailPanel.getByTestId('social-net-daily').textContent());
    expect(greenSocialCost).toBe(0);
    expect(greenSocialNet).toBeGreaterThan(0);

    await buildFacility(page, '석탄발전소', 14, { category: '발전' });
    await ensureDetailsExpanded(detailPanel);
    await expect(detailPanel).toContainText('석탄발전소');

    await expect(ledger).toContainText('-12');
    const dirtySocialCost = parseNumberFromText(await detailPanel.getByTestId('social-cost-daily').textContent());
    expect(dirtySocialCost).toBeLessThan(0);
  });

  test('policy adjustments increase pollution taxes and penalties', async ({ page }) => {
    await prepareGame(page);
    const detailPanel = getDetailPanel(page);

    await ensureDetailsExpanded(detailPanel);
    await buildFacility(page, '석탄발전소', 6, { category: '발전' });
    await ensureDetailsExpanded(detailPanel);

    const initialTax = await getCostRowValue(detailPanel, '오염세');
    const initialPenalty = await getCostRowValue(detailPanel, '규제 벌금');

    const taxInput = detailPanel.locator('label:has-text("오염세") + div input[type="number"]').first();
    await taxInput.fill('80');
    await taxInput.press('Tab');
    await expect(taxInput).toHaveValue('80');

    await expect.poll(async () => Math.abs(await getCostRowValue(detailPanel, '오염세')))
      .toBeGreaterThan(Math.abs(initialTax));

    const regulationInput = detailPanel.locator('label:has-text("규제 강도") + div input[type="number"]').first();
    await regulationInput.fill('100');
    await regulationInput.press('Tab');
    await expect(regulationInput).toHaveValue('100');

    await expect.poll(async () => Math.abs(await getCostRowValue(detailPanel, '규제 벌금')))
      .toBeGreaterThan(Math.abs(initialPenalty));
  });
});
