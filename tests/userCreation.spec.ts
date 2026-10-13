import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { UserCreatePage } from '../pages/UserCreatePage';
import userData from '../test-data/users.json';
import { USER_CREATION_DATA } from '../test-data/userCreationData';

test.setTimeout(120_000);

test('Admin can create each BBS user type one by one', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const userCreatePage = new UserCreatePage(page);

  await loginPage.goto();
  await loginPage.login(userData.superadmin.username, userData.superadmin.password);
  await loginPage.assertSuccessfulLogin();

  for (const user of USER_CREATION_DATA) {
    await test.step(`Create ${user.userType}`, async () => {
      await userCreatePage.goto();
      await userCreatePage.fillBasicInformation(user);
      await userCreatePage.selectRole(user.role);
      await userCreatePage.selectLevel(user.level);
      await userCreatePage.selectDivision(user.division);

      if (user.district) {
        await userCreatePage.selectDistrict(user.district);
      }

      if (user.locationType) {
        await userCreatePage.selectLocationType(user.locationType);
      }

      if (user.location) {
        await userCreatePage.selectLocation(user.location);
      }

      await userCreatePage.selectOffice(user.office);
      await userCreatePage.selectGrade(user.grade);
      await userCreatePage.selectDesignation(user.designation);
      await userCreatePage.uploadSignature();
      await userCreatePage.fillPassword(user.password);
      await userCreatePage.submit();
      await userCreatePage.assertSubmissionResult();
    });
  }
});