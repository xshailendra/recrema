import 'dotenv/config';
import assert from 'node:assert/strict';
import mongoose, { Types } from 'mongoose';
import { AuditLog } from '../models/AuditLog';
import { User } from '../models/User';
import { connectDatabase } from '../config/database';

const BASE_URL = 'http://localhost:5001/api/v1';
const unique = Date.now().toString();
const partnerEmail = `partner-${unique}@recrema.test`;
const partnerCode = `RECREMA-${unique}`;
const partnerPassword = 'temporary-password';

interface JsonObject {
  [key: string]: unknown;
}

const asObject = (value: unknown): JsonObject => {
  assert.equal(typeof value, 'object');
  assert.notEqual(value, null);
  return value as JsonObject;
};

const getCookie = (response: Response): string | null => {
  const setCookie = response.headers.get('set-cookie');
  return setCookie ? setCookie.split(';')[0] : null;
};

const request = async (
  path: string,
  method: string,
  cookie?: string | null,
  body?: JsonObject
): Promise<{ response: Response; data: JsonObject }> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (cookie) headers.Cookie = cookie;
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return { response, data: asObject(await response.json()) };
};

const login = async (identifier: string, password: string): Promise<{ response: Response; cookie: string | null }> => {
  const { response } = await request('/auth/login', 'POST', null, { identifier, password });
  return { response, cookie: getCookie(response) };
};

const run = async () => {
  await connectDatabase();
  let partnerId: string | undefined;

  try {
    const admin = await login(process.env.SEED_ADMIN_EMAIL ?? '', process.env.SEED_ADMIN_PASSWORD ?? '');
    const client = await login(process.env.SEED_CLIENT1_EMAIL ?? '', process.env.SEED_CLIENT1_PASSWORD ?? '');
    assert.equal((await request('/admin/partners', 'GET')).response.status, 401);
    assert.equal((await request('/admin/partners', 'GET', client.cookie)).response.status, 403);

    let result = await request('/admin/partners', 'POST', admin.cookie, {
      name: 'Integration Partner',
      email: partnerEmail,
      clientCode: partnerCode,
      password: partnerPassword,
    });
    assert.equal(result.response.status, 201);
    const created = asObject(asObject(result.data.data));
    partnerId = String(created._id);
    assert.equal(created.role, 'client');
    assert.equal(created.isActive, true);
    assert.equal('passwordHash' in created, false);
    assert.equal('password' in created, false);

    result = await request('/admin/partners', 'POST', admin.cookie, {
      name: 'Duplicate Email',
      email: partnerEmail,
      clientCode: `${partnerCode}-EMAIL`,
      password: partnerPassword,
    });
    assert.equal(result.response.status, 409);

    result = await request('/admin/partners', 'POST', admin.cookie, {
      name: 'Duplicate Code',
      email: `duplicate-${unique}@recrema.test`,
      clientCode: partnerCode,
      password: partnerPassword,
    });
    assert.equal(result.response.status, 409);

    result = await request('/admin/partners?search=Integration&page=1&limit=10', 'GET', admin.cookie);
    assert.equal(result.response.status, 200);
    assert.ok(Array.isArray(result.data.data));
    assert.equal(asObject(result.data.pagination).limit, 10);
    const listEntry = asObject((result.data.data as unknown[])[0]);
    assert.equal(listEntry._id, partnerId);

    result = await request(`/admin/partners/${partnerId}`, 'GET', admin.cookie);
    assert.equal(result.response.status, 200);
    assert.equal(asObject(result.data.data).email, partnerEmail);

    assert.equal((await request('/admin/partners/invalid-id', 'GET', admin.cookie)).response.status, 400);
    assert.equal((await request(`/admin/partners/${new Types.ObjectId()}`, 'GET', admin.cookie)).response.status, 404);
    assert.equal((await request('/admin/partners/invalid-id/status', 'PATCH', admin.cookie, { isActive: false })).response.status, 400);
    assert.equal((await request('/admin/partners/invalid-id/reset-password', 'PATCH', admin.cookie, { password: 'new-password' })).response.status, 400);

    result = await request(`/admin/partners/${partnerId}/status`, 'PATCH', admin.cookie, { isActive: false });
    assert.equal(result.response.status, 200);
    assert.equal(asObject(result.data.data).isActive, false);
    assert.equal((await login(partnerEmail, partnerPassword)).response.status, 401);

    result = await request(`/admin/partners/${partnerId}/status`, 'PATCH', admin.cookie, { isActive: true });
    assert.equal(result.response.status, 200);
    assert.equal((await login(partnerEmail, partnerPassword)).response.status, 200);

    const newPassword = 'new-temporary-password';
    result = await request(`/admin/partners/${partnerId}/reset-password`, 'PATCH', admin.cookie, { password: newPassword });
    assert.equal(result.response.status, 200);
    assert.equal('password' in result.data, false);
    assert.equal((await login(partnerEmail, partnerPassword)).response.status, 401);
    assert.equal((await login(partnerEmail, newPassword)).response.status, 200);

    result = await request('/admin/partners', 'POST', admin.cookie, {
      name: 'Role Escalation',
      email: `role-${unique}@recrema.test`,
      clientCode: `ROLE-${unique}`,
      password: partnerPassword,
      role: 'admin',
    });
    assert.equal(result.response.status, 400);

    const logs = await AuditLog.find({
      entityId: new Types.ObjectId(partnerId),
      action: { $in: ['CREATE_PARTNER', 'ACTIVATE_PARTNER', 'DEACTIVATE_PARTNER', 'RESET_PARTNER_PASSWORD'] },
    }).lean();
    assert.ok(logs.some((log) => log.action === 'CREATE_PARTNER'));
    assert.ok(logs.some((log) => log.action === 'ACTIVATE_PARTNER'));
    assert.ok(logs.some((log) => log.action === 'DEACTIVATE_PARTNER'));
    assert.ok(logs.some((log) => log.action === 'RESET_PARTNER_PASSWORD'));
    assert.equal(logs.some((log) => JSON.stringify(log).includes(partnerPassword)), false);
    assert.equal(logs.some((log) => JSON.stringify(log).includes(newPassword)), false);

    console.log('--- Partner management tests passed ---');
  } finally {
    if (partnerId) {
      await AuditLog.deleteMany({ entityId: new Types.ObjectId(partnerId) });
      await User.deleteOne({ _id: new Types.ObjectId(partnerId) });
    }
    await User.deleteMany({ email: { $in: [`duplicate-${unique}@recrema.test`, `role-${unique}@recrema.test`] } });
    await mongoose.disconnect();
  }
};

run().catch((error: unknown) => {
  console.error('Partner management tests failed:', error);
  process.exitCode = 1;
});
