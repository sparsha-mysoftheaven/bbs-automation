import { expect, Locator, Page } from '@playwright/test';

export type UserLocationType = 'Upazila' | 'Thana' | 'Municipality';

export interface UserCreationData {
  userType: string;
  firstName: string;
  lastName: string;
  presentAddress: string;
  mobile: string;
  email: string;
  password: string;
  role: string;
  level: string;
  division: string;
  district?: string;
  locationType?: UserLocationType;
  location?: string;
  office: string;
  grade: string;
  designation: string;
}

export class UserCreatePage {
  readonly page: Page;
  readonly url = 'https://eservicedev.bbs.gov.bd/bbs/user/create';

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly mobileInput: Locator;
  readonly emailInput: Locator;
  readonly roleSelect: Locator;
  readonly levelSelect: Locator;
  readonly departmentSelect: Locator;
  readonly divisionSelect: Locator;
  readonly districtSelect: Locator;
  readonly officeSelect: Locator;
  readonly gradeSelect: Locator;
  readonly designationSelect: Locator;
  readonly locationSelect: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly signatureInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input[name="first_name"]');
    this.lastNameInput = page.locator('input[name="last_name"]');
    this.addressInput = page.locator('textarea[name="present_address"]');
    this.mobileInput = page.locator('input[name="mobile"]');
    this.emailInput = page.locator('input[name="email"]');
    this.roleSelect = page.locator('select[name="role_id"]');
    this.levelSelect = page.locator('select[name="level_id"]');
    this.departmentSelect = page.locator('select[name="department_id"]');
    this.divisionSelect = page.locator('select[name="division_id"]');
    this.districtSelect = page.locator('select[name="district_id"]');
    this.officeSelect = page.locator('select[name="office_id"]');
    this.gradeSelect = page.locator('select[name="class"]');
    this.designationSelect = page.locator('select[name="designation_id"]');
    this.locationSelect = page.locator('select[name="upazila_id"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.confirmPasswordInput = page.locator('input[name="confirm-password"]');
    this.signatureInput = page.locator('input[name="signature"]');
    this.submitButton = page.locator('button[name="submitButton"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveURL(this.url);
    await expect(this.firstNameInput).toBeVisible();
  }

  async fillBasicInformation(user: UserCreationData): Promise<void> {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.addressInput.fill(user.presentAddress);
    await this.mobileInput.fill(user.mobile);
    await this.emailInput.fill(user.email);
  }

  async selectOption(select: Locator, label: string): Promise<void> {
    await expect(select).toBeEnabled();
    await expect.poll(async () => {
      return select.locator('option').evaluateAll((options, expectedLabel) => {
        return options.filter((option) => option.textContent?.trim() === expectedLabel).length;
      }, label);
    }).toBe(1);
    await select.selectOption({ label });
  }

  async selectRole(role: string): Promise<void> {
    await this.selectOption(this.roleSelect, role);
  }

  async selectLevel(level: string): Promise<void> {
    await this.selectOption(this.levelSelect, level);
  }

  async selectDivision(division: string): Promise<void> {
    await this.selectOption(this.divisionSelect, division);
  }

  async selectDistrict(district: string): Promise<void> {
    await this.selectOption(this.districtSelect, district);
  }

  async selectOffice(office: string): Promise<void> {
    await this.selectOption(this.officeSelect, office);
  }

  async selectGrade(grade: string): Promise<void> {
    await this.selectOption(this.gradeSelect, grade);
  }

  async selectDesignation(designation: string): Promise<void> {
    await this.selectOption(this.designationSelect, designation);
  }

  async selectLocationType(locationType: UserLocationType): Promise<void> {
    const radioId = {
      Upazila: '#upazilaType1',
      Thana: '#upazilaType2',
      Municipality: '#upazilaType3',
    }[locationType];

    await this.page.locator(radioId).check();
  }

  async selectLocation(location: string): Promise<void> {
    await this.selectOption(this.locationSelect, location);
  }

  async uploadSignature(): Promise<void> {
    const pngBytes = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/Sc0Y1QAAAABJRU5ErkJggg==',
      'base64',
    );

    await this.signatureInput.setInputFiles({
      name: 'test-signature.png',
      mimeType: 'image/png',
      buffer: pngBytes,
    });
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async assertSubmissionResult(): Promise<void> {
    await expect(this.page.locator('body')).toContainText('User Created Successfully');
  }
}