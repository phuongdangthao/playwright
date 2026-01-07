// @ts-check
import { test, expect } from '@playwright/test';
import { addBookByName } from '../api/book.api.js';
import { LoginPage } from '../pages/LoginPage.js';
import { ProfilePage } from '../pages/ProfilePage.js';
import { globalData, profileData } from '../data/testData.js';

test.describe('Delete book', () => {
    test('Verify user can delete added book in his profile', async ({ page }) => {
        const USERNAME = globalData.username;
        const PASSWORD = globalData.password;
        const BOOK_NAME = profileData.bookName;
        // Step 1 - Open DemoQA and Login
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(USERNAME, PASSWORD);

        // Step 2 - Ensure on Profile page
        const profile = new ProfilePage(page);
        await profile.ensureOnProfile();

        // Step 3 - Search book
        await profile.searchBook(BOOK_NAME);

        // Check book is existed. If not, adding this book to Profile using API
        if (!(await profile.isBookPresent(BOOK_NAME))) {
            console.log(`❌ Book ${BOOK_NAME} is not existed. Adding this book to Profile using API.`);
            // Add book by API
            const isAdded = await addBookByName(USERNAME, PASSWORD, BOOK_NAME);
            if (!isAdded) {
                console.log(`❌ Cannot add book "${BOOK_NAME}". Stop test.`);
                return;
            }
            // Reload Profile page
            await page.reload();
            // Re-search book and recheck existence
            await profile.searchBook(BOOK_NAME);
            if (!(await profile.isBookPresent(BOOK_NAME))) {
                console.log(`❌ Book "${BOOK_NAME}" still cannot be found after adding. Stop test.`);
                return;
            }
            console.log(`✅ Book ${BOOK_NAME} is added successfully. Continue testing`);
        } else {
            console.log(`✅ Book "${BOOK_NAME}" is existed in Profile. Continue testing`);
        }

        // Step 4 - Delete searched book
        await profile.deleteBook(BOOK_NAME);
        await profile.confirmDeleteIfVisible(3000);
        const deletedShown = await profile.waitForDeletedDialog(3000);
        if (!deletedShown) console.log('⚠️ Book Deleted dialog not detected');

        // Step 5 - Verify book is deleted
        await profile.searchBook(BOOK_NAME);
        await expect(profile.page.locator('.rt-td', { hasText: BOOK_NAME })).toHaveCount(0);
        console.log(`✅ Book "${BOOK_NAME}" is deleted successfully`);
    });
});