import { expect, Locator, Page } from '@playwright/test';
import { SurveyCalendarForm } from '../test-data/surveyCalendarData';

export class SurveyCalendarPage {
  readonly page: Page;
  readonly formName: Locator;
  readonly collectionPhase: Locator;
  readonly cropName: Locator;
  readonly cropType: Locator;
  readonly collectionStart: Locator;
  readonly collectionEnd: Locator;
  readonly scheduleStarts: Locator;
  readonly scheduleEnds: Locator;
  readonly activeCheckbox: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formName = page.locator('#survey_form_id');
    this.collectionPhase = page.locator('#survey_episode');
    this.cropName = page.locator('#crop_id');
    this.cropType = page.locator('#crop_type');
    this.collectionStart = page.locator('input[name="start_date_of_collection"]');
    this.collectionEnd = page.locator('input[name="end_date_of_collection"]');
    this.scheduleStarts = page.locator([
      'input[name="notification_start_data_head_office"]',
      'input[name="notification_start_data_division"]',
      'input[name="notification_start_data_zila"]',
      'input[name="notification_start_data_upazila"]',
      'input[name="notification_start_data_field"]',
    ].join(', '));
    this.scheduleEnds = page.locator([
      'input[name="notification_end_data_head_office"]',
      'input[name="notification_end_data_division"]',
      'input[name="notification_end_data_zila"]',
      'input[name="notification_end_data_upazila"]',
      'input[name="notification_end_data_field"]',
    ].join(', '));
    this.activeCheckbox = page.locator('input[name="status"]');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async openCreateForm(): Promise<void> {
    const sidebar = this.page.locator('ul.menu-nav:visible').first();
    const locationMenu = sidebar.locator('a.menu-link').filter({ hasText: 'স্থান পরিচালনা করুন' }).first();

    await expect(locationMenu).toBeAttached();
    await locationMenu.dispatchEvent('click');
    await locationMenu.dispatchEvent('click');
    await sidebar.getByRole('link', { name: 'কৃষি পরিচালনা করুন ' }).click();
    await sidebar.getByRole('link', { name: 'সার্ভে ক্যালেন্ডার ' }).click();
    await this.page.getByRole('link', { name: 'নতুন সার্ভে ক্যালেন্ডার তৈরি করুন' }).click();

    await expect(this.formName).toBeVisible();
  }

  async createFarmerSurvey(form: SurveyCalendarForm, startDate: string, endDate: string): Promise<void> {
    await this.formName.selectOption({ label: form.names[0] });
    if (form.collectionPhase && await this.collectionPhase.isVisible()) {
      await this.collectionPhase.selectOption({ label: form.collectionPhase });
    }
    if (form.cropNames?.length && await this.cropName.isVisible()) {
      await this.cropName.selectOption({ label: form.cropNames[0] });
    }
    if (form.cropTypes?.length && await this.cropType.isVisible()) {
      await this.cropType.selectOption({ label: form.cropTypes[0] });
    }
    await this.collectionStart.evaluate((input, value) => {
      const dateInput = input as HTMLInputElement;
      dateInput.value = value as string;
      dateInput.dispatchEvent(new Event('input', { bubbles: true }));
      dateInput.dispatchEvent(new Event('change', { bubbles: true }));
    }, startDate);
    await this.collectionEnd.evaluate((input, value) => {
      const dateInput = input as HTMLInputElement;
      dateInput.value = value as string;
      dateInput.dispatchEvent(new Event('input', { bubbles: true }));
      dateInput.dispatchEvent(new Event('change', { bubbles: true }));
    }, endDate);
    await this.scheduleStarts.evaluateAll((inputs, value) => {
      for (const input of inputs) {
        const dateInput = input as HTMLInputElement;
        dateInput.value = value as string;
        dateInput.dispatchEvent(new Event('input', { bubbles: true }));
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, startDate);
    await this.scheduleEnds.evaluateAll((inputs, value) => {
      for (const input of inputs) {
        const dateInput = input as HTMLInputElement;
        dateInput.value = value as string;
        dateInput.dispatchEvent(new Event('input', { bubbles: true }));
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, endDate);
    await this.activeCheckbox.evaluate((element) => {
      const checkbox = element as HTMLInputElement;
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('input', { bubbles: true }));
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect(this.activeCheckbox).toBeChecked();
    await this.submitButton.click();
  }

  async assertFarmerSurveyIsListed(form: SurveyCalendarForm, collectionWindow: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'All Survey Calendar' })).toBeVisible();

    const farmerSurveyRow = this.page.locator('tr:visible').filter({
      hasText: form.names[0],
    }).filter({ hasText: collectionWindow }).last();

    await expect(farmerSurveyRow).toBeVisible();
    await expect(farmerSurveyRow).toContainText('Active');
  }
}