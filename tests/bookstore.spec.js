// @ts-check
import { test, expect } from '@playwright/test';
import { BookStorePage } from '../pages/BookStorePage.js';
import { bookstoreData } from '../data/testData.js';

test.describe('Search book', () => {
  test('Verify display all books matching keyword "Design" or "design"', async ({ page }) => {
    const bookstore = new BookStorePage(page);
    // Step 1 - Open Book Store page
    await bookstore.goto();
    await expect(bookstore.page).toHaveURL(bookstoreData.bookstoreURL);

    // Step 2 - Search books, get book titles and verify book titles
    for (const keyword of bookstoreData.searchKeywords) {
      // Step 2.1 - Search books by keywords
      await bookstore.search(keyword);
      console.log(`Searching books with keyword: "${keyword}"`);

      // Step 2.2 - Get book titles
      const bookTitles = await bookstore.getBookTitles();
      console.log('Book titles:', bookTitles);

      // Step 2.3 - Verify book titles
      for (const expectedTitle of bookstoreData.expectedBooks) {
        expect(bookTitles).toContain(expectedTitle);
      }
    }
  });
});