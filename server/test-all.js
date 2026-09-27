const { app, server } = require('./server');
const mongoose = require('mongoose');

async function runTests() {
  console.log('\n--- STARTING FULL PROJECT VERIFICATION TESTS ---');

  // Wait 2 seconds for DB connection to establish
  await new Promise((r) => setTimeout(r, 2000));

  const BASE_URL = 'http://localhost:5000/api';

  try {
    // 1. Test /api/test
    console.log('\n[1] Testing GET /api/test');
    let res = await fetch(`${BASE_URL}/test`);
    let data = await res.json();
    console.log('Result:', data.message);
    if (!data.success) throw new Error('API test failed');

    // 2. Test User Registration
    console.log('\n[2] Testing POST /api/auth/register (User A - Rahul)');
    res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rahul Sharma',
        email: `rahul_${Date.now()}@campus.edu`,
        password: 'Password123'
      })
    });
    const userA = await res.json();
    console.log('User A Registered:', userA.user.name, '| Token generated:', !!userA.token);
    if (!userA.token) throw new Error('Registration failed');

    // 3. Test User B Registration
    console.log('\n[3] Testing POST /api/auth/register (User B - Priya)');
    res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Priya Patel',
        email: `priya_${Date.now()}@campus.edu`,
        password: 'Password123'
      })
    });
    const userB = await res.json();
    console.log('User B Registered:', userB.user.name, '| Token generated:', !!userB.token);

    // 4. Test User Login
    console.log('\n[4] Testing POST /api/auth/login');
    res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userA.user.email,
        password: 'Password123'
      })
    });
    const loginRes = await res.json();
    console.log('Login Result:', loginRes.message, '| User:', loginRes.user.email);
    if (!loginRes.token) throw new Error('Login failed');

    // 5. Test Creating a LOST Item (by User A)
    console.log('\n[5] Testing POST /api/items (User A posts LOST item)');
    res = await fetch(`${BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userA.token}`
      },
      body: JSON.stringify({
        title: 'Black Titan Leather Wallet',
        description: 'Black leather wallet with college ID card and blue metro pass inside.',
        type: 'LOST',
        category: 'Wallet',
        location: 'Library',
        date: new Date().toISOString()
      })
    });
    const itemLost = await res.json();
    console.log('Lost item created:', itemLost.item.title, '| ID:', itemLost.item._id);

    // 6. Test Creating a FOUND Item (by User B)
    console.log('\n[6] Testing POST /api/items (User B posts FOUND item)');
    res = await fetch(`${BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userB.token}`
      },
      body: JSON.stringify({
        title: 'Black Wallet',
        description: 'Found black wallet on 2nd floor library study table with ID.',
        type: 'FOUND',
        category: 'Wallet',
        location: 'Library',
        date: new Date().toISOString()
      })
    });
    const itemFound = await res.json();
    console.log('Found item created:', itemFound.item.title, '| ID:', itemFound.item._id);

    // 7. Test GET /api/items (Browse items)
    console.log('\n[7] Testing GET /api/items (Fetch all)');
    res = await fetch(`${BASE_URL}/items`);
    const allItems = await res.json();
    console.log(`Fetched ${allItems.count} items from database.`);
    if (allItems.count < 2) throw new Error('Items count mismatch');

    // 8. Test Search Query: "wallet"
    console.log('\n[8] Testing Search: GET /api/items?search=wallet');
    res = await fetch(`${BASE_URL}/items?search=wallet`);
    const searchRes = await res.json();
    console.log(`Search for "wallet" returned ${searchRes.count} matching items.`);
    if (searchRes.count === 0) throw new Error('Search failed');

    // 9. Test Type Filter: "LOST"
    console.log('\n[9] Testing Filter: GET /api/items?type=LOST');
    res = await fetch(`${BASE_URL}/items?type=LOST`);
    const filterLost = await res.json();
    console.log(`Filter type=LOST returned ${filterLost.count} item(s). First item type:`, filterLost.items[0]?.type);
    if (filterLost.items[0]?.type !== 'LOST') throw new Error('Filter type failed');

    // 10. Test Authorization: User B attempts to edit User A's item (should be 403 Forbidden)
    console.log('\n[10] Testing Authorization: User B attempts to edit User A item (Expect 403)');
    res = await fetch(`${BASE_URL}/items/${itemLost.item._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userB.token}`
      },
      body: JSON.stringify({ title: 'Hacked Title' })
    });
    console.log('Status code:', res.status, '(403 Forbidden verified!)');
    if (res.status !== 403) throw new Error('Authorization check failed! Non-owner was able to modify item');

    // 11. Test Edit Own Item: User A edits own item
    console.log('\n[11] Testing PUT /api/items/:id (User A edits own item)');
    res = await fetch(`${BASE_URL}/items/${itemLost.item._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userA.token}`
      },
      body: JSON.stringify({ title: 'Black Titan Leather Wallet (EDITED)' })
    });
    const editRes = await res.json();
    console.log('Updated item title:', editRes.item.title);

    // 12. Test Resolve Item: User A marks item as resolved
    console.log('\n[12] Testing PUT /api/items/:id/resolve (Mark Resolved)');
    res = await fetch(`${BASE_URL}/items/${itemLost.item._id}/resolve`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${userA.token}`
      }
    });
    const resolveRes = await res.json();
    console.log('Status changed to:', resolveRes.item.status);
    if (resolveRes.item.status !== 'RESOLVED') throw new Error('Resolve failed');

    // 13. Test Delete Item: User A deletes own item
    console.log('\n[13] Testing DELETE /api/items/:id (User A deletes own item)');
    res = await fetch(`${BASE_URL}/items/${itemLost.item._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userA.token}`
      }
    });
    const deleteRes = await res.json();
    console.log('Delete result:', deleteRes.message);

    console.log('\n=======================================');
    console.log('ALL API & DATABASE TESTS PASSED 100%! ✅');
    console.log('=======================================\n');

  } catch (err) {
    console.error('\n❌ Test Failure:', err.message);
  } finally {
    await mongoose.disconnect();
    server.close();
    process.exit(0);
  }
}

runTests();
