import { remote } from 'webdriverio'

const agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'

export const wdio = async (url) => {
  const browser = await remote({
    capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: process.env.CI ? ['headless', 'disable-gpu', `user-agent=${agent}`] : 
            [`user-agent=${agent}`, 'no-sandbox', 'disable-dev-shm-usage']
        }
    }
  })

  await browser.url(url)

  await browser.execute(() => { Object.defineProperties(navigator,{ webdriver:{ get: () => false } }) })
  await browser.execute(() => { window.navigator.chrome = { runtime: {},  }; })
  await browser.execute(() => { Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] }); })
  await browser.execute(() => { Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5,6], }); })

  const elem = await browser.$('.layout-two-columns-main')
  await browser.waitUntil(async function () {
    return await elem.isExisting()
  }, {
    timeout: 50000,
    timeoutMsg: 'expected text to be different after 50s'
  })

  const detailData = await browser.execute(() => {
    return JSON.stringify(window.__INIT_DATA)
  })

  // const body = await browser.$('body')
  // const html = body.getHTML()

  await browser.deleteSession()

  return detailData;
}


// 移除前两个元素（node 命令和脚本路径）以获取真正的参数
const args = process.argv.slice(2);  
const html = await wdio(args[0])
console.log('wdio-result-start>>>', html, "<<<wdio-result-end")