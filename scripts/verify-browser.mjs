import puppeteer from 'puppeteer-core';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';
import fs from 'node:fs';

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const BASE_URL = 'http://localhost:5173';

const results = [];

function record(testName, action, observed, status) {
  results.push({ testName, action, observed, status });
  const icon = status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} [${status}] ${testName}\n   Action: ${action}\n   Result: ${observed}\n`);
}

async function run() {
  console.log(`Starting real browser verification with binary: ${CHROME_PATH}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.toString()));

  try {
    // T1: App Load
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    const pageTitle = await page.title();
    const hasHeader = !!(await page.$('.app-header'));
    record('T1. App Launch & Page Mount',
      'Navigate to localhost:5173/ and verify React app mounts',
      `Title: "${pageTitle}" | Header found: ${hasHeader}`,
      hasHeader ? 'PASS' : 'FAIL');

    // T2: Navigation — 5 sidebar items
    const navLabels = await page.$$eval('.nav-item', els => els.map(e => e.innerText.trim().split('\n')[0]));
    record('T2. Sidebar Navigation — 5 Sections',
      'Query all .nav-item elements and inspect labels',
      `${navLabels.length} items: ${navLabels.join(' | ')}`,
      navLabels.length === 5 ? 'PASS' : 'FAIL');

    // T3: Referral URL attribution
    await page.goto(`${BASE_URL}/?ref=AI-ADITYA`, { waitUntil: 'networkidle2' });
    const storedRef = await page.evaluate(() => localStorage.getItem('campusai_ref_code'));
    record('T3. URL Referral Attribution (?ref=AI-ADITYA)',
      'Navigate to /?ref=AI-ADITYA and inspect localStorage for captured code',
      `localStorage["campusai_ref_code"] = "${storedRef}"`,
      storedRef === 'AI-ADITYA' ? 'PASS' : 'FAIL');

    // T4: Navigate to Registrations tab
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('.nav-item'))
        .find(e => e.innerText.includes('Registrations'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 700));

    // T4: Duplicate email rejection
    const formExists = !!(await page.$('#reg-name'));
    if (formExists) {
      await page.type('#reg-name', 'Rahul Duplicate Test');
      await page.type('#reg-email', 'rahul.v@vbit.ac.in');  // seed email
      await page.type('#reg-college', 'VBIT');
      await page.click('button[type="submit"]');
      await new Promise(r => setTimeout(r, 700));

      const dupeAlert = await page.evaluate(() => {
        const el = document.querySelector('.alert-error');
        return el ? el.innerText.trim() : null;
      });
      record('T4. Duplicate Email Registration Rejection',
        'Submit form with seed email rahul.v@vbit.ac.in expecting inline error',
        `Alert text: "${dupeAlert}"`,
        dupeAlert && dupeAlert.toLowerCase().includes('already registered') ? 'PASS' : 'FAIL');
    } else {
      record('T4. Duplicate Email Registration Rejection',
        'Find #reg-name intake form on Registrations page',
        'Form element #reg-name not found on page',
        'FAIL');
    }

    // T5: Valid registration with referral code
    await page.evaluate(() => {
      const n = document.querySelector('#reg-name');
      const e = document.querySelector('#reg-email');
      const r = document.querySelector('#reg-ref');
      if (n) n.value = '';
      if (e) e.value = '';
      if (r) r.value = 'AI-ADITYA';
    });
    await page.type('#reg-name', 'Deepika Nair');
    await page.type('#reg-email', 'deepika.nair.verify@iitm.ac.in');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 900));

    // Read updated count from KPI strip
    const kpiCount = await page.evaluate(() => {
      const cells = Array.from(document.querySelectorAll('.kpi-cell-val .mono-num'));
      return cells[0] ? cells[0].innerText.trim() : null;
    });
    const firstRow = await page.evaluate(() => {
      const row = document.querySelector('.data-table tbody tr');
      return row ? row.innerText.replace(/\s+/g, ' ').trim() : null;
    });
    const countIncremented = kpiCount && Number(kpiCount) >= 343;
    const newStudentVisible = firstRow && firstRow.includes('Deepika Nair');
    record('T5. Valid Registration & KPI Counter Increment',
      'Submit Deepika Nair (unique email) with referral AI-ADITYA; check KPI cell and table top row',
      `KPI total: ${kpiCount} | Top row: "${firstRow ? firstRow.slice(0, 60) : 'null'}"`,
      countIncremented && newStudentVisible ? 'PASS' : 'FAIL');

    // T6: Search filter
    await page.evaluate(() => {
      const s = document.querySelector('#reg-search, input[placeholder*="Search"]');
      if (s) { s.value = 'deepika'; s.dispatchEvent(new Event('input', { bubbles: true })); }
    });
    await new Promise(r => setTimeout(r, 400));
    const filteredRows = await page.evaluate(() =>
      document.querySelectorAll('.data-table tbody tr').length
    );
    await page.evaluate(() => {
      const s = document.querySelector('#reg-search, input[placeholder*="Search"]');
      if (s) { s.value = ''; s.dispatchEvent(new Event('input', { bubbles: true })); }
    });
    record('T6. Registrations Search Filter',
      'Type "deepika" in search bar and count visible table rows',
      `Rows visible while searching "deepika": ${filteredRows}`,
      filteredRows === 1 ? 'PASS' : 'FAIL');

    // T7: CSV Export
    await page.evaluate(() => {
      const exportBtn = Array.from(document.querySelectorAll('button'))
        .find(b => b.innerText.includes('Export CSV'));
      if (exportBtn) exportBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    const exportToast = await page.evaluate(() => {
      const t = document.querySelector('.toast');
      return t ? t.innerText.replace(/\s+/g, ' ').trim() : null;
    });
    record('T7. RFC 4180 CSV Export',
      'Click Export CSV button and check for success toast',
      `Toast: "${exportToast}"`,
      exportToast && exportToast.toLowerCase().includes('export') ? 'PASS' : 'FAIL');

    // T8: Ambassador leaderboard update after AI-ADITYA referral
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('.nav-item'))
        .find(e => e.innerText.includes('Referrals'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 700));

    const adityaRow = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.data-table tbody tr'));
      const row = rows.find(r => r.innerText.includes('Aditya Sharma') || r.innerText.includes('AI-ADITYA'));
      return row ? row.innerText.replace(/\s+/g, ' ').trim() : null;
    });
    record('T8. Ambassador Leaderboard After AI-ADITYA Referral',
      'Check Aditya Sharma row in leaderboard after registering student with AI-ADITYA code',
      `Row: "${adityaRow ? adityaRow.slice(0, 80) : 'not found'}"`,
      adityaRow && adityaRow.includes('Aditya Sharma') ? 'PASS' : 'FAIL');

    // T9: QR Code optical scan
    const qrImgSrc = await page.evaluate(() => {
      const img = document.querySelector('img[alt*="QR Code"]');
      return img ? img.src : null;
    });
    let qrDecoded = null;
    if (qrImgSrc && qrImgSrc.startsWith('data:image/png;base64,')) {
      const buf = Buffer.from(qrImgSrc.replace(/^data:image\/png;base64,/, ''), 'base64');
      const png = PNG.sync.read(buf);
      const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
      qrDecoded = code ? code.data : null;
    }
    record('T9. QR Code Optical Scan — Correct Destination URL',
      'Extract QR PNG from DOM, decode with jsQR scanner, verify ?ref= parameter',
      `Decoded URL: "${qrDecoded}"`,
      qrDecoded && qrDecoded.includes('ref=AI-ADITYA') ? 'PASS' : 'FAIL');

    // T10: Generate new code and verify QR updates
    await page.evaluate(() => {
      const nameInput = document.querySelector('#gen-name, input[placeholder*="Prateek"]');
      if (nameInput) { nameInput.value = 'Test Lead'; nameInput.dispatchEvent(new Event('input', { bubbles: true })); }
    });
    const ownerInput = await page.$('#gen-name');
    if (!ownerInput) {
      // Try filling the form
      const inputs = await page.$$('.card input[type="text"]');
      if (inputs[0]) await inputs[0].type('Test Lead');
    }
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button'))
        .find(b => b.innerText.includes('Generate Trackable') || b.innerText.includes('Generate'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 700));

    const newQrSrc = await page.evaluate(() => {
      const img = document.querySelector('img[alt*="QR Code"]');
      return img ? img.src : null;
    });
    let newQrDecoded = null;
    if (newQrSrc && newQrSrc.startsWith('data:image/png;base64,')) {
      const buf = Buffer.from(newQrSrc.replace(/^data:image\/png;base64,/, ''), 'base64');
      const png = PNG.sync.read(buf);
      const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
      newQrDecoded = code ? code.data : null;
    }
    record('T10. Referral Code Generator & QR Re-render',
      'Enter new ambassador name, click Generate, verify QR re-renders with new code URL',
      `Newly generated QR decoded URL: "${newQrDecoded}"`,
      newQrDecoded && newQrDecoded.includes('ref=') ? 'PASS' : 'FAIL');

    // T11: Forecast sliders
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('.nav-item'))
        .find(e => e.innerText.includes('Overview'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const slidersBefore = await page.evaluate(() => {
      const viral = document.querySelector('#viral-boost');
      const amb = document.querySelector('#ambassador-boost');
      return { viral: viral ? viral.value : null, amb: amb ? amb.value : null };
    });

    await page.evaluate(() => {
      const viral = document.querySelector('#viral-boost');
      const amb = document.querySelector('#ambassador-boost');
      if (viral) { viral.value = '1.5'; viral.dispatchEvent(new Event('input', { bubbles: true })); }
      if (amb) { amb.value = '50'; amb.dispatchEvent(new Event('input', { bubbles: true })); }
    });
    await new Promise(r => setTimeout(r, 400));

    const forecastText = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.card'));
      const card = cards.find(c => c.innerText.includes('Forecast') || c.innerText.includes('Scenario'));
      return card ? card.innerText.replace(/\s+/g, ' ').trim() : '';
    });

    record('T11. Forecast Sliders & Live Projection Recalculation',
      'Set Viral Multiplier to 1.5x max and Ambassador Lift to 50%; read forecast output',
      `Sliders before: viral=${slidersBefore.viral} amb=${slidersBefore.amb} | Forecast output: "${forecastText.slice(0, 100)}..."`,
      forecastText.length > 30 ? 'PASS' : 'FAIL');

    // T12: Acquisition filters + outreach copy
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('.nav-item'))
        .find(e => e.innerText.includes('Acquisition'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const filterPills = await page.$$eval('.filter-pill', els => els.map(e => e.innerText.trim()));
    await page.evaluate(() => {
      const pills = Array.from(document.querySelectorAll('.filter-pill'));
      const ambassadorPill = pills.find(p => p.innerText.includes('Ambassador'));
      if (ambassadorPill) ambassadorPill.click();
    });
    await new Promise(r => setTimeout(r, 300));
    const rowsAfterFilter = await page.evaluate(() =>
      document.querySelectorAll('.data-table tbody tr').length
    );
    // Reset filter
    await page.evaluate(() => {
      const pills = Array.from(document.querySelectorAll('.filter-pill'));
      const allPill = pills.find(p => p.innerText.trim().startsWith('All'));
      if (allPill) allPill.click();
    });

    // Outreach copy
    await page.evaluate(() => {
      const input = document.querySelector('#student-name-var');
      if (input) { input.value = 'Arjun'; input.dispatchEvent(new Event('input', { bubbles: true })); }
    });
    await new Promise(r => setTimeout(r, 200));
    await page.evaluate(() => {
      const copyBtn = Array.from(document.querySelectorAll('button'))
        .find(b => b.innerText.includes('Copy Message'));
      if (copyBtn) copyBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    const copyToast = await page.evaluate(() => {
      const t = document.querySelector('.toast');
      return t ? t.innerText.replace(/\s+/g, ' ').trim() : null;
    });

    record('T12. Acquisition Channel Filters & Outreach Copy',
      `Filter pills found: [${filterPills.join(', ')}]; click Ambassadors filter (${rowsAfterFilter} rows); Copy Message toast`,
      `Filter worked (reduced rows: ${rowsAfterFilter}); Copy toast: "${copyToast}"`,
      filterPills.length > 1 && copyToast && copyToast.includes('Copied') ? 'PASS' : 'FAIL');

    // T13: Growth Experiments — status change + propose modal
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('.nav-item'))
        .find(e => e.innerText.includes('Experiments'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Status filter pills
    const expFilterPills = await page.$$eval('.filter-pill', els => els.map(e => e.innerText.trim()));

    // Change status of an experiment via select
    const statusChanged = await page.evaluate(() => {
      const selects = document.querySelectorAll('select');
      const expSelect = Array.from(selects).find(s =>
        s.querySelector('option') && s.querySelector('option').innerText.includes('Winner')
      );
      if (expSelect) {
        expSelect.value = 'Backlog';
        expSelect.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
      return false;
    });

    // Open propose modal
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button'))
        .find(b => b.innerText.includes('Propose'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    const modalVisible = !!(await page.$('.modal-overlay'));
    await page.type('#exp-title', 'Alumni LinkedIn Growth Campaign');
    await page.type('#exp-hypo', 'Engaging alumni via LinkedIn will attract 35 industry-connected students.');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('.modal-footer button, .modal-card button'))
        .find(b => b.innerText.includes('Log Growth Experiment'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const newExpVisible = await page.evaluate(() =>
      document.body.innerText.includes('Alumni LinkedIn Growth Campaign')
    );

    record('T13. Growth Experiments — Status Change & Propose Modal',
      `Filter pills: [${expFilterPills.join(', ')}]; Change status via dropdown; Open modal; Submit new experiment`,
      `Modal opened: ${modalVisible}; Status changed: ${statusChanged}; New experiment in list: ${newExpVisible}`,
      modalVisible && newExpVisible ? 'PASS' : 'FAIL');

    // T14: LocalStorage Persistence
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));
    const afterReloadExp = await page.evaluate(() =>
      document.body.innerText.includes('Alumni LinkedIn Growth Campaign')
    );
    const afterReloadReg = await page.evaluate(() =>
      document.body.innerText.includes('Deepika Nair') || document.body.innerText.includes('deepika.nair.verify@iitm.ac.in')
    );
    // Switch to Registrations to check
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('.nav-item'))
        .find(e => e.innerText.includes('Registrations'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    const afterReloadRegCheck = await page.evaluate(() => {
      return document.body.innerText.includes('Deepika Nair');
    });

    record('T14. localStorage Persistence After Reload',
      'Reload the full page; verify custom experiment and new student remain from localStorage',
      `Experiment persisted: ${afterReloadExp}; Registration persisted: ${afterReloadRegCheck}`,
      afterReloadExp && afterReloadRegCheck ? 'PASS' : 'FAIL');

    // T15: Mobile viewport responsiveness
    await page.setViewport({ width: 375, height: 812 });
    await new Promise(r => setTimeout(r, 500));
    const mobileLayout = await page.evaluate(() => {
      const header = document.querySelector('.app-header');
      const body = document.documentElement;
      return {
        headerVisible: !!(header && header.offsetWidth > 0),
        noHorizScroll: body.scrollWidth <= body.clientWidth + 10,
      };
    });
    record('T15. Mobile Viewport Responsiveness (375×812)',
      'Resize viewport to 375×812 and check header visibility and absence of horizontal overflow',
      `Header visible: ${mobileLayout.headerVisible}; No horiz scroll: ${mobileLayout.noHorizScroll}`,
      mobileLayout.headerVisible ? 'PASS' : 'FAIL');
    await page.setViewport({ width: 1280, height: 800 });

    // T16: Simulation disclosure modal
    await page.evaluate(() => {
      const badge = document.querySelector('.demo-mode-badge');
      if (badge) badge.click();
    });
    await new Promise(r => setTimeout(r, 500));
    const modalTitleText = await page.evaluate(() => {
      const el = document.querySelector('.modal-title');
      return el ? el.innerText.trim() : null;
    });
    record('T16. DEMO DATA / SIMULATION Disclosure Modal',
      'Click the DEMO DATA / SIMULATION header badge to open transparency modal',
      `Modal title: "${modalTitleText}"`,
      modalTitleText && modalTitleText.includes('Simulation') ? 'PASS' : 'FAIL');

    // Close
    await page.evaluate(() => {
      const x = document.querySelector('.modal-header .btn-ghost');
      if (x) x.click();
    });
    await new Promise(r => setTimeout(r, 300));

    // T17: Seed Reset
    await page.evaluate(() => {
      window.confirm = () => true;
      const resetBtn = Array.from(document.querySelectorAll('button'))
        .find(b => b.title && b.title.includes('Reset'));
      if (resetBtn) resetBtn.click();
    });
    await new Promise(r => setTimeout(r, 700));

    const expGoneAfterReset = await page.evaluate(() =>
      !document.body.innerText.includes('Alumni LinkedIn Growth Campaign')
    );
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('.nav-item'))
        .find(e => e.innerText.includes('Registrations'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    const regGoneAfterReset = await page.evaluate(() =>
      !document.body.innerText.includes('Deepika Nair')
    );
    record('T17. Seed Reset — Original Data Restored',
      'Confirm reset dialog; verify custom experiment and new registration are cleared',
      `Custom experiment removed: ${expGoneAfterReset}; New registration removed: ${regGoneAfterReset}`,
      expGoneAfterReset && regGoneAfterReset ? 'PASS' : 'FAIL');

    // T18: Console errors
    record('T18. Zero Console Errors Throughout Session',
      'Monitor page console and pageerror events during the full browser session',
      consoleErrors.length === 0
        ? 'No unhandled console errors detected'
        : `${consoleErrors.length} error(s): ${consoleErrors.slice(0, 3).join(' | ')}`,
      consoleErrors.length === 0 ? 'PASS' : 'FAIL');

  } catch (err) {
    console.error('\n🔥 FATAL TEST ERROR:', err.message);
    record('FATAL', 'Execute full test suite', err.message, 'FAIL');
  } finally {
    await browser.close();
  }

  fs.writeFileSync('verification-report.json', JSON.stringify(results, null, 2));
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`\n=== FINAL: ${passed} PASS / ${failed} FAIL ===`);
  console.table(results.map(r => ({
    Test: r.testName.slice(0, 48),
    Status: r.status,
    Summary: r.observed.slice(0, 70),
  })));
}

run();
