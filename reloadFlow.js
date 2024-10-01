const { getBrowserDetail } = require("./request")
const { goGame } = require("./blum");
const { getOpenBrowserPid, delay } = require("./utils")
const puppeteer = require("puppeteer")

main()

async function main() {
  // 获取实例
  const id = "4fc4df25f5db4df6b0c9a6ddeb7d1b30"
  const pid = await getOpenBrowserPid(id);
  console.log("🚀 ~ main ~ pid:", pid)
  if (pid) {
    try {
      const browser = await puppeteer.connect({
        browserWSEndpoint: `ws://127.0.0.1:60185/devtools/browser/72aa28fc-9fda-4cc8-8dcf-2cae126e2664`,
        defaultViewport: null
      })
      // 具体业务代码
      const pages = await browser.pages()
      await delay(5000)
      await goGame('Blum', pages[0])
    } catch (err) {
      console.error(err)
    }
  }
}