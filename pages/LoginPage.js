import { BasePage } from './BasePage.js';
import { loginData } from '../data/testData.js';

export class LoginPage extends BasePage {
  async goto() {
    await super.goto(loginData.loginURL);
  }

  async login(username, password) {
    await this.page.locator('#userName').fill(username);
    await this.page.locator('#password').fill(password);
    await this.page.locator('#login').click();
  }
}
