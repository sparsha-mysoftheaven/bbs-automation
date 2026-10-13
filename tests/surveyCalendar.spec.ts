import { test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { SurveyCalendarPage } from '../pages/SurveyCalendarPage';
import userData from '../test-data/users.json';
import { FARMER_SURVEY_FORM } from '../test-data/surveyCalendarData';

test.setTimeout(90_000);

test('Admin can create and confirm a farmer survey calendar entry', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const surveyCalendarPage = new SurveyCalendarPage(page);

  await loginPage.goto();
  await loginPage.login(userData.superadmin.username, userData.superadmin.password);
  await loginPage.assertSuccessfulLogin();
  await dashboardPage.assertSidebarLoaded();

  await surveyCalendarPage.openCreateForm();
  await surveyCalendarPage.createFarmerSurvey(FARMER_SURVEY_FORM, '01-09', '30-09');
  await surveyCalendarPage.assertFarmerSurveyIsListed(FARMER_SURVEY_FORM, '01 Sep-30 Sep');
});