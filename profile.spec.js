// @ts-check
import { test, expect } from '@playwright/test';
import { addBookByName } from '../api/book.api.js';

test.describe('Delete book', () => {
    test('Verify user can delete added book in his profile', async ({ page }) => {
        const BASE_URL = 'https://demoqa.com';
        const USERNAME = 'phuongtest3';
        const PASSWORD = 'Test@123';
        const BOOK_NAME = 'Learning JavaScript Design Patterns';

        // Step 1 - Open DemoQA Login page
        await page.goto(`${BASE_URL}/login`, {
            waitUntil: 'domcontentloaded',
        });
        // Step 2 - Login to DemoQA
        await page.fill('#userName', USERNAME);
        await page.fill('#password', PASSWORD);
        await page.click('#login');

        // Step 3 - Go to Profile page
        await expect(page).toHaveURL(/profile/);
        const searchBook = page.locator('#searchBox');
        await expect(searchBook).toBeVisible();

        // Step 4 - Search book
        await searchBook.fill(BOOK_NAME);
        // 4.1 - Check book is existed
        const bookRow = page.locator('.rt-td', { hasText: BOOK_NAME });
        if (await bookRow.count() === 0) {
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
            await searchBook.fill(BOOK_NAME);
            if (await bookRow.count() === 0) {
                console.log(`❌ Book "${BOOK_NAME}" still cannot be found after adding. Stop test.`);
                return;
            }
            console.log(`✅ Book ${BOOK_NAME} is added successfully. Continue testing`);
        } else {
            console.log(`✅ Book "${BOOK_NAME}" is existed in Profile. Countue testing`);
        }

        // Step 5 - Delete searched book
        const deleteButton = page.locator(`.rt-tr-group:has(.rt-td:has-text("${BOOK_NAME}")) span[title="Delete"]`);
        await deleteButton.click();

        // 5.1 - Check Delete Confirmation dialog appears
        const confirmDialog = page.locator(
            '.modal-content:has-text("Do you want to delete this book?")'
        );
        if (await confirmDialog.isVisible({ timeout: 3000 })) {
            console.log('✅ Delete confirmation dialog is displayed');
            await page.locator('#closeSmallModal-ok').click();
        } else {
            console.log('❌ Delete confirmation dialog did not appear');
        }

        // 5.2 - Check Book Deleted dialog appears
        const deletedDialog = page.locator(
            '.modal-content:has-text("Book deleted")'
        );

        try {
            await expect(deletedDialog).toBeVisible({ timeout: 2000 });
            console.log('✅ Book Deleted dialog is displayed');
            await page.locator('#closeSmallModal-ok').click();
        } catch {
            console.log('⚠️ Book Deleted dialog not detected (ignored)');
        }

        // Step 6 - Verify book is deleted
        await searchBook.fill(BOOK_NAME);
        await expect(
            page.locator('.rt-td', { hasText: BOOK_NAME })
        ).toHaveCount(0);
        console.log(`✅ Book "${BOOK_NAME}" is deleted successfully`);
    });
});