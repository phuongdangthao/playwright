// @ts-check
import { test } from '@playwright/test';
import { addBookByName } from '../api/book.api.js';
import { LoginPage } from '../pages/LoginPage.js';
import { ProfilePage } from '../pages/ProfilePage.js';
import { globalData, profileData } from '../data/testData.js';

test.describe('Delete book', () => {
    test('Verify user can delete added book in his profile', async ({ page }) => {
        const bookName = profileData.bookName;
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(globalData.username, globalData.password);

        const profile = new ProfilePage(page);
        await profile.ensureOnProfile();
        await profile.searchBook(bookName);

        if (!(await profile.isBookPresent(bookName))) {
            console.log(`Book "${bookName}" is not in the profile. Trying to add it through the API.`);
            const added = await addBookByName(bookName);
            if (!added) {
                console.warn(`API did not add "${bookName}"; checking whether it is already in the profile.`);
            }

            await profile.reload();
            await profile.searchBook(bookName);
            await profile.waitForBookPresent(bookName);
        }

        await profile.deleteBook(bookName);
        await profile.confirmDelete();
        const deletedShown = await profile.waitForDeletedDialog(3000);
        if (!deletedShown) {
            console.warn('Book Deleted dialog was not detected.');
        }

        await profile.searchBook(bookName);
        await profile.waitForBookAbsent(bookName);
        console.log(`✅ Book "${bookName}" is deleted successfully.`);
    });
});