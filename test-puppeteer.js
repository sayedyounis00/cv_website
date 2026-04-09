const puppeteer = require('puppeteer');
(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.on('pageerror', err => {
      console.log('Page error:', err.toString());
    });
    page.on('console', msg => {
      console.log('Console:', msg.text());
    });
    await page.goto('file:///home/sir/Desktop/herr-ibrahim-alassal/cv_website/index.html', { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 1000));
    const previewLength = await page.evaluate(() => {
      return document.getElementById('cv-preview').innerHTML.length;
    });
    console.log('cv-preview length:', previewLength);
    await browser.close();
  } catch (e) {
    console.error('Puppeteer Script Error:', e);
  }
})();
