import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--no-sandbox']
});
const page = await browser.newPage();

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 500));

// Navigate to Registrations
await page.evaluate(() => {
  const btn = Array.from(document.querySelectorAll('.nav-item')).find(e => e.innerText.includes('Registrations'));
  if (btn) btn.click();
});
await new Promise(r => setTimeout(r, 700));

// Fill all required fields
await page.type('#reg-name', 'Persist Test Student');
await page.type('#reg-email', 'persist.test.unique@iitm.ac.in');
await page.type('#reg-college', 'IIT Madras');
await page.click('button[type="submit"]');
await new Promise(r => setTimeout(r, 1500)); // extra wait for async state + useEffect

const regsBefore = await page.evaluate(() => {
  const data = localStorage.getItem('campusai_growth_registrations');
  if (!data) return 'key missing';
  const arr = JSON.parse(data);
  return arr[0]?.name || 'no name';
});
console.log('Top registration in localStorage before reload:', regsBefore);

await page.reload({ waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 700));

// Navigate back to Registrations
await page.evaluate(() => {
  const btn = Array.from(document.querySelectorAll('.nav-item')).find(e => e.innerText.includes('Registrations'));
  if (btn) btn.click();
});
await new Promise(r => setTimeout(r, 600));

const foundAfterReload = await page.evaluate(() => document.body.innerText.includes('Persist Test Student'));
console.log('Student visible after reload:', foundAfterReload);

await browser.close();

