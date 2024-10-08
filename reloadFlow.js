const { getBrowserDetail } = require("./request")
const { goGame } = require("./blum")
const { getOpenBrowserPid, delay } = require("./utils")
const puppeteer = require("puppeteer")

main()

async function main() {
  // 获取实例
  const id = "4fc4df25f5db4df6b0c9a6ddeb7d1b30"
  const pid = await getOpenBrowserPid(id)
  console.log("🚀 ~ main ~ pid:", pid)
  if (pid) {
    try {
      const browserListStr = localStorage.getItem("browserList")
      if (browserListStr) {
        const browserList = JSON.parse(browserListStr)
        browserList.forEach(async (browser) => {
          const browserConnect = await puppeteer.connect({
            browserWSEndpoint: browser.browserWSEndpoint,
            defaultViewport: null
          })
          // 具体业务代码
          const pages = await browserConnect.pages()
          await delay(5000)
          await goGame("Blum", pages[0], browserConnect)
        })
      }
    } catch (err) {
      console.error(err)
    }
  }
}
