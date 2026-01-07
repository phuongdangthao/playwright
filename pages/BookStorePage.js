import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { bookstoreData } from '../data/testData.js';

export class BookStorePage extends BasePage {
  async goto() {
    await super.goto(bookstoreData.bookstoreURL);
  }

  async search(keyword) {
    const searchBook = this.page.locator('#searchBox');
    await expect(searchBook).toBeVisible();
    await searchBook.fill(keyword);
  }

  async getBookTitles() {
    const bookTitleCells = this.page.locator('.rt-td:nth-child(2)');
    await expect(bookTitleCells.first()).toBeVisible();
    const total = await bookTitleCells.count();
    const titles = [];
    for (let i = 0; i < total; i++) {
      const t = (await bookTitleCells.nth(i).innerText()).trim();
      if (t !== '') titles.push(t);
    }
    return titles;
  }
}
