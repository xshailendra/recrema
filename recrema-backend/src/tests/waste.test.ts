import 'dotenv/config';

const BASE_URL = 'http://localhost:5001/api/v1';

const testWaste = async () => {
  console.log('--- Starting Waste API Tests ---');

  const getCookies = (res: Response): string | null => {
    const setCookie = res.headers.get('set-cookie');
    return setCookie ? setCookie.split(';')[0] : null;
  };

  const login = async (identifier: string, password: string): Promise<string | null> => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    return getCookies(res);
  };

  try {
    // Setup sessions
    const adminCookie = await login(process.env.SEED_ADMIN_EMAIL!, process.env.SEED_ADMIN_PASSWORD!);
    const client1Cookie = await login(process.env.SEED_CLIENT1_EMAIL!, process.env.SEED_CLIENT1_PASSWORD!);
    const client2Cookie = await login(process.env.SEED_CLIENT2_EMAIL!, process.env.SEED_CLIENT2_PASSWORD!);

    if (!adminCookie || !client1Cookie || !client2Cookie) {
      throw new Error('Failed to setup test sessions');
    }

    const fetchWaste = async (cookie: string | null, method: string, path = '', body?: any) => {
      const headers: any = { 'Content-Type': 'application/json' };
      if (cookie) headers['Cookie'] = cookie;
      return fetch(`${BASE_URL}/waste${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    };

    let res, data;

    // A. Unauthenticated POST /waste
    res = await fetchWaste(null, 'POST', '', { quantityKg: 10, wasteDate: '2026-10-06' });
    if (res.status === 401) console.log('✅ A. Unauthenticated POST -> 401');
    else throw new Error(`Expected 401, got ${res.status}`);

    // B. Admin POST /waste
    res = await fetchWaste(adminCookie, 'POST', '', { quantityKg: 10, wasteDate: '2026-10-06' });
    if (res.status === 403) console.log('✅ B. Admin POST -> 403');
    else throw new Error(`Expected 403, got ${res.status}`);

    // C. Client creates valid waste entry
    res = await fetchWaste(client1Cookie, 'POST', '', { quantityKg: 15.5, wasteDate: '2026-10-06', notes: 'Test note' });
    data = await res.json();
    let client1EntryId = data.data?._id;
    if (res.status === 201 && data.data.status === 'pending') {
      console.log('✅ C. Client creates valid entry -> 201, status = pending');
    } else throw new Error(`Expected 201 and pending, got ${res.status}`);

    // D, E, F. Client attempts to provide malicious fields (clientId, status, approvedBy)
    // Thanks to Zod's .strict(), these should actually be rejected entirely by validation (400)
    // rather than ignored, fulfilling the requirement of preventing control of these fields.
    res = await fetchWaste(client1Cookie, 'POST', '', { 
      quantityKg: 20, 
      wasteDate: '2026-10-07', 
      status: 'approved',
      clientId: '60c72b2f9b1e8a001c8e4a5a',
      approvedBy: '60c72b2f9b1e8a001c8e4a5a'
    });
    if (res.status === 400) {
      console.log('✅ D, E, F. Client attempting to set arbitrary fields (clientId, status, approvedBy) is rejected (Zod strict)');
    } else throw new Error(`Expected 400 validation error, got ${res.status}`);

    // Create a generic valid entry for client 2 to test K
    res = await fetchWaste(client2Cookie, 'POST', '', { quantityKg: 5, wasteDate: '2026-10-07' });
    data = await res.json();
    let client2EntryId = data.data._id;

    // G. quantityKg = 0
    res = await fetchWaste(client1Cookie, 'POST', '', { quantityKg: 0, wasteDate: '2026-10-06' });
    if (res.status === 400) console.log('✅ G. quantityKg = 0 -> 400 validation failure');
    else throw new Error(`Expected 400, got ${res.status}`);

    // H. quantityKg < 0
    res = await fetchWaste(client1Cookie, 'POST', '', { quantityKg: -5, wasteDate: '2026-10-06' });
    if (res.status === 400) console.log('✅ H. quantityKg < 0 -> 400 validation failure');
    else throw new Error(`Expected 400, got ${res.status}`);

    // I. invalid wasteDate
    res = await fetchWaste(client1Cookie, 'POST', '', { quantityKg: 10, wasteDate: 'not-a-date' });
    if (res.status === 400) console.log('✅ I. invalid wasteDate -> 400 validation failure');
    else throw new Error(`Expected 400, got ${res.status}`);

    // J. Client lists entries
    res = await fetchWaste(client1Cookie, 'GET');
    data = await res.json();
    if (res.status === 200 && Array.isArray(data.data)) {
      console.log('✅ J. Client lists entries -> 200, array returned');
    } else throw new Error(`Expected 200 list, got ${res.status}`);

    // K. Client 1 attempts to access Client 2's entry
    res = await fetchWaste(client1Cookie, 'GET', `/${client2EntryId}`);
    if (res.status === 404) console.log("✅ K. Client 1 accessing Client 2's entry -> 404");
    else throw new Error(`Expected 404, got ${res.status}`);

    // L. Client retrieves their own entry
    res = await fetchWaste(client1Cookie, 'GET', `/${client1EntryId}`);
    if (res.status === 200) console.log("✅ L. Client retrieves own entry -> 200");
    else throw new Error(`Expected 200, got ${res.status}`);

    // M. Pagination works correctly
    res = await fetchWaste(client1Cookie, 'GET', '?page=1&limit=1');
    data = await res.json();
    if (res.status === 200 && data.pagination.limit === 1) {
      console.log('✅ M. Pagination works correctly');
    } else throw new Error(`Pagination failed: ${JSON.stringify(data)}`);

    // N. Admin attempting client-only GET/POST endpoints
    res = await fetchWaste(adminCookie, 'GET');
    if (res.status === 403) console.log('✅ N. Admin attempting client-only GET -> 403');
    else throw new Error(`Expected 403, got ${res.status}`);

    // O. Newly created entries always have status = pending (Tested in C, but will verify another)
    res = await fetchWaste(client1Cookie, 'POST', '', { quantityKg: 2.2, wasteDate: '2026-10-06' });
    data = await res.json();
    if (data.data.status === 'pending') console.log('✅ O. Newly created entries always have status = pending');
    else throw new Error(`Status was ${data.data.status}`);

    console.log('--- All Waste API Tests Passed ---');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

testWaste();
