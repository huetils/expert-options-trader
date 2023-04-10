const pptr = require('puppeteer-core');
(async () => {
  const browser = await pptr.launch({
    executablePath: '/mnt/c/Program Files (x86)/Microsoft/Edge/Application'
  });
  const putPercent = await page.evaluate('document.getElementsByClassName("tc-percents put-percent")')
  console.log(putPercent)
})();
