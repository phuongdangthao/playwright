import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { globalData, profileData } from '../data/testData.js';
import { profileLocators } from '../locator/ProfilePage.js';

export class ProfilePage extends BasePage {
  async ensureOnProfile() {
    await expect(this.page).toHaveURL(profileData.profileURL);
  }

  async searchBook(name) {
    const searchBook = this.page.locator(profileLocators.searchBox);
    await expect(searchBook).toBeVisible();
    await searchBook.fill(name);
  }

  async isBookPresent(name) {
    const bookCell = this.page.locator(profileLocators.bookCell, { hasText: name });
    const count = await bookCell.count();
    return count > 0;
  }

  async deleteBook(name) {
    const deleteButton = this.page.locator(profileLocators.deleteButton(name));
    await deleteButton.click();
  }

  async confirmDeleteIfVisible(timeout) {
    const confirmDialog = this.page.locator(profileLocators.confirmDialog);
    const confirmOkButton = this.page.locator(profileLocators.confirmOkButton);
    if (await confirmDialog.isVisible({ timeout })) {
      await confirmOkButton.click();
    }
  }

  async waitForDeletedDialog(timeout) {
    const deletedDialog = this.page.locator(profileLocators.deletedDialog);
    try {
      await expect(deletedDialog).toBeVisible({ timeout });
      const okButton = this.page.locator(profileLocators.deletedOkButton);
      await okButton.click();
      return true;
    } catch {
      return false;
    }
  }
}
