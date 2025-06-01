// uTools 预加载脚本
window.exports = {
  "maimemo_add_word": {
    mode: "list",
    args: {
      enter: (action, callbackSetList) => {
        console.log('进入墨墨云词本插件');
      },
      search: (action, searchWord, callbackSetList) => {
        console.log('搜索:', searchWord);
      },
      select: (action, itemData, callbackSetList) => {
        window.utools.hideMainWindow();
      }
    }
  },
  "maimemo_clipboard": {
    mode: "none",
    args: {
      enter: (action) => {
        console.log('从剪切板添加单词:', action.payload);
        window.utools.showMainWindow();
      }
    }
  }
};