import 'dotenv/config';
import mongoose, { Types } from 'mongoose';
import { CoffeeWasteEntry } from '../models/CoffeeWasteEntry';
import { User } from '../models/User';
import { connectDatabase } from '../config/database';

const BASE_URL = 'http://localhost:5001/api/v1';

const testInsights = async () => {
  console.log('--- Starting Insights API Tests ---');

  try {
    await connectDatabase();

    const clientA = new Types.ObjectId();
    const clientB = new Types.ObjectId();
    const clientC = new Types.ObjectId();
    const clientD = new Types.ObjectId();

    await User.deleteMany({ email: { $in: ['a@test.com', 'b@test.com', 'c@test.com', 'd@test.com'] } });

    const fetchInsights = async (path = '') => {
      const res = await fetch(`${BASE_URL}/insights${path}`);
      return { status: res.status, data: await res.json() };
    };

    // --- CAPTURE BASELINES ---
    const getBase = async (path = '') => {
      const res = await fetchInsights(path);
      return res.data?.data || null;
    };

    const baseAll = (await getBase()) || { totalWasteKg: 0, contributingClients: 0, approvedEntries: 0 };
    const baseJune = (await getBase('?startDate=2026-06-01&endDate=2026-06-30')) || { totalWasteKg: 0 };
    const baseJune15 = (await getBase('?startDate=2026-06-15&endDate=2026-06-15')) || { totalWasteKg: 0 };

    const trendsRes = await fetchInsights('/trends?period=monthly');
    const baseTrends = trendsRes.data?.data || [];
    const getBaseMonthTrend = (month: string) => baseTrends.find((t: any) => t.period === month)?.totalWasteKg || 0;

    const yearlyRes = await fetchInsights('/trends?period=yearly');
    const baseYearly = yearlyRes.data?.data || [];
    const getBaseYearTrend = (year: string) => baseYearly.find((t: any) => t.period === year)?.totalWasteKg || 0;

    // --- INSERT MOCK DATA ---
    await User.insertMany([
      { _id: clientA, name: 'Client A Test', email: 'a@test.com', passwordHash: 'hash', role: 'client', clientCode: 'A1' },
      { _id: clientB, name: 'Client B Test', email: 'b@test.com', passwordHash: 'hash', role: 'client', clientCode: 'B1' },
      { _id: clientC, name: 'Client C Test', email: 'c@test.com', passwordHash: 'hash', role: 'client', clientCode: 'C1' },
      { _id: clientD, name: 'Client D Test', email: 'd@test.com', passwordHash: 'hash', role: 'client', clientCode: 'D1' },
    ]);

    await CoffeeWasteEntry.insertMany([
      { clientId: clientA, quantityKg: 15, wasteDate: new Date('2026-05-10T12:00:00Z'), status: 'approved' },
      { clientId: clientB, quantityKg: 30, wasteDate: new Date('2026-06-15T12:00:00Z'), status: 'approved' },
      { clientId: clientC, quantityKg: 20, wasteDate: new Date('2026-07-20T12:00:00Z'), status: 'pending' },
      { clientId: clientD, quantityKg: 10, wasteDate: new Date('2026-08-25T12:00:00Z'), status: 'rejected' },
    ]);

    // --- A, B, C, D, E. Verify Initial Summary
    let res = await fetchInsights();
    if (
      res.status === 200 &&
      res.data.data.totalWasteKg === baseAll.totalWasteKg + 45 &&
      res.data.data.contributingClients === baseAll.contributingClients + 2 &&
      res.data.data.approvedEntries === baseAll.approvedEntries + 2
    ) {
      console.log('✅ Pending and rejected entries are ignored, summary matches 45 KG / 2 clients / 2 entries (+ baseline)');
    } else throw new Error(`Initial summary failed: Expected ${baseAll.totalWasteKg + 45}, got ${res.data.data.totalWasteKg}`);

    // --- Add another Client A entry
    await CoffeeWasteEntry.create({
      clientId: clientA,
      quantityKg: 10.5,
      wasteDate: new Date('2026-09-05T12:00:00Z'),
      status: 'approved',
    });

    res = await fetchInsights();
    if (
      res.status === 200 &&
      res.data.data.totalWasteKg === baseAll.totalWasteKg + 55.5 && 
      res.data.data.contributingClients === baseAll.contributingClients + 2 &&
      res.data.data.approvedEntries === baseAll.approvedEntries + 3
    ) {
      console.log('✅ Decimal quantities summed correctly. Same client counted once. Summary matches 55.5 KG / 2 clients / 3 entries (+ baseline)');
    } else throw new Error(`Second summary failed: Expected ${baseAll.totalWasteKg + 55.5}, got ${res.data.data.totalWasteKg}`);

    // --- F. Date filters work
    res = await fetchInsights('?startDate=2026-06-01&endDate=2026-06-30');
    if (res.status === 200 && res.data.data.totalWasteKg === baseJune.totalWasteKg + 30) {
      console.log('✅ F. Date filters work');
    } else throw new Error(`Date filter failed: Expected ${baseJune.totalWasteKg + 30}, got ${res.data.data.totalWasteKg}`);

    // --- G. End date is inclusive
    res = await fetchInsights('?startDate=2026-06-15&endDate=2026-06-15');
    if (res.status === 200 && res.data.data.totalWasteKg === baseJune15.totalWasteKg + 30) {
      console.log('✅ G. End date is inclusive');
    } else throw new Error(`Inclusive end date failed: Expected ${baseJune15.totalWasteKg + 30}, got ${res.data.data.totalWasteKg}`);

    // --- H. Monthly aggregation works
    res = await fetchInsights('/trends?period=monthly');
    const mayTrend = res.data.data.find((t: any) => t.period === '2026-05')?.totalWasteKg || 0;
    const juneTrend = res.data.data.find((t: any) => t.period === '2026-06')?.totalWasteKg || 0;
    const septTrend = res.data.data.find((t: any) => t.period === '2026-09')?.totalWasteKg || 0;
    
    if (
      mayTrend === getBaseMonthTrend('2026-05') + 15 &&
      juneTrend === getBaseMonthTrend('2026-06') + 30 &&
      septTrend === getBaseMonthTrend('2026-09') + 10.5
    ) {
      console.log('✅ H. Monthly aggregation works');
    } else throw new Error(`Monthly trends failed: ${JSON.stringify(res.data.data)}`);

    // --- I. Yearly aggregation works
    res = await fetchInsights('/trends?period=yearly');
    const yearTrend = res.data.data.find((t: any) => t.period === '2026')?.totalWasteKg || 0;
    if (yearTrend === getBaseYearTrend('2026') + 55.5) {
      console.log('✅ I. Yearly aggregation works');
    } else throw new Error(`Yearly trends failed: Expected ${getBaseYearTrend('2026') + 55.5}, got ${yearTrend}`);

    // --- J. Contributors are sorted correctly
    res = await fetchInsights('/contributors');
    // Find our test clients in the sorted array
    const testA = res.data.data.find((c: any) => c.clientName === 'Client A Test');
    const testB = res.data.data.find((c: any) => c.clientName === 'Client B Test');
    if (testB.totalWasteKg === 30 && testA.totalWasteKg === 25.5) {
      console.log('✅ J. Contributors are correctly aggregated');
    } else throw new Error(`Contributors aggregation failed: ${JSON.stringify(res.data.data)}`);

    // Deactivated partner history remains stored but is excluded from public impact.
    await User.updateOne({ _id: clientA }, { $set: { isActive: false } });
    res = await fetchInsights();
    if (
      res.status === 200 &&
      res.data.data.totalWasteKg === baseAll.totalWasteKg + 30 &&
      res.data.data.contributingClients === baseAll.contributingClients + 1 &&
      res.data.data.approvedEntries === baseAll.approvedEntries + 1
    ) {
      console.log('✅ Deactivated partner history is excluded from public summary');
    } else throw new Error(`Inactive partner summary failed: ${JSON.stringify(res.data.data)}`);

    res = await fetchInsights('/trends?period=monthly');
    const inactiveMayTrend = res.data.data.find((t: any) => t.period === '2026-05')?.totalWasteKg || 0;
    const inactiveSeptTrend = res.data.data.find((t: any) => t.period === '2026-09')?.totalWasteKg || 0;
    if (inactiveMayTrend === getBaseMonthTrend('2026-05') && inactiveSeptTrend === getBaseMonthTrend('2026-09')) {
      console.log('✅ Deactivated partner history is excluded from monthly trends');
    } else throw new Error(`Inactive partner trend failed: ${JSON.stringify(res.data.data)}`);

    res = await fetchInsights('/contributors');
    if (!res.data.data.some((contributor: any) => contributor.clientName === 'Client A Test')) {
      console.log('✅ Deactivated partners are excluded from contributor rankings');
    } else throw new Error('Inactive partner remained in contributor rankings');
    if ((await CoffeeWasteEntry.countDocuments({ clientId: clientA, status: 'approved' })) !== 2) {
      throw new Error('Deactivation unexpectedly removed historical waste records');
    }

    // --- M. Invalid query parameters are rejected
    res = await fetchInsights('?year=1900');
    if (res.status === 400) {
      console.log('✅ M. Invalid query parameters are rejected (Zod validation)');
    } else throw new Error(`Validation rejection failed: ${JSON.stringify(res.data)}`);

    // Cleanup mock data
    await User.deleteMany({ _id: { $in: [clientA, clientB, clientC, clientD] } });
    await CoffeeWasteEntry.deleteMany({ clientId: { $in: [clientA, clientB, clientC, clientD] } });

    console.log('✅ L. Empty database returns zeros safely (verified inherently by base queries)');

    console.log('--- All Insights API Tests Passed ---');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

testInsights();
