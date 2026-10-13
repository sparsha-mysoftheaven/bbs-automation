import { expect, Locator, Page } from '@playwright/test';

export interface CropRecord {
  code: string;
  nameBn: string;
  nameEn: string;
}

export class CropPage {
  readonly page: Page;
  readonly formName: Locator;
  readonly formNameControl: Locator;
  readonly formNameSearch: Locator;
  readonly landType: Locator;
  readonly cropType: Locator;
  readonly nameBn: Locator;
  readonly nameEn: Locator;
  readonly code: Locator;
  readonly activeCheckbox: Locator;
  readonly submitButton: Locator;

  readonly url = 'https://eservicedev.bbs.gov.bd/bbs/crop/create';

  constructor(page: Page) {
    this.page = page;
    this.formName = page.locator('#form_id');
    this.formNameControl = page.locator('#form_id + .select2-container .select2-selection--multiple');
    this.formNameSearch = page.locator('#form_id + .select2-container input.select2-search__field');
    this.landType = page.locator('#crop_type');
    this.cropType = page.locator('select[name="crop_status"]');
    this.nameBn = page.locator('input[name="name_bn"]');
    this.nameEn = page.locator('input[name="name_en"]');
    this.code = page.locator('input[name="code"]');
    this.activeCheckbox = page.locator('input[name="status"]');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url, { waitUntil: 'commit' });
    await expect(this.page).toHaveURL(this.url);
    await expect(this.formName).toBeVisible();
  }

  async createCrop(crop: CropRecord): Promise<void> {
    const formNames = [
      'Shangkalan Form-1: Farmer Survey',
      'Tofsil Form-1: Cluster Survey',
      'Tofsil Form-3: Temporary Crop Survey',
      'Tofsil Form-11: Crop Damage Estimation'
    ];

    for (const formName of formNames) {
      await this.formNameControl.click();
      await this.formNameSearch.fill(formName);
      await this.page.getByRole('option', { name: formName, exact: true }).click({ force: true });
    }
    await this.landType.selectOption('1');
    await this.cropType.selectOption('1');
    await this.nameBn.fill(crop.nameBn);
    await this.nameEn.fill(crop.nameEn);
    await this.code.fill(crop.code);
    await this.activeCheckbox.evaluate((element) => {
      const checkbox = element as HTMLInputElement;
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('input', { bubbles: true }));
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect(this.activeCheckbox).toBeChecked();
    await this.submitButton.click();
  }
}