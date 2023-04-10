async function analyzeSentiment(page) {
  let put = [];
  let call = [];

  // Collect the overall sentiment in the last 30 seconds
  for (sentiment_change = 1; sentiment_change < 31; sentiment_change++) {
    const percent = await page.evaluate(() => {
      return [
        document.getElementsByClassName('tc-percents put-percent')[0].innerText,
        document.getElementsByClassName('tc-percents call-percent')[0]
          .innerText,
      ];
    });

    put.push(parseInt(percent[0].replace('%', '')));
    call.push(parseInt(percent[1].replace('%', '')));

    await new Promise((r) => setTimeout(r, 1000));
  }

  put_sentiment = (
    put.reduce((pre, curr) => pre + curr, 0) / put.length
  ).toFixed(2);
  call_sentiment = (
    call.reduce((pre, curr) => pre + curr, 0) / call.length
  ).toFixed(2);

  console.log(`call: ${call_sentiment} / put: ${put_sentiment}`);

  // check if there are currently no opened deals
  // const noDeals = await page.evaluate(() => {
  //   if (document.getElementsByClassName('deal-open-item').length !== 0) {
  //     return true;
  //   }
  //   return false;
  // });
  await placeTrade(page);
}

async function placeTrade(page) {
  let dealSet = false;

  // Only place a deal when the market sentiment is at least 60%
  if (!dealSet && call_sentiment >= 65) {
    dealSet = true;

    await page.evaluate(() => {
      document.getElementsByClassName('deal-button call')[0].click();
    });
    console.log('Call order placed!\n');
  }

  if (!dealSet && put_sentiment >= 65) {
    dealSet = true;

    await page.evaluate(() => {
      document
        .getElementsByClassName('deal-button deal-button--left put')[0]
        .click();
    });
    console.log('Put order placed!\n');
  }
}

const _analyzeSentiment = analyzeSentiment;
export { _analyzeSentiment as analyzeSentiment };
