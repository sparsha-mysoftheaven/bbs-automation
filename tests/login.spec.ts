import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import userData from '../test-data/users.json';

test.describe('BBS Office Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Valid user can log in and reach dashboard', async () => {
    await loginPage.login(userData.superadmin.username, userData.superadmin.password);
    await loginPage.assertSuccessfulLogin();
  });

  test('User cannot proceed with empty inputs', async () => {
    await loginPage.submitButton.click();
    await loginPage.assertStillOnLoginPage();
  });
});