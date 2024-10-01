const { getPids } = require("./request")

const delay = (time) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

// 获取当前浏览器窗口的pid
const getOpenBrowserPid = async (browserId) => {
  try {
    const res = await getPids([browserId])
    if (res.success) {
      return res.data[browserId]
    }
  } catch (err) {
    console.log("判断窗口是否激活失败", err)
  }
}

module.exports = {
  delay,
  getOpenBrowserPid
}