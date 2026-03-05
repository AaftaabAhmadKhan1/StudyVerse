const { chromium } = require('playwright');
require('dotenv').config();

// Configuration from environment variables
const TARGET_URL = process.env.TARGET_URL || 'https://www.youtube.com';
const THREADS = parseInt(process.env.THREADS || '1');
const PROXY = process.env.PROXY || null;

async function runWorker(id) {
  console.log(`[Worker ${id}] Starting...`);
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--js-flags="--max-old-space-size=256"',
      ],
    });

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      proxy: PROXY ? { server: PROXY } : undefined,
    });

    // PHANTOM MODE: Aggressive Blocking
    await context.route('**/*', (route) => {
      const type = route.request().resourceType();
      if (['image', 'font', 'stylesheet', 'media', 'manifest', 'other'].includes(type)) {
        route.abort();
      } else {
        route.continue();
      }
    });

    const page = await context.newPage();
    console.log(`[Worker ${id}] Navigating to ${TARGET_URL}`);

    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });

    // Stay on page to maintain the "view"
    console.log(`[Worker ${id}] Connection established. Maintaining session...`);
    await page.waitForTimeout(3600000); // 1 hour session
  } catch (error) {
    console.error(`[Worker ${id}] Error:`, error.message);
  } finally {
    if (browser) await browser.close();
    // Restart on failure
    setTimeout(() => runWorker(id), 5000);
  }
}

// Start mandated number of threads
console.log(`[ORCHESTRATOR] Scaling to ${THREADS} threads...`);
for (let i = 0; i < THREADS; i++) {
  runWorker(i);
}
