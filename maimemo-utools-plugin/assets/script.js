class MaimemoPlugin {
  constructor() {
    this.initializeUI();
    this.loadSettings();
    this.bindEvents();
  }

  initializeUI() {
    // 创建主界面
    document.body.innerHTML = `
      <div class="container">
        <div class="header">
          <h1>墨墨云词本</h1>
          <p>快速添加单词到墨墨背单词</p>
        </div>
        
        <div class="settings-section">
          <div class="form-group">
            <label for="token">墨墨开放API Token:</label>
            <div class="input-with-toggle">
              <input type="password" id="token" placeholder="请输入墨墨开放API Token">
              <button type="button" id="toggleToken" class="toggle-btn" title="切换显示/隐藏">
                <span class="eye-icon">👁</span>
              </button>
            </div>
            <small>获取方式: <a href="https://open.maimemo.com/" target="_blank">https://open.maimemo.com/</a></small>
          </div>
          
          <div class="form-group">
            <label for="notepadId">云词本ID (可选):</label>
            <input type="text" id="notepadId" placeholder="留空将自动创建新词本">
          </div>
          
          <button id="saveSettings" class="btn btn-primary">保存设置</button>
        </div>
        
        <div class="word-section">
          <div class="form-group">
            <label for="words">单词 (每行一个或用逗号分隔):</label>
            <textarea id="words" rows="5" placeholder="输入要添加的单词...\n例如:\nhello\nworld\n或: hello, world"></textarea>
          </div>
          
          <button id="addWords" class="btn btn-success">添加到云词本</button>
        </div>
        
        <div id="result" class="result"></div>
      </div>
    `;
  }

  loadSettings() {
    // 从uTools数据库加载设置
    if (window.utools) {
      try {
        const tokenData = utools.db.get('maimemo_token');
        const notepadData = utools.db.get('maimemo_notepad_id_setting');
        const cachedNotepadData = utools.db.get('maimemo_notepad_id');
        
        console.log('Loading settings...');
         console.log('Token data:', tokenData);
         console.log('Token data type:', typeof tokenData);
         console.log('Token data keys:', tokenData ? Object.keys(tokenData) : 'null');
         console.log('Token data.data:', tokenData ? tokenData.data : 'undefined');
         console.log('Notepad data:', notepadData);
         console.log('Cached notepad data:', cachedNotepadData);
         
         if (tokenData && tokenData.data) {
           document.getElementById('token').value = tokenData.data;
           maimemoAPI.setToken(tokenData.data);
           console.log('Token loaded successfully:', tokenData.data);
         } else {
           console.log('No token found in database. TokenData:', tokenData);
         }
        
        // 优先使用用户手动设置的云词本ID，其次使用自动创建的
        if (notepadData && notepadData.data) {
          document.getElementById('notepadId').value = notepadData.data;
          maimemoAPI.setNotepadId(notepadData.data);
          console.log('Manual notepad ID loaded:', notepadData.data);
        } else if (cachedNotepadData && cachedNotepadData.data) {
          document.getElementById('notepadId').value = cachedNotepadData.data;
          maimemoAPI.setNotepadId(cachedNotepadData.data);
          console.log('Cached notepad ID loaded:', cachedNotepadData.data);
        } else {
          console.log('No notepad ID found');
        }
      } catch (error) {
        console.error('Load settings error:', error);
      }
    } else {
      console.warn('uTools API not available during load');
    }
  }

  bindEvents() {
    // 保存设置
    document.getElementById('saveSettings').addEventListener('click', () => {
      this.saveSettings();
    });

    // 添加单词
    document.getElementById('addWords').addEventListener('click', () => {
      this.addWords();
    });

    // 切换token显示
    document.getElementById('toggleToken').addEventListener('click', () => {
      this.toggleTokenVisibility();
    });

    // 监听uTools输入
    if (window.utools) {
      utools.onPluginEnter(({ code, type, payload }) => {
        if (code === 'maimemo_add_word' && payload) {
          // 只有当payload不是触发关键词时才设置为输入值
          if (payload !== 'maimemo' && payload !== '墨墨') {
            document.getElementById('words').value = payload;
          }
        }
      });
    }
  }

  toggleTokenVisibility() {
    const tokenInput = document.getElementById('token');
    const toggleBtn = document.getElementById('toggleToken');
    const eyeIcon = toggleBtn.querySelector('.eye-icon');
    
    if (tokenInput.type === 'password') {
      tokenInput.type = 'text';
      eyeIcon.textContent = '🙈';
      toggleBtn.title = '隐藏token';
    } else {
      tokenInput.type = 'password';
      eyeIcon.textContent = '👁';
      toggleBtn.title = '显示token';
    }
  }

  saveSettings() {
    const token = document.getElementById('token').value.trim();
    const notepadId = document.getElementById('notepadId').value.trim();
    
    if (!token) {
      this.showResult('请输入墨墨开放API Token', 'error');
      return;
    }

    try {
      // 保存到uTools数据库
      if (window.utools) {
        // 保存token
        const existingToken = utools.db.get('maimemo_token');
        const tokenDoc = {
          _id: 'maimemo_token',
          data: token
        };
        if (existingToken && existingToken._rev) {
          tokenDoc._rev = existingToken._rev;
        }
        const tokenResult = utools.db.put(tokenDoc);
        console.log('Token save result:', tokenResult);
        
        if (notepadId) {
          const existingNotepad = utools.db.get('maimemo_notepad_id_setting');
          const notepadDoc = {
            _id: 'maimemo_notepad_id_setting',
            data: notepadId
          };
          if (existingNotepad && existingNotepad._rev) {
            notepadDoc._rev = existingNotepad._rev;
          }
          const notepadResult = utools.db.put(notepadDoc);
          console.log('Notepad ID save result:', notepadResult);
          // 如果用户手动设置了云词本ID，清除自动创建的缓存
          utools.db.remove('maimemo_notepad_id');
        } else {
          // 如果用户清空了云词本ID，也清除手动设置的记录
          utools.db.remove('maimemo_notepad_id_setting');
        }
        
        // 验证保存是否成功
          const savedToken = utools.db.get('maimemo_token');
          console.log('Saved token verification:', savedToken);
          console.log('Saved token type:', typeof savedToken);
          console.log('Saved token keys:', savedToken ? Object.keys(savedToken) : 'null');
          console.log('Saved token data property:', savedToken ? savedToken.data : 'undefined');
          console.log('Saved token stringified:', JSON.stringify(savedToken));
          
          if (!savedToken || !savedToken.data) {
            throw new Error('Token保存失败');
          }
          console.log('Token save operation completed successfully');
      } else {
        console.warn('uTools API not available');
      }

      // 设置API配置
      maimemoAPI.setToken(token);
      if (notepadId) {
        maimemoAPI.setNotepadId(notepadId);
      } else {
        maimemoAPI.setNotepadId(null);
      }

      this.showResult('设置保存成功', 'success');
    } catch (error) {
      console.error('Save settings error:', error);
      this.showResult(`保存失败: ${error.message}`, 'error');
    }
  }

  async addWords() {
    const wordsText = document.getElementById('words').value.trim();
    
    if (!wordsText) {
      this.showResult('请输入要添加的单词', 'error');
      return;
    }

    // 解析单词
    const words = this.parseWords(wordsText);
    
    if (words.length === 0) {
      this.showResult('未检测到有效单词', 'error');
      return;
    }

    try {
      this.showResult('正在添加单词...', 'info');
      const result = await maimemoAPI.addWords(words);
      this.showResult(result, 'success');
      
      // 如果自动创建了新的云词本，更新界面显示
      if (maimemoAPI.notepadId && !document.getElementById('notepadId').value) {
        document.getElementById('notepadId').value = maimemoAPI.notepadId;
      }
      
      // 清空输入框
      document.getElementById('words').value = '';
      
      // 3秒后关闭uTools
      setTimeout(() => {
        if (window.utools) {
          utools.hideMainWindow();
        }
      }, 3000);
      
    } catch (error) {
      this.showResult(error.message, 'error');
    }
  }

  parseWords(text) {
    // 支持换行分隔和逗号分隔
    const words = text
      .split(/[\n,]/) // 按换行或逗号分割
      .map(word => word.trim()) // 去除空格
      .filter(word => word && /^[a-zA-Z\s]+$/.test(word)) // 只保留英文单词
      .filter(word => word.split(/\s+/).length <= 3); // 限制单词长度
    
    return [...new Set(words)]; // 去重
  }

  showResult(message, type) {
    const resultDiv = document.getElementById('result');
    resultDiv.className = `result ${type}`;
    resultDiv.textContent = message;
    resultDiv.style.display = 'block';
    
    // 3秒后隐藏结果
    setTimeout(() => {
      resultDiv.style.display = 'none';
    }, 3000);
  }
}

// 初始化插件
document.addEventListener('DOMContentLoaded', () => {
  new MaimemoPlugin();
});