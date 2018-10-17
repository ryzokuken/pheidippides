const puppeteer = require('puppeteer');

const username = process.argv[2];
const password = process.argv[3];

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('http://facebook.com/', { waitUntil: 'networkidle0' });

  await page.type('#email', username);
  await page.type('#pass', password);
  await page.click('#u_0_2');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  await browser.close();
})();
