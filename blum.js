let currentPage;

async function searchGame(name) {
  await currentPage.type(".input-search-input", name, { delay: 120 })
}

async function goGameChat(name) {
  // 查询游戏名称，点击进入游戏chat
  await currentPage.evaluate((name) => {
    function triggerMouseEvents(element) {
      ['mousedown', 'mouseup', 'click'].forEach(eventType => {
          const mouseEvent = new MouseEvent(eventType, {
              view: window,
              bubbles: true,
              cancelable: true,
              buttons: 1
          });
          element.dispatchEvent(mouseEvent);
      });
    }

    const searchDoc = document.getElementsByClassName("peer-title-inner");
    Object.keys(searchDoc).forEach((i) => {
      if (searchDoc[i].innerHTML === name) {
        triggerMouseEvents(searchDoc[i]);
      }
    });

    const enterDom = document.querySelector(".rows-wrapper .new-message-wrapper .new-message-bot-commands")
    console.log("🚀 ~ awaitcurrentPage.evaluate ~ enterDom:", enterDom)
    triggerMouseEvents(enterDom)
  }, name);
}

async function goGame(name, page) {
  currentPage = page;
  await searchGame(name)
  goGameChat(name)
}

module.exports = {
  goGame,
  searchGame,
  goGameChat
}