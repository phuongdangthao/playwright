// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Search book', () => {
  test('Verify display all books matching keyword "Design" or "design"', async ({ page }) => {
    // Step 1: Open Book Store page
    await page.goto('https://demoqa.com/books', {
      waitUntil: 'domcontentloaded',
    });

    // Step 2: Search books by keyword
    const searchBox = page.locator('#searchBox');
    await expect(searchBox).toBeVisible();
    const searchKeywords = ['Design', 'design'];

    for (const keyword of searchKeywords) {
      // 2.1 - Search by keyword
      await searchBox.fill(keyword);
      console.log(`Searching books with keyword: "${keyword}"`);

      // 2.2 -  Collect book titles
      const bookTitleCells = page.locator('.rt-td:nth-child(2)');
      await expect(bookTitleCells.first()).toBeVisible();

      const totalTitles = await bookTitleCells.count();
      const bookTitles = [];

      for (let i = 0; i < totalTitles; i++) {
        const title = (await bookTitleCells.nth(i).innerText()).trim();
        if (title !== '') {
          bookTitles.push(title);
        }
      }

      console.log('Book titles:', bookTitles);

      // Step 3: Check expected books are present
      const expectedBooks = [
        'Learning JavaScript Design Patterns',
        'Designing Evolvable Web APIs with ASP.NET'
      ];

      for (const expectedTitle of expectedBooks) {
        expect(bookTitles).toContain(expectedTitle);
      }
    }
  })
});