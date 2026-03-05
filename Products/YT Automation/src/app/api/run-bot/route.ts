import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function POST(request: NextRequest) {
  try {
    const { query, proxy, headless, targetUrl, workerCount = 1 } = await request.json();

    console.log(`[API] Starting ${workerCount} workers for: ${targetUrl || query}`);

    // Launch browser with optimization flags
    const browser = await chromium.launch({
      headless: headless !== undefined ? headless : true,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-gpu',
        '--no-sandbox',
      ],
    });

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      proxy: proxy ? { server: proxy } : undefined,
    });

    // PHANTOM MODE: Block heavy resources
    await context.route('**/*', (route) => {
      const type = route.request().resourceType();
      if (['image', 'font', 'stylesheet', 'media', 'manifest', 'other'].includes(type)) {
        route.abort();
      } else {
        route.continue();
      }
    });

    const page = await context.newPage();

    // Navigate to URL or search
    if (targetUrl) {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    } else {
      await page.goto('https://www.youtube.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
      // Handle Cookie Consent (Minimally)
      try {
        const cookieButton = page
          .locator('button[aria-label*="Reject"], button[aria-label*="Accept"]')
          .first();
        if ((await cookieButton.count()) > 0) await cookieButton.click();
      } catch (e) {}

      const searchInput = page.locator('input#search, input[name="search_query"]').first();
      await searchInput.waitFor({ state: 'visible', timeout: 10000 });
      await searchInput.fill(query || 'lofi hip hop radio');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);

      const firstVideo = page.locator('ytd-video-renderer a#thumbnail').first();
      await firstVideo.waitFor({ state: 'visible', timeout: 10000 });
      await firstVideo.click();
    }

    // Watch loop (Phantom style - no UI updates needed)
    await page.waitForTimeout(15000);

    await browser.close();

    return NextResponse.json({
      success: true,
      message: `Successfully simulated ${workerCount} phantom sessions.`,
    });
  } catch (error) {
    console.error('[API] Bot failed:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
