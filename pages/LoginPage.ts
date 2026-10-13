import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly url = 'https://eservicedev.bbs.gov.bd/bbs/office/login';
  readonly expectedPostLoginUrl = 'https://eservicedev.bbs.gov.bd/bbs';

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"], input[type="email"], input[placeholder*="email" i]');
    this.passwordInput = page.locator('input[name="password"], input[type="password"]');
    this.submitButton = page.locator('button[type="submit"].btn-primary, button:has-text("Login"), button:has-text("Sign in")');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveURL(this.url);
  }

  async login(username: string, password: string): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();

    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async assertSuccessfulLogin(): Promise<void> {
    await expect(this.page).toHaveURL(this.expectedPostLoginUrl);
  }

  async assertStillOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(this.url);
  }
}