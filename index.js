/**
 * @description nodejs dmeo，仅作为demo使用，连接浏览器后，任何业务请直接查询 puppeteer 或 selenium 文档
 * @description 中文文档：https://doc2.bitbrowser.cn/jiekou/ben-di-fu-wu-zhi-nan.html
 * @description 英文文档：https://doc.bitbrowser.net/api-docs/introduction
 * */

const { openBrowser, closeBrowser, createBrowser, deleteBrowser, getBrowserDetail, addGroup, editGroup, deleteGroup, getGroupDetail, getGroupList, getBrowserList, getPids, updatepartial, updateBrowserMemark, deleteBatchBrowser, getBrowserConciseList, getAlivePids, getAliveBrowsersPids, batchUpdateBrowserGroup, closeBrowsersBySeqs, batchUpdateProxy, runRPA } = require("./request")
const { delay, getOpenBrowserPid } = require("./utils")
const { goGame } = require('./blum')
const puppeteer = require("puppeteer")

// 主程序
main()

async function main() {
  const id = "4fc4df25f5db4df6b0c9a6ddeb7d1b30"
  await openBrowserAndConnect(id)
}

async function openBrowserAndConnect(id) {
  try {
    // 打开窗口
    const res = await openBrowser({
      id,
      args: [],
      loadExtensions: false,
      extractIp: false
    })
    console.log("🚀 ~ main ~ res:", res)

    // 判断是否打开成功，打开成功则连接浏览器
    if (res.success) {
      await connect(res, id)
    } else {
      console.error("浏览器打开失败")
    }
  } catch (err) {
    console.error(err)
  }
}

async function connect(res, id) {
  let wsEndpoint = res.data.ws
  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
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

