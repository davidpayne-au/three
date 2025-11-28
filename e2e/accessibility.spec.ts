import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('Home page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('./');
    
    // Wait for the content to load (e.g. the heading)
    await expect(page.getByRole('heading', { name: 'Build immersive experiences' })).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('About page should not have any automatically detectable accessibility issues', async ({ page }) => {
    // Navigate to the about page using the hash router convention
    await page.goto('./#/about');
    
    // Wait for the content to load
    await expect(page.getByRole('heading', { name: 'About This Demo' })).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
