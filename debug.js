const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  try {
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });
    console.log('Page loaded successfully');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'browser_debug.png' });
    console.log('Saved screenshot to browser_debug.png');
  } catch (err) {
    console.error('Failed to load page:', err);
  } finally {
    await browser.close();
  }
})();
