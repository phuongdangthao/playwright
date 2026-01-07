import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { globalData, profileData } from '../data/testData.js';

export class ProfilePage extends BasePage {
  async ensureOnProfile() {
    await expect(this.page).toHaveURL(profileData.profileURL);
  }

  async searchBook(name) {
    const searchBook = this.page.locator('#searchBox');
    await expect(searchBook).toBeVisible();
    await searchBook.fill(name);
  }

  async isBookPresent(name) {
    const bookCell = this.page.locator('.rt-td', { hasText: name });
    const count = await bookCell.count();
    return count > 0;
  }

  async deleteBook(name) {
    const deleteButton = this.page.locator(`.rt-tr-group:has(.rt-td:has-text("${name}")) span[title="Delete"]`);
    await deleteButton.click();
  }

  async confirmDeleteIfVisible(timeout) {
    const confirmDialog = this.page.locator('.modal-content:has-text("Do you want to delete this book?")');
    const confirmOkButton = this.page.locator('#closeSmallModal-ok');
    if (await confirmDialog.isVisible({ timeout })) {
      await confirmOkButton.click();
    }
  }

  async waitForDeletedDialog(timeout) {
    const deletedDialog = this.page.locator('.modal-content:has-text("Book deleted")');
    try {
      await expect(deletedDialog).toBeVisible({ timeout });
      const okButton = this.page.locator('#closeSmallModal-ok');
      await okButton.click();
      return true;
    } catch {
      return false;
    }
  }
}
