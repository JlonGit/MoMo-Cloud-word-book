// uTools 预加载脚本
// 在这里可以进行一些初始化操作

// 当插件装载成功，uTools将会主动调用这个方法
window.exports = {
  "maimemo_add_word": {
    mode: "list",
    args: {
      // 进入插件时的回调
      enter: (action, callbackSetList) => {
        // 可以在这里处理一些逻辑
        console.log('进入墨墨云词本插件');
      },
      // 搜索时的回调
      search: (action, searchWord, callbackSetList) => {
        // 可以在这里处理搜索逻辑
        console.log('搜索:', searchWord);
      },
      // 选择时的回调
      select: (action, itemData, callbackSetList) => {
        // 处理选择逻辑
        window.utools.hideMainWindow();
      }
    }
  }
};