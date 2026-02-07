import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads and shows hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('best AI apps');
    await expect(page.locator('input[type="search"]')).toBeVisible();
  });

  test('loads category tiles', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Writing')).toBeVisible();
    await expect(page.getByText('Image Generation')).toBeVisible();
    await expect(page.getByText('Code & Dev Tools')).toBeVisible();
  });

  test('search navigates to results page', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('input[type="search"]').first();
    await searchInput.fill('writing');
    await searchInput.press('Enter');
    await expect(page).toHaveURL(/\/search\?q=writing/);
  });
});

test.describe('Tool Page', () => {
  test('renders tool details', async ({ page }) => {
    await page.goto('/tool/chatgpt');
    await expect(page.locator('h1')).toContainText('ChatGPT');
    await expect(page.getByText('Pros')).toBeVisible();
    await expect(page.getByText('Cons')).toBeVisible();
  });

  test('has JSON-LD structured data', async ({ page }) => {
    await page.goto('/tool/chatgpt');
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);
    const content = await jsonLd.textContent();
    const data = JSON.parse(content!);
    expect(data['@type']).toBe('SoftwareApplication');
  });
});

test.describe('Submit Tool', () => {
  test('shows submission form', async ({ page }) => {
    await page.goto('/submit');
    await expect(page.locator('h1')).toContainText('Submit a Tool');
    await expect(page.locator('form')).toBeVisible();
  });

  test('validates required fields', async ({ page }) => {
    await page.goto('/submit');
    await page.click('button[type="submit"]');
    // HTML5 validation should prevent submission
    await expect(page).toHaveURL(/\/submit$/);
  });
});

test.describe('Category Page', () => {
  test('renders category with tools', async ({ page }) => {
    await page.goto('/category/writing');
    await expect(page.locator('h1')).toContainText('Writing');
    // Should have at least one tool card
    await expect(page.locator('article').first()).toBeVisible();
  });
});

test.describe('Theme Toggle', () => {
  test('toggles dark mode', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByLabel(/Switch to dark theme/i);
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});

test.describe('Accessibility', () => {
  test('has skip-to-content link', async ({ page }) => {
    await page.goto('/');
    const skip = page.locator('.skip-to-content');
    await skip.focus();
    await expect(skip).toBeVisible();
  });
});
