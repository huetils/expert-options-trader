const axios = require('axios');
const puppeteer = require('puppeteer');

const trader = require('./trader');

(async () => {
  function getDebuggerUrl() {
    return axios
      .get('http://127.0.0.1:9222/json/version')
      .then((res) => {
        return res.data.webSocketDebuggerUrl;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const browser = await puppeteer.connect({
    browserWSEndpoint: await getDebuggerUrl(),
  });

  // const page = await browser.newPage();
  // let pageUrl = 'https://app.expertoption.com';

  // await page.goto(pageUrl, {
  //   waitUntil: 'networkidle0',
  // });

  const page = (await browser.pages())[0];
  const lockinPeriod = 1000;

  while (true) {
    const timeUntilLockin = async () => {
      const time = await page.evaluate(() => {
        return document
          .getElementsByClassName('settings-button time')[0]
          .outerText.split(':')[1];
      });
      return time;
    };

    const time = await timeUntilLockin();

    // Only run analyzer when there is at least 50 seconds left before lockin
    if (time < 50) {
      await new Promise((r) => setTimeout(r, time * 1000 + lockinPeriod));
      continue;
    }

    console.log('Anylyzing market sentiment...');

    await trader.analyzeSentiment(page);
  }
})();
