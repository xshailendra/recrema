import 'dotenv/config';
import assert from 'node:assert/strict';
import mongoose, { Types } from 'mongoose';
import { AuditLog } from '../models/AuditLog';
import { User } from '../models/User';
import { CoffeeWasteEntry } from '../models/CoffeeWasteEntry';
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
    assert.equal((await request('/admin/partners', 'POST', client.cookie, {
      name: 'Forbidden', email: `forbidden-${unique}@recrema.test`, clientCode: `NO-${unique}`, password: partnerPassword,
    })).response.status, 403);

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
    assert.equal('passwordHash' in asObject(result.data.data), false);

    result = await request(`/admin/partners/${partnerId}`, 'PATCH', admin.cookie, {
      name: 'Updated Integration Partner', email: `updated-${unique}@recrema.test`, clientCode: `UPDATED-${unique}`,
    });
    assert.equal(result.response.status, 200);
    assert.equal(asObject(result.data.data).name, 'Updated Integration Partner');
    assert.equal(asObject(result.data.data).clientCode, `UPDATED-${unique}`);
    assert.equal('passwordHash' in asObject(result.data.data), false);
    const editedEmail = `updated-${unique}@recrema.test`;
    assert.equal((await login(editedEmail, partnerPassword)).response.status, 200);
    assert.equal((await request(`/admin/partners/${partnerId}`, 'PATCH', admin.cookie, { role: 'admin' })).response.status, 400);
    assert.equal((await request('/admin/partners/invalid-id', 'PATCH', admin.cookie, { name: 'Bad ID' })).response.status, 400);

    assert.equal((await request('/admin/partners/invalid-id', 'GET', admin.cookie)).response.status, 400);
    assert.equal((await request(`/admin/partners/${new Types.ObjectId()}`, 'GET', admin.cookie)).response.status, 404);
    assert.equal((await request('/admin/partners/invalid-id/status', 'PATCH', admin.cookie, { isActive: false })).response.status, 400);
    assert.equal((await request('/admin/partners/invalid-id/reset-password', 'PATCH', admin.cookie, { password: 'new-password' })).response.status, 400);

    result = await request(`/admin/partners/${partnerId}/status`, 'PATCH', admin.cookie, { isActive: false });
    assert.equal(result.response.status, 200);
    assert.equal(asObject(result.data.data).isActive, false);
    assert.equal((await login(editedEmail, partnerPassword)).response.status, 401);

    result = await request(`/admin/partners/${partnerId}/status`, 'PATCH', admin.cookie, { isActive: true });
    assert.equal(result.response.status, 200);
    assert.equal((await login(editedEmail, partnerPassword)).response.status, 200);

    const newPassword = 'new-temporary-password';
    result = await request(`/admin/partners/${partnerId}/reset-password`, 'PATCH', admin.cookie, { password: newPassword });
    assert.equal(result.response.status, 200);
    assert.equal('password' in result.data, false);
    assert.equal((await login(editedEmail, partnerPassword)).response.status, 401);
    assert.equal((await login(editedEmail, newPassword)).response.status, 200);

    result = await request(`/admin/partners/${partnerId}`, 'PATCH', admin.cookie, { password: 'edited-password' });
    assert.equal(result.response.status, 200);
    assert.equal('passwordHash' in asObject(result.data.data), false);
    assert.equal((await login(editedEmail, newPassword)).response.status, 401);
    assert.equal((await login(editedEmail, 'edited-password')).response.status, 200);

    const historicalEntry = await CoffeeWasteEntry.create({
      clientId: new Types.ObjectId(partnerId), quantityKg: 3, wasteDate: new Date('2026-10-01'), status: 'approved',
    });
    result = await request(`/admin/partners/${partnerId}`, 'DELETE', admin.cookie);
    assert.equal(result.response.status, 200);
    assert.equal(asObject(result.data.data).isActive, false);
    assert.equal('passwordHash' in asObject(result.data.data), false);
    assert.ok(await CoffeeWasteEntry.findById(historicalEntry._id));
    assert.equal((await login(editedEmail, 'edited-password')).response.status, 401);
    assert.equal((await request(`/admin/partners/${partnerId}`, 'DELETE', admin.cookie)).response.status, 200);
    const adminProfile = await request('/auth/me', 'GET', admin.cookie);
    const adminUser = asObject(asObject(adminProfile.data.data).user);
    assert.equal((await request(`/admin/partners/${String(adminUser._id)}`, 'DELETE', admin.cookie)).response.status, 403);
    assert.equal((await request(`/admin/partners/${partnerId}`, 'DELETE', client.cookie)).response.status, 403);
    assert.equal((await request('/admin/partners/invalid-id', 'DELETE', admin.cookie)).response.status, 400);

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
      action: { $in: ['CREATE_PARTNER', 'ACTIVATE_PARTNER', 'DEACTIVATE_PARTNER', 'RESET_PARTNER_PASSWORD', 'UPDATE_PARTNER', 'REMOVE_PARTNER'] },
    }).lean();
    assert.ok(logs.some((log) => log.action === 'CREATE_PARTNER'));
    assert.ok(logs.some((log) => log.action === 'ACTIVATE_PARTNER'));
    assert.ok(logs.some((log) => log.action === 'DEACTIVATE_PARTNER'));
    assert.ok(logs.some((log) => log.action === 'RESET_PARTNER_PASSWORD'));
    assert.ok(logs.some((log) => log.action === 'UPDATE_PARTNER'));
    assert.ok(logs.some((log) => log.action === 'REMOVE_PARTNER'));
    assert.equal(logs.some((log) => JSON.stringify(log).includes(partnerPassword)), false);
    assert.equal(logs.some((log) => JSON.stringify(log).includes(newPassword)), false);

    console.log('--- Partner management tests passed ---');
  } finally {
    if (partnerId) {
      await AuditLog.deleteMany({ entityId: new Types.ObjectId(partnerId) });
      await CoffeeWasteEntry.deleteMany({ clientId: new Types.ObjectId(partnerId) });
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
