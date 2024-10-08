const { getBrowserDetail } = require("./request")
const { goGame } = require("./blum")
const { getOpenBrowserPid, delay } = require("./utils")
const puppeteer = require("puppeteer")
const { browserList } = require("./browser")

main()

async function main() {
  try {
    browserList.forEach(async (browser) => {
      // 获取实例
      const pid = await getOpenBrowserPid(browser.id)
      if (pid) {
        const browserConnect = await puppeteer.connect({
          browserWSEndpoint: browser.browserWSEndpoint,
          defaultViewport: null
        })
        // 具体业务代码
        const pages = await browserConnect.pages()
        const page = pages.find((page) => page.url().indexOf("https://web.telegram.org/") !== -1)
        await delay(5000)
        await goGame("Blum", page, browserConnect)
      }
    })
  } catch (err) {
    console.error(err)
  }
}
