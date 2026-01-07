export class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  async goto(url, options = { waitUntil: 'domcontentloaded' }) {
    await this.page.goto(url, options);
  }
}
