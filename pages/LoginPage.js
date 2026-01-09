import { BasePage } from './BasePage.js';
import { loginData } from '../data/testData.js';
import { loginLocators } from '../locator/LoginPage.js';

export class LoginPage extends BasePage {
  async goto() {
    await super.goto(loginData.loginURL);
  }

  async login(username, password) {
    await this.page.locator(loginLocators.usernameInput).fill(username);
    await this.page.locator(loginLocators.passwordInput).fill(password);
    await this.page.locator(loginLocators.loginButton).click();
  }
}
