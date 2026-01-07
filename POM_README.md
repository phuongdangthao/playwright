# Page Object Model (POM) — Quick Guide ✅

This repository has been refactored to use a Page Object Model pattern to keep tests readable and maintainable.

## Files added 🔧
- `pages/BasePage.js` — base helper for page visits
- `pages/BookStorePage.js` — encapsulates actions on the Book Store page
- `pages/LoginPage.js` — encapsulates login actions
- `pages/ProfilePage.js` — encapsulates profile actions (search, delete, dialogs)

## How to use

Example: update `tests/bookstore.spec.js` to use `BookStorePage`:

```js
import { test, expect } from '@playwright/test';
import { BookStorePage } from '../pages/BookStorePage.js';

test('search books', async ({ page }) => {
  const bookstore = new BookStorePage(page);
  await bookstore.goto();
  await bookstore.search('Design');
  const titles = await bookstore.getBookTitles();
  expect(titles).toContain('Learning JavaScript Design Patterns');
});
```

Example: login + delete book from profile:

```js
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ProfilePage } from '../pages/ProfilePage.js';

test('delete book', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('username', 'password');

  const profile = new ProfilePage(page);
  await profile.ensureOnProfile();
  await profile.searchBook('Learning JavaScript Design Patterns');
  if (await profile.isBookPresent('Learning JavaScript Design Patterns')) {
    await profile.deleteBook('Learning JavaScript Design Patterns');
    await profile.confirmDeleteIfVisible();
    await profile.waitForDeletedDialog();
  }
});
```

## Notes & Tips 💡
- Tests use ESM imports; ensure `type: "module"` in `package.json` if needed.
- Keep page objects focused: methods should represent user-intent actions (search, delete, login), and avoid exposing raw selectors unless necessary.
- Test inputs are centralized in `tests/data/testData.js` so you can easily make tests data-driven and reuse inputs across specs.

---
If you'd like, I can:
- Convert these files to TypeScript
- Add more page methods or utilities
- Add unit tests for page objects (playwright test can be used)

Tell me which of those you'd prefer next. ✨
