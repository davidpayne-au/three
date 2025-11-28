import { test, expect } from '@playwright/test';

test('has title and links to about page', async ({ page }) => {
  await page.goto('./');

  // Check for the main heading
  await expect(page.getByRole('heading', { name: 'Build immersive experiences with a minimal Three.js starter.' })).toBeVisible();

  // Check for the "Learn More" link
  const learnMoreLink = page.getByRole('link', { name: 'Learn More' });
  await expect(learnMoreLink).toBeVisible();
  
  // Click the link and verify navigation
  await learnMoreLink.click();
  await expect(page).toHaveURL(/.*about/);
  
  // Verify content on the About page
  await expect(page.getByRole('heading', { name: 'About This Demo' })).toBeVisible();
  await expect(page.getByText('ThreeJS Explorer is a compact starter')).toBeVisible();
});
