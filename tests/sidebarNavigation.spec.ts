import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EXPECTED_SIDEBAR_MENU } from '../test-data/sidebarMenuData';
import userData from '../test-data/users.json';

test.setTimeout(90_000);

test.describe('Dashboard - Sidebar Navigation Verification', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    // Step 1: Navigate to login and authenticate
    await loginPage.goto();
    await loginPage.login(userData.superadmin.username, userData.superadmin.password);
    await loginPage.assertSuccessfulLogin();

    // Step 2: Ensure dashboard sidebar container is available
    await dashboardPage.assertSidebarLoaded();
  });

  test('Verify all top-level sidebar menus and sub-menus exist in DOM', async () => {
    await dashboardPage.assertAllSidebarOptions(EXPECTED_SIDEBAR_MENU);
  });

  test('Verify single distinct critical menus are rendered and enabled', async ({ page }) => {
    // Quick smoke validation on high-priority entry points
    const sidebar = page.locator('ul.menu-nav:visible').first();
    const dashboardLink = sidebar.locator('a[href="https://eservicedev.bbs.gov.bd/bbs"]');
    const logoutItem = sidebar.locator('span.menu-text', { hasText: 'লগআউট' });

    await expect(dashboardLink).toBeVisible();
    await expect(logoutItem).toBeAttached();
  });
});