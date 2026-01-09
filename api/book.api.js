import { request } from '@playwright/test';
import { globalData } from '../data/testData.js';

async function addBookByName(bookName) {
  // Create API request context
  const api = await request.newContext({ baseURL: globalData.baseUrl });

  try {
    // Login to get token and userId
    const loginRes = await api.post('/Account/v1/Login', {
      data: { userName: globalData.username, password: globalData.password }
    });

    if (!loginRes.ok()) {
      console.log('❌ Login API failed:', await loginRes.text());
      return false;
    }

    const loginBody = await loginRes.json();
    const token = loginBody.token;
    const userId = loginBody.userId;

    if (!token || !userId) {
      console.log('❌ Login did not return token/userId');
      return false;
    }

    // Get all books
    const booksRes = await api.get('/BookStore/v1/Books');
    if (!booksRes.ok()) {
      console.log('❌ Get books API failed:', await booksRes.text());
      return false;
    }

    const booksBody = await booksRes.json();
    const books = booksBody.books || [];

    // Find book by name
    const book = books.find(b => b.title === bookName);

    if (!book) {
      console.log(`❌ Book "${bookName}" not found`);
      return false;
    }

    // Add book to user profile
    const addRes = await api.post('/BookStore/v1/Books', {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: {
        userId,
        collectionOfIsbns: [{ isbn: book.isbn }]
      }
    });

    if (!addRes.ok()) {
      console.log('❌ Add book API failed:', await addRes.text());
      return false;
    }

    return true;
  } catch (err) {
    console.log('❌ addBookByName error:', err);
    return false;
  } finally {
    // Dispose API context
    try { await api.dispose(); } catch (e) { /* ignore */ }
  }
}

export { addBookByName };
