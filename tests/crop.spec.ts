import { test } from '@playwright/test';
import { CropPage } from '../pages/CropPage';
import { LoginPage } from '../pages/LoginPage';
import userData from '../test-data/users.json';
import { PERENNIAL_CROPS } from '../test-data/cropData';

test.setTimeout(120_000);

test('Admin can create perennial crops one by one', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cropPage = new CropPage(page);

  await loginPage.goto();
  await loginPage.login(userData.superadmin.username, userData.superadmin.password);
  await loginPage.assertSuccessfulLogin();

  for (const crop of PERENNIAL_CROPS) {
    await cropPage.goto();
    await cropPage.createCrop(crop);
  }
});