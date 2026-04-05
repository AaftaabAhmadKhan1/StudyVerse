const { chromium } = require('playwright');
require('dotenv').config();

(async () => {
  let browser;
  try {
    console.log('[INFO] Launching browser...');
    browser = await chromium.launch({
      headless: false,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    // Create a context with a realistic user agent
    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 },
    });
                     
    const page = await context.newPage();

    console.log('[INFO] Navigating to YouTube...');
    await page.goto('https://www.youtube.com', { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Handle Cookie Consent Multi-Selector
    try {
      const selectors = [
        'button[aria-label*="Reject"]',
        'button[aria-label*="Accept"]',
        'button:has-text("Reject all")',
        'button:has-text("Accept all")',
        'ytd-button-renderer.style-primary:has-text("Accept")',
        '#content > div.body.style-scope.ytd-consent-bump-v2-renderer > div.footer.style-scope.ytd-consent-bump-v2-renderer > ytd-button-renderer.style-primary.style-size-default.style-scope.ytd-consent-bump-v2-renderer > yt-button-shape > button',
      ];

      for (const selector of selectors) {
        const btn = page.locator(selector);
        if ((await btn.count()) > 0 && (await btn.isVisible())) {
          console.log(`[INFO] Clicking cookie button: ${selector}`);
          await btn.click();
          await page.waitForTimeout(3000);
          break;
        }
      }
    } catch (e) {
      console.log('[DEBUG] Cookie handling skipped.');
    }

    console.log('[INFO] Searching for video...');
    // Try multiple possible search input selectors
    const searchSelectors = [
      'input#search',
      'input[name="search_query"]',
      'input[placeholder="Search"]',
    ];
    let searchFound = false;
    for (const selector of searchSelectors) {
      const input = page.locator(selector);
      if ((await input.count()) > 0) {
        await input.waitFor({ state: 'visible', timeout: 5000 });
        await input.fill('lofi hip hop radio');
        await page.keyboard.press('Enter');
        searchFound = true;
        break;
      }
    }

    if (!searchFound) {
      throw new Error('Could not find search input field.');
    }

    console.log('[INFO] Waiting for search results to load...');
    await page.waitForTimeout(5000);

    console.log('[INFO] Looking for the first video...');
    // Robust video selectors
    const videoSelectors = [
      'ytd-video-renderer a#thumbnail',
      'ytd-grid-video-renderer a#thumbnail',
      '#video-title',
      'ytd-item-section-renderer ytd-video-renderer a',
    ];

    let videoClicked = false;
    for (const selector of videoSelectors) {
      const video = page.locator(selector).first();
      if ((await video.count()) > 0) {
        console.log(`[INFO] Found video with selector: ${selector}`);
        await video.waitFor({ state: 'visible', timeout: 5000 });
        await video.click();
        videoClicked = true;
        break;
      }
    }

    if (!videoClicked) {
      throw new Error('Could not find a video to click.');
    }

    console.log('[INFO] Success! Video playing...');
    await page.waitForTimeout(30000); // watch 30s

    console.log('[INFO] Task complete. Closing browser.');
  } catch (error) {
    console.error('[ERROR] Bot execution failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
