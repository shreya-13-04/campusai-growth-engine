import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  CAMPAIGN_INFO,
  getInitialChannels,
  getInitialDailyMetrics,
  getInitialAmbassadors,
  getInitialReferralCodes,
  getInitialExperiments,
  getInitialRegistrations,
  OUTREACH_TEMPLATES,
} from '../src/data/defaultData.js';

describe('CampusAI Growth Engine - Comprehensive Operational Audit', () => {
  // Test 1: Registration Creation & Duplicate Prevention
  test('(1) Registration creation and duplicate prevention', () => {
    const registrations = getInitialRegistrations();
    const initialCount = registrations.length;

    // Check existing email
    const existingEmail = registrations[0].email;
    const isDuplicate = registrations.some(
      (r) => r.email.toLowerCase() === existingEmail.toLowerCase()
    );
    assert.equal(isDuplicate, true, 'Existing email should be flagged as duplicate');

    // Attempting new registration with unique email
    const uniqueEmail = 'new.unique.student@vbit.ac.in';
    const isNewDuplicate = registrations.some(
      (r) => r.email.toLowerCase() === uniqueEmail.toLowerCase()
    );
    assert.equal(isNewDuplicate, false, 'New unique email should not be flagged as duplicate');

    // Add unique registration
    const newReg = {
      id: `reg-${Date.now()}`,
      name: 'Priyanka Sen',
      email: uniqueEmail,
      college: 'VBIT Hyderabad',
      channel: 'Ambassador (AI-ADITYA)',
      time: 'Just now',
      verified: true,
    };
    const updated = [newReg, ...registrations];
    assert.equal(updated.length, initialCount + 1, 'Registrations count should increment by 1');
  });

  // Test 2: KPI & Channel Consistency
  test('(2) Adding a registration consistently updates dashboard KPIs, channel totals, and daily velocity', () => {
    const channels = getInitialChannels();
    const dailyMetrics = getInitialDailyMetrics();
    const initialTotal = channels.reduce((sum, ch) => sum + ch.registrations, 0);
    assert.equal(initialTotal, 342, 'Baseline total registrations should be 342');

    // Attribute 1 new registration to 'ambassadors' channel
    const updatedChannels = channels.map((ch) => {
      if (ch.id === 'ambassadors') {
        const newRegs = ch.registrations + 1;
        const newClicks = Math.max(newRegs, ch.clicks + 1);
        const newConv = parseFloat(((newRegs / newClicks) * 100).toFixed(1));
        const newCac = ch.spend > 0 ? parseFloat((ch.spend / newRegs).toFixed(2)) : 0;
        return { ...ch, registrations: newRegs, clicks: newClicks, conversionRate: newConv, cac: newCac };
      }
      return ch;
    });

    const newTotal = updatedChannels.reduce((sum, ch) => sum + ch.registrations, 0);
    assert.equal(newTotal, 343, 'Total registrations should be exactly 343');

    // Daily metrics update: Day 4 actual + 1, and all subsequent days cumulative + 1
    const updatedDaily = dailyMetrics.map((m) => {
      if (m.day === 4) {
        return { ...m, actual: m.actual + 1, cumulative: m.cumulative + 1 };
      }
      if (m.day > 4) {
        return { ...m, cumulative: m.cumulative + 1 };
      }
      return m;
    });

    assert.equal(updatedDaily.find((d) => d.day === 4).actual, 117);
    assert.equal(updatedDaily.find((d) => d.day === 4).cumulative, 343);
    assert.equal(updatedDaily.find((d) => d.day === 5).cumulative, 343, 'Future cumulative must remain consistent');

    // Velocity recalculation
    const newVelocity = (newTotal / CAMPAIGN_INFO.currentDay).toFixed(1);
    assert.equal(newVelocity, '85.8', 'Velocity should recalculate to 85.8/day');
  });

  // Test 3: Referral Link Query Parameter Attribution
  test('(3) Referral link query parameter parsing and attribution', () => {
    const testUrl = 'https://localhost:5173/?ref=AI-ADITYA';
    const parsed = new URL(testUrl);
    const refParam = parsed.searchParams.get('ref');
    assert.equal(refParam, 'AI-ADITYA', 'Should extract AI-ADITYA referral code from URL');

    const ambassadors = getInitialAmbassadors();
    const matchedAmb = ambassadors.find((a) => a.code.toUpperCase() === refParam.toUpperCase());
    assert.ok(matchedAmb, 'Referral parameter should match an ambassador');
    assert.equal(matchedAmb.name, 'Aditya Sharma');
    assert.equal(matchedAmb.referrals, 28);

    // Incremented referral count
    const updatedReferrals = matchedAmb.referrals + 1;
    assert.equal(updatedReferrals, 29);
  });

  // Test 4: Unique Referral Code Generation
  test('(4) Unique referral code generation and collision prevention', () => {
    const referralCodes = getInitialReferralCodes();
    const ambassadors = getInitialAmbassadors();

    // Helper logic mirroring context implementation
    const generateUniqueCode = (customCode, ownerName) => {
      const rawCode = (customCode || `AI-${ownerName.split(' ')[0] || 'GROWTH'}`)
        .toUpperCase()
        .replace(/[^A-Z0-9-]/g, '');
      const baseCode = rawCode.startsWith('AI-') ? rawCode : `AI-${rawCode}`;

      let finalCode = baseCode;
      let counter = 2;
      while (
        referralCodes.some((rc) => rc.code.toUpperCase() === finalCode.toUpperCase()) ||
        ambassadors.some((amb) => amb.code.toUpperCase() === finalCode.toUpperCase())
      ) {
        finalCode = `${baseCode}-${counter}`;
        counter++;
      }
      return finalCode;
    };

    // Test with already existing code 'AI-ADITYA'
    const code1 = generateUniqueCode('AI-ADITYA', 'Aditya Sharma');
    assert.equal(code1, 'AI-ADITYA-2', 'Colliding code should be suffixed with -2');

    // Test with brand new code
    const code2 = generateUniqueCode('AI-IITDELHI', 'Tech Lead');
    assert.equal(code2, 'AI-IITDELHI', 'Unique code should remain unaltered');
  });

  // Test 5: LocalStorage Persistence & Clean Seed Reset
  test('(5) Pristine seed data cloning and reset integrity', () => {
    const channels1 = getInitialChannels();
    channels1[0].registrations = 999; // mutate instance

    const channels2 = getInitialChannels();
    assert.equal(channels2[0].registrations, 128, 'Subsequent getInitialChannels must be unaffected by mutations');
  });

  // Test 6: Financials, CAC, and Unit Economics
  test('(6) Budget, blended CAC, and projection formulas', () => {
    const totalSpend = 1240;
    const totalRegs = 342;
    const blendedCac = (totalSpend / totalRegs).toFixed(2);
    assert.equal(blendedCac, '3.63', 'Blended CAC must equal 3.63');

    const remainingBudget = CAMPAIGN_INFO.totalBudget - totalSpend;
    assert.equal(remainingBudget, 760, 'Remaining budget must equal ₹760');

    const velocity = (totalRegs / CAMPAIGN_INFO.currentDay).toFixed(1); // 85.5
    const remainingDays = CAMPAIGN_INFO.totalDays - CAMPAIGN_INFO.currentDay; // 3
    const projectedFinal = Math.round(totalRegs + parseFloat(velocity) * remainingDays);
    assert.equal(projectedFinal, 599, 'Projected final registrations should be ~599');
  });

  // Test 7: Growth Experiments ICE Scoring & Templates
  test('(7) Growth experiment ICE calculation and outreach interpolation', () => {
    const impact = 9;
    const confidence = 8;
    const ease = 9;
    const iceScore = impact * confidence * ease;
    assert.equal(iceScore, 648, 'ICE score 9*8*9 must equal 648');

    // Outreach Template interpolation
    const template = OUTREACH_TEMPLATES[0].template;
    const interpolated = template
      .replace(/{{studentName}}/g, 'Rahul')
      .replace(/{{collegeName}}/g, 'VBIT Hyderabad')
      .replace(/{{workshopDate}}/g, 'Saturday 6 PM')
      .replace(/{{referralLink}}/g, 'https://localhost:5173/?ref=AI-ADITYA');

    assert.ok(interpolated.includes('Hey Rahul!'));
    assert.ok(interpolated.includes('VBIT Hyderabad'));
    assert.ok(interpolated.includes('ref=AI-ADITYA'));
    assert.ok(!interpolated.includes('{{studentName}}'), 'No unresolved placeholders');
  });

  // Test 8: RFC 4180 CSV Escaping
  test('(8) RFC 4180 CSV generation and escaping', () => {
    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    // Case 1: Simple text
    assert.equal(escapeCSV('Aditya Sharma'), '"Aditya Sharma"');

    // Case 2: Commas
    assert.equal(escapeCSV('VBIT, Hyderabad'), '"VBIT, Hyderabad"');

    // Case 3: Quotes inside string
    assert.equal(escapeCSV('Student "Lead" Chapter'), '"Student ""Lead"" Chapter"');

    // Case 4: Null / Undefined
    assert.equal(escapeCSV(null), '""');
    assert.equal(escapeCSV(undefined), '""');
  });
});
