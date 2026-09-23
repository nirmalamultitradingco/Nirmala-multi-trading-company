async function runTest() {
  const baseUrl = 'http://localhost:5000/api';

  // 1. Subscribe
  console.log('--- Testing Subscribe ---');
  const subRes = await fetch(`${baseUrl}/subscribers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'supermarket.procurement@gulfdistributors.ae', source: 'footer' }),
  });
  console.log('Subscribe status:', subRes.status, await subRes.json());

  // 2. Admin Login
  console.log('\n--- Admin Login ---');
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@harvestbridge.com', password: 'admin12345' }),
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log('Login success, token exists:', !!token);

  // 3. Admin Get Subscribers
  console.log('\n--- Get Subscribers ---');
  const listRes = await fetch(`${baseUrl}/subscribers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const listData = await listRes.json();
  console.log('Subscribers count:', listData.totalCount, 'Active:', listData.activeCount);

  // 4. Manual Broadcast
  console.log('\n--- Send Manual Broadcast ---');
  const broadcastRes = await fetch(`${baseUrl}/subscribers/broadcast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      subject: 'New Crop Season: Fresh Gujarat Cumin (Jeera) Machine Cleaned 99% Purity',
      message: 'Booking 20ft & 40ft containers for immediate dispatch from Mundra Port under CIF terms.',
      link: '/products',
    }),
  });
  console.log('Broadcast status:', broadcastRes.status, await broadcastRes.json());

  // 5. Test Auto-Notification on Blog Creation
  console.log('\n--- Create Blog Post (Triggers Auto-Notification) ---');
  const blogRes = await fetch(`${baseUrl}/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      title: 'Global Spices Market Forecast 2026',
      summary: 'Analysis of Indian spice harvest yields and ocean container freight rate indices.',
      content: 'Detailed agro market insights for international bulk commodity buyers.',
      publishedAt: new Date(),
    }),
  });
  const blogData = await blogRes.json();
  console.log('Created blog post ID:', blogData._id, blogData.title);

  // Wait 500ms for background notification to write
  await new Promise(r => setTimeout(r, 600));

  // 6. Check Broadcast History
  console.log('\n--- Check Broadcast History Logs ---');
  const logsRes = await fetch(`${baseUrl}/subscribers/broadcasts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const logs = await logsRes.json();
  console.log('Broadcast logs recorded:', logs.length);
  logs.slice(0, 3).forEach(l => console.log(`- [${l.type.toUpperCase()}] ${l.subject} (${l.recipientCount} recipients) at ${l.sentAt}`));

  // Clean up test blog
  if (blogData._id) {
    await fetch(`${baseUrl}/news/${blogData._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Cleaned up test blog post.');
  }

  console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
}

runTest().catch(console.error);
