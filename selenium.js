const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const { openBrowser } = require('./request')
main()

async function main() {
  const openRes = await openBrowser({
    id: '86f4a5b5f2424e918c786a05a317cdeb',
    args: [],
    loadExtensions: false,
    extractIp: false
  })
  if (openRes.success) {
    let options = new chrome.Options()
    options.options_['debuggerAddress'] = openRes.data.http
    options.options_['prefs'] = { 'profile.default_content_setting_values': { images: 2 } }

    let driverPath = openRes.data.driver
    let service = new chrome.ServiceBuilder(driverPath).build()
    chrome.setDefaultService(service)

    let driver = new webdriver.Builder()
      .setChromeOptions(options)
      .withCapabilities(webdriver.Capabilities.chrome())
      .forBrowser('chrome')
      .build()

    await driver.get('https://www.baidu.com')
  }
}
