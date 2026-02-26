const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 1. Verify New TestCase page
  await page.goto('http://localhost:4200/test-cases/create');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-case-create.png', fullPage: true });
  console.log('Saved test-case-create.png');

  // 2. Verify Edit TestCase page
  await page.goto('http://localhost:4200/test-cases/edit/1');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-case-edit.png', fullPage: true });
  console.log('Saved test-case-edit.png');

  // 3. Verify Navigation from Test Suite Form
  await page.goto('http://localhost:4200/test-suites/create');
  await page.waitForTimeout(1000);
  await page.click('button:has-text("Add TestCases")');
  await page.waitForTimeout(1000);
  const url = page.url();
  console.log('Navigated URL after clicking Add TestCases:', url);
  if (url.includes('/test-cases/create')) {
    console.log('Navigation successful!');
  } else {
    console.log('Navigation failed!');
  }

  await browser.close();
})();
