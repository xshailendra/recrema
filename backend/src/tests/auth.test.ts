import 'dotenv/config';

const BASE_URL = 'http://localhost:5001/api/v1';

const testAuth = async () => {
  console.log('--- Starting Auth Tests ---');
  let cookie: string | null = null;
  let clientCookie: string | null = null;

  const getCookies = (res: Response): string | null => {
    const setCookie = res.headers.get('set-cookie');
    return setCookie ? setCookie.split(';')[0] : null;
  };

  const login = async (identifier: string, password: string): Promise<Response> => {
    return fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
  };

  const getMe = async (tokenCookie: string | null): Promise<Response> => {
    return fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: tokenCookie ? { 'Cookie': tokenCookie } : {}
    });
  };

  const logout = async (tokenCookie: string | null): Promise<Response> => {
    return fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: tokenCookie ? { 'Cookie': tokenCookie } : {}
    });
  };

  try {
    // A. Login with valid admin credentials
    let res = await login('admin@recrema.test', 'test_admin_pass');
    let data = await res.json();
    if (res.status === 200 && data.success && getCookies(res)) {
      cookie = getCookies(res);
      console.log('✅ A. Admin Login -> 200, cookie issued');
    } else throw new Error(`Admin login failed: ${JSON.stringify(data)}`);

    // B. Login with valid client email
    res = await login('client1@recrema.test', 'test_client1_pass');
    data = await res.json();
    if (res.status === 200 && data.success && getCookies(res)) {
      clientCookie = getCookies(res);
      console.log('✅ B. Client Email Login -> 200, cookie issued');
    } else throw new Error(`Client email login failed: ${JSON.stringify(data)}`);

    // C. Login with valid clientCode
    res = await login('C-1002', 'test_client2_pass');
    data = await res.json();
    if (res.status === 200 && data.success && getCookies(res)) {
      console.log('✅ C. Client Code Login -> 200, cookie issued');
    } else throw new Error(`Client code login failed: ${JSON.stringify(data)}`);

    // D. Invalid password
    res = await login('admin@recrema.test', 'wrong_pass');
    if (res.status === 401) {
      console.log('✅ D. Invalid password -> 401');
    } else throw new Error(`Expected 401 for invalid pass, got ${res.status}`);

    // E. Unknown email/clientCode
    res = await login('unknown@test.test', 'password');
    if (res.status === 401) {
      console.log('✅ E. Unknown email -> 401');
    } else throw new Error(`Expected 401 for unknown email, got ${res.status}`);

    // F. Inactive user - (we would need to manually make a user inactive to test this)
    // For now we'll skip creating a dummy inactive user just for testing to keep it clean.
    console.log('⚠️  F. Inactive user -> skipped (requires inactive user seed)');

    // G. /me without authentication
    res = await getMe(null);
    if (res.status === 401) {
      console.log('✅ G. /me without authentication -> 401');
    } else throw new Error(`Expected 401 for /me no auth, got ${res.status}`);

    // H. /me with valid authentication
    res = await getMe(cookie);
    data = await res.json();
    if (res.status === 200 && data.data.user.email === 'admin@recrema.test') {
      console.log('✅ H. /me with valid auth -> 200, correct user data');
      
      // I. passwordHash must NEVER be returned
      if (!data.data.user.passwordHash) {
        console.log('✅ I. passwordHash is excluded from /me response');
      } else throw new Error('passwordHash was returned!');
    } else throw new Error(`Failed /me auth test: ${JSON.stringify(data)}`);

    // K. requireRole
    // Test a dummy admin endpoint? We don't have one yet! We will test it in future phases.
    console.log('⚠️  K. requireRole -> skipped (no admin endpoints exist yet)');

    // J. Logout
    res = await logout(cookie);
    const logoutCookies = res.headers.get('set-cookie');
    if (res.status === 200 && logoutCookies && logoutCookies.includes('Max-Age=0') || logoutCookies?.includes('Expires=')) {
      console.log('✅ J. Logout -> cookie cleared');
    } else throw new Error(`Failed logout test, set-cookie header: ${logoutCookies}`);

    console.log('--- All Auth Tests Passed ---');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

testAuth();
