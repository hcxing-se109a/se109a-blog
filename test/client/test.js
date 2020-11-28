const puppeteer = require('puppeteer');
const clientURL = 'http://localhost:8080/';

(async () => {
  const browser = await puppeteer.launch({ ignoreDefaultArgs: true, headless: false });

  try {
    const page = await browser.newPage();

    // await page.setViewport({ width: 1024, height: 400 });
    await page.goto(`${clientURL}`, { timeout: 10000 });


    await page.type('#email', 'test123@gmail.com');
    await page.type('#password', '123');
    await page.click('.btn');

    await page.waitForNavigation();
    console.log('New Page URL:', page.url());

    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'example.png' });

  } catch (error) {
    console.error(error.message)
  } finally {
    await browser.close();

  }
})();