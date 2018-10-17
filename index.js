const fs = require('fs');
const puppeteer = require('puppeteer');

const root = 'https://facebook.com';

const [username, password, groupsPath, imagePath, contentPath] = process.argv.slice(2);
const groups = fs
  .readFileSync(groupsPath)
  .toString('utf-8')
  .trim()
  .split('\n');
const content = fs
  .readFileSync(contentPath)
  .toString('utf-8')
  .trim();

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--disable-notifications'] });
  const page = await browser.newPage();

  // LOGIN
  await page.goto(root, { waitUntil: 'domcontentloaded' });
  await page.type('#email', username);
  await page.type('#pass', password);
  await page.click('#loginbutton');
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

  // GROUPS
  for (let i = 0; i < groups.length; i++) {
    await page.goto(`${root}/groups/${groups[i]}/`, { waitUntil: 'load' });
    await page.type('textarea[name="xhpc_message_text"]', content);
    const input = await page.$('input[name="composer_photo[]"]');
    await input.uploadFile(imagePath);
    await page.waitFor(5000);
    let disabled = true;
    while (disabled)
      disabled = await page.$eval(
        'button[data-testid=react-composer-post-button]',
        button => button.disabled
      );
    await page.click('button[data-testid=react-composer-post-button]');
    await page.waitFor(5000);
  }

  // CLEANUP
  await browser.close();
})();
