const { delay } = require("./utils")
const { taskVerifyList } = require("./taskVerify")

let currentBrowser
let currentPage
let gameFrame

async function searchGame(name) {
  // 查询游戏名称，点击进入游戏chat
  await currentPage.type(".input-search-input", name, { delay: 120 })
  await delay(3000)
  // 查找所有游戏名称元素
  const searchDoms = await currentPage.$$(".peer-title-inner")

  // 遍历并点击匹配的游戏名称
  for (searchDom of searchDoms) {
    const innerText = await searchDom.evaluate((element) => element.innerText)
    if (innerText === name) {
      await searchDom.evaluate((b) => {
        const simulateMouseClick = (element) => {
          const mousedownEvent = new MouseEvent("mousedown", { bubbles: true })
          const mouseupEvent = new MouseEvent("mouseup", { bubbles: true })
          const clickEvent = new MouseEvent("click", { bubbles: true })
          element.dispatchEvent(mousedownEvent)
          element.dispatchEvent(mouseupEvent)
          element.dispatchEvent(clickEvent)
        }
        simulateMouseClick(b)
      })
      break // 找到后立即跳出循环，避免不必要的遍历
    }
  }
}

async function goGameChat(name) {
  await delay(3000)

  // 点击进入游戏聊天室
  const enterDom = await currentPage.$(".rows-wrapper .new-message-wrapper .new-message-bot-commands")
  if (enterDom) {
    await enterDom.click()
  }

  await delay(3000)

  if (await currentPage.$(".popup-buttons")) {
    // 点击 "Launch" 按钮
    const launchDialogText = await currentPage.$(".popup-buttons")
    const launchDialogTextChildren = launchDialogText.children[0]
    await launchDialogTextChildren.click()
  }
  await changeFrame()
}

async function changeFrame() {
  await delay(3000)
  await currentPage.waitForSelector("iframe")
  const frames = currentPage.frames()
  gameFrame = frames[1]
  await dailyContinue()
}

async function dailyContinue() {
  await delay(2000)
  const dailyContinueDom = await gameFrame.$(".kit-button.is-primary")
  if (dailyContinueDom) {
    await dailyContinueDom.click()
  }
  await goEarn()
}

async function goEarn() {
  await delay(3000)
  const secondTab = await gameFrame.$("div.layout-tabs.tabs a:nth-child(2)")
  await secondTab.click()
  await openCardTask()
}

async function openCardTask() {
  await delay(3000)
  // 点击任务卡片上的Open
  const earnCardOpenList = await gameFrame.$$(".pages-tasks-pill.is-status-not-started.is-dark")
  console.log("🚀 ~ openCardTask ~ earnCardOpenList:", earnCardOpenList)
  for (openButton of earnCardOpenList) {
    await openButton.click()
    const earnCardStartList = await gameFrame.$$(".nested-tasks>.pages-tasks-list-item-label .container .pill-btn")
    for (earnCardStart of earnCardStartList) {
      await earnCardStart.evaluate((b) => b.click())
      await delay(1000)
      // 出现弹窗，点击取消
      if (await currentPage.$(".popup-button+.popup-button")) {
        const cancelDialog = await currentPage.$(".popup-button+.popup-button")
        await cancelDialog.click()
      }
      // 跳转到其他页面去了
      if (currentPage.url().indexOf("https://web.telegram.org/") === -1) {
        // 切换回原来的页面
        currentPage.bringToFront()
      }
      // 打开了验证code
      if (await gameFrame.$(".pages-tasks-verify .heading .title")) {
        // 验证完毕返回
        await verifyTask()
        const miniBack = await currentPage.$(".btn-icon._BrowserHeaderButton_m63td_65")
        await miniBack.click()
      }
      await delay(5000)
      // 点击claim
      for (earnCardStart of earnCardStartList) {
        if (earnCardStart.innerText === "Claim") {
          await earnCardStart.evaluate((b) => b.click())
        }
      }
      await delay(2000)
      // 关闭open弹窗
      const cloneButton = await gameFrame.$(".kit-button .icon")
      if (cloneButton) {
        await cloneButton.click()
      }
    }
  }

  // 点击任务卡片上的Claim
  const earnCardClaimList = await gameFrame.$$(".footer >.pages-tasks-pill.is-status-ready-for-claim")
  for (claim of earnCardClaimList) {
    await claim.click()
  }
  await execTask()
}

// 列表日常任务
async function execTask() {
  await delay(1000)
  // 获取taskTabs
  const taskTabs = await gameFrame.$$(".kit-tab")
  for (taskTab of taskTabs) {
    await delay(5000)
    await taskTab.click()
    // 点击任务列表中start
    const taskList = await gameFrame.$$(".pages-tasks-list-item-label .container .pill-btn")
    for (task of taskList) {
      const taskInnerText = await task.evaluate((element) => element.innerText)
      if (taskInnerText === "Start") {
        await task.evaluate((b) => b.click())
        await delay(1000)
        // 出现弹窗，点击取消
        if (await currentPage.$(".popup-button+.popup-button")) {
          const cancelDialog = await currentPage.$(".popup-button+.popup-button")
          await cancelDialog.click()
        }
        // 跳转到其他页面去了
        if (currentPage.url().indexOf("https://web.telegram.org/") === -1) {
          // 切换回原来的页面
          await currentPage.bringToFront()
        }
      }
      if (taskInnerText === "Verify") {
        await task.evaluate((b) => b.click())
        await delay(1000)
        const verifyRes = await verifyTask()
        if (!verifyRes) {
          // 验证成功会自动关闭，失败手动关闭
          const miniBack = await currentPage.$(".btn-icon._BrowserHeaderButton_m63td_65")
          await miniBack.click()
        }
      }
    }
    await delay(5000)
    for (task of taskList) {
      const taskInnerText = await task.evaluate((element) => element.innerText)
      if (taskInnerText === "Claim") {
        await task.evaluate((b) => b.click())
      }
    }
  }
}

async function verifyTask() {
  const verifyTitleDom = await gameFrame.$(".pages-tasks-verify .heading>.title")
  const verifyTitle = await verifyTitleDom.evaluate((element) => element.innerText)
  const taskVerify = taskVerifyList.find((item) => item.title === verifyTitle)
  if (taskVerify) {
    const verifyTitleInputDom = await gameFrame.$(".kit-input.is-large input")
    if (verifyTitleInputDom) {
      await gameFrame.type(".kit-input.is-large input", taskVerify.answer, { delay: 120 })
      const verifyButton = await gameFrame.$(".kit-fixed-wrapper.no-layout-tabs>.kit-button.is-primary")
      if (verifyButton) {
        await verifyButton.click()
        await delay(1500)
        return verifyButton ? true : false
      }
    }
  }
}

async function goGame(name, page, browser) {
  currentPage = page
  currentBrowser = browser
  await searchGame(name)
  await goGameChat(name)
}

module.exports = {
  goGame,
  searchGame
}
