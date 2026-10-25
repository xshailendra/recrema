import 'dotenv/config';
import mongoose from 'mongoose';
import { AuditLog } from '../models/AuditLog';
import { connectDatabase } from '../config/database';

const BASE_URL = 'http://localhost:5001/api/v1';

const testAdmin = async () => {
  console.log('--- Starting Admin API Tests ---');

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
    // 1. Database Connection for direct verification (e.g. checking audit logs)
    await connectDatabase();

    // 2. Setup sessions
    const adminCookie = await login(process.env.SEED_ADMIN_EMAIL!, process.env.SEED_ADMIN_PASSWORD!);
    const client1Cookie = await login(process.env.SEED_CLIENT1_EMAIL!, process.env.SEED_CLIENT1_PASSWORD!);

    if (!adminCookie || !client1Cookie) {
      throw new Error('Failed to setup test sessions');
    }

    const fetchAdmin = async (cookie: string | null, method: string, path = '', body?: any) => {
      const headers: any = { 'Content-Type': 'application/json' };
      if (cookie) headers['Cookie'] = cookie;
      return fetch(`${BASE_URL}/admin${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    };

    const fetchWaste = async (cookie: string | null, method: string, path = '', body?: any) => {
      const headers: any = { 'Content-Type': 'application/json' };
      if (cookie) headers['Cookie'] = cookie;
      return fetch(`${BASE_URL}/waste${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    };

    // Prepare: Client creates two new pending entries
    let res = await fetchWaste(client1Cookie, 'POST', '', { quantityKg: 10, wasteDate: '2026-10-08', notes: 'To be approved' });
    let data = await res.json();
    const toApproveId = data.data._id;

    res = await fetchWaste(client1Cookie, 'POST', '', { quantityKg: 5, wasteDate: '2026-10-09', notes: 'To be rejected' });
    data = await res.json();
    const toRejectId = data.data._id;

    // G. Clients cannot access admin endpoints -> 403
    res = await fetchAdmin(client1Cookie, 'GET', '/waste/pending');
    if (res.status === 403) console.log('✅ G. Client accessing admin endpoints -> 403');
    else throw new Error(`Expected 403, got ${res.status}`);

    // A. Admin lists all pending -> 200, array
    res = await fetchAdmin(adminCookie, 'GET', '/waste/pending');
    data = await res.json();
    if (res.status === 200 && Array.isArray(data.data) && data.data.every((e: any) => e.status === 'pending')) {
      console.log('✅ A. Admin lists pending -> 200, only pending entries');
    } else throw new Error(`Expected 200 and pending entries, got ${res.status} ${JSON.stringify(data)}`);

    // B. Admin approves pending -> 200, status updated, approvedBy and approvedAt populated
    res = await fetchAdmin(adminCookie, 'PATCH', `/waste/${toApproveId}/approve`);
    data = await res.json();
    if (res.status === 200 && data.data.status === 'approved' && data.data.approvedBy && data.data.approvedAt) {
      console.log('✅ B. Admin approves pending -> 200, status=approved, approvedBy/At populated');
    } else throw new Error(`Expected approval success, got ${res.status} ${JSON.stringify(data)}`);

    // C. Admin attempts to approve already approved -> 409
    res = await fetchAdmin(adminCookie, 'PATCH', `/waste/${toApproveId}/approve`);
    if (res.status === 409) console.log('✅ C. Admin approves already approved -> 409 Conflict');
    else throw new Error(`Expected 409, got ${res.status}`);

    // I. Missing rejection reason -> 400 validation error
    res = await fetchAdmin(adminCookie, 'PATCH', `/waste/${toRejectId}/reject`, {}); // no reason
    if (res.status === 400) console.log('✅ I. Missing rejection reason -> 400 Validation Error');
    else throw new Error(`Expected 400, got ${res.status}`);

    // D. Admin rejects pending -> 200, status updated, rejectionReason populated
    res = await fetchAdmin(adminCookie, 'PATCH', `/waste/${toRejectId}/reject`, { rejectionReason: 'Quality issues' });
    data = await res.json();
    if (res.status === 200 && data.data.status === 'rejected' && data.data.rejectionReason === 'Quality issues') {
      console.log('✅ D. Admin rejects pending -> 200, status=rejected, rejectionReason populated');
    } else throw new Error(`Expected rejection success, got ${res.status} ${JSON.stringify(data)}`);

    // E. Admin attempts to reject already rejected -> 409
    res = await fetchAdmin(adminCookie, 'PATCH', `/waste/${toRejectId}/reject`, { rejectionReason: 'Again' });
    if (res.status === 409) console.log('✅ E. Admin rejects already rejected -> 409 Conflict');
    else throw new Error(`Expected 409, got ${res.status}`);

    // H. Invalid ObjectId -> 400
    res = await fetchAdmin(adminCookie, 'PATCH', `/waste/invalid-id/approve`);
    if (res.status === 400) console.log('✅ H. Invalid ObjectId -> 400 Validation Error');
    else throw new Error(`Expected 400, got ${res.status}`);

    // F. Audit logs are correctly created
    const approveLog = await AuditLog.findOne({ entityId: new mongoose.Types.ObjectId(toApproveId), action: 'APPROVE_WASTE_ENTRY' });
    const rejectLog = await AuditLog.findOne({ entityId: new mongoose.Types.ObjectId(toRejectId), action: 'REJECT_WASTE_ENTRY' });

    if (approveLog && rejectLog && rejectLog.metadata?.reason === 'Quality issues') {
      console.log('✅ F. Audit logs are successfully created and stored in MongoDB');
    } else throw new Error(`Audit logs not found or incorrect!`);

    // J. Admin lists all entries with filters
    res = await fetchAdmin(adminCookie, 'GET', `/waste?status=approved`);
    data = await res.json();
    if (res.status === 200 && Array.isArray(data.data)) {
      console.log('✅ J. Admin lists filtered entries -> 200');
    } else throw new Error(`Expected 200 for filtered list, got ${res.status}`);

    console.log('--- All Admin API Tests Passed ---');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

testAdmin();
