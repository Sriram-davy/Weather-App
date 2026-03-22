const { chromium } = require('playwright');

const cities = [
  'Dubai',        // Sunny / Clear
  'London',       // Often cloudy / rainy
  'Seattle',      // Often rainy
  'Moscow',       // Often snowy
  'Miami',        // Varied
  'San Francisco' // Foggy potentially
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  try {
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });
    console.log('Page loaded successfully');
    
    for (const city of cities) {
      console.log(`Testing city: ${city}`);
      await page.fill('#search-input', city);
      await page.click('#search-button');
      
      // Wait for weather card to appear or loading to finish
      await page.waitForTimeout(3000); // 3 seconds for API to return
      
      await page.screenshot({ path: `debug_${city}.png` });
      console.log(`Saved screenshot to debug_${city}.png`);
      
      // Reset
      const resetBtn = await page.$('#reset-button');
      if (resetBtn) {
        await resetBtn.click();
        await page.waitForTimeout(500);
      }
    }
    
  } catch (err) {
    console.error('Failed to load page:', err);
  } finally {
    await browser.close();
  }
})();
