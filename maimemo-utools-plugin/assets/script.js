class MaimemoPlugin {
  constructor() {
    this.initializeTheme();
    this.initializeUI();
    this.loadSettings();
    this.bindEvents();
    
    // 更新主题图标状态
    setTimeout(() => {
      this.updateThemeIcons();
    }, 100);
  }

  initializeTheme() {
    // 先尝试加载保存的主题设置
    this.loadTheme();
    
    // 如果没有保存的主题设置，默认使用暗色主题
    if (!this.manualThemeSet) {
      document.documentElement.classList.add('dark-theme');
      this.updateThemeIcons();
      // 保存默认的暗色主题设置
      this.saveTheme('dark');
    }
  }

  toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark-theme');
    
    if (isDark) {
      document.documentElement.classList.remove('dark-theme');
      this.showToast('已切换到亮色模式', 'info');
      this.saveTheme('light');
    } else {
      document.documentElement.classList.add('dark-theme');
      this.showToast('已切换到暗色模式', 'info');
      this.saveTheme('dark');
    }
    
    this.manualThemeSet = true;
    this.updateThemeIcons();
  }

  loadTheme() {
    this.manualThemeSet = false;
    if (window.utools) {
      try {
        const themeData = utools.db.get('maimemo_theme');
        if (themeData && themeData.data) {
          this.manualThemeSet = true;
          // 清除默认主题
          document.documentElement.classList.remove('dark-theme');
          if (themeData.data === 'dark') {
            document.documentElement.classList.add('dark-theme');
          }
          this.updateThemeIcons();
        }
      } catch (error) {
        console.error('Load theme error:', error);
      }
    }
  }

  saveTheme(theme) {
    if (window.utools) {
      try {
        const themeDoc = {
          _id: 'maimemo_theme',
          data: theme
        };
        const existing = utools.db.get('maimemo_theme');
        if (existing) {
          themeDoc._rev = existing._rev;
        }
        utools.db.put(themeDoc);
      } catch (error) {
        console.error('Save theme error:', error);
      }
    }
  }
  
  updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark-theme');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (sunIcon && moonIcon) {
      if (isDark) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
  }

  initializeUI() {
    // 创建主界面
    document.body.innerHTML = `
      <div class="container">
        <button class="theme-toggle" id="themeToggle" title="切换主题">
          <span class="theme-icon">
            <svg viewBox="0 0 24 24" class="sun-icon">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg viewBox="0 0 24 24" class="moon-icon" style="display: none;">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </span>
        </button>
        <div class="header">
          <h1 id="titleClick" class="clickable-title" title="点击查看使用说明">墨墨云词本</h1>
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
      
      <!-- 使用说明弹窗 -->
      <div id="helpModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>墨墨云词本使用说明</h2>
            <span class="close" id="closeModal">&times;</span>
          </div>
          <div class="modal-body">
            <div class="help-section">
              <h3>📋 功能介绍</h3>
              <p>墨墨云词本是一个uTools插件，帮助您快速将单词添加到墨墨背单词的云词本中。</p>
            </div>
            
            <div class="help-section">
              <h3>🔧 设置步骤</h3>
              <ol>
                <li><strong>获取API Token：</strong>
                  <ul>
                    <li>打开墨墨背单词APP</li>
                    <li>进入「我的」→「更多设置」→「实验功能」→「开放API」→ 点击查看获取 API token</li>
                    <li>复制您的API Token</li>
                  </ul>
                </li>
                <li><strong>配置插件：</strong>
                  <ul>
                    <li>将API Token粘贴到「墨墨开放API Token」输入框</li>
                    <li>云词本ID可选填，留空将自动创建新词本，不知道云词本ID建议留空自动生成，生成的云词本ID会自动保存（建议备份）</li>
                    <li>点击「保存设置」</li>
                  </ul>
                </li>
              </ol>
            </div>
            
            <div class="help-section">
              <h3>📝 使用方法</h3>
              <ol>
                <li>在单词输入框中输入要添加的单词</li>
                <li>支持两种格式：
                  <ul>
                    <li>每行一个单词</li>
                    <li>用逗号分隔多个单词</li>
                  </ul>
                </li>
                <li>点击「添加到云词本」按钮</li>
                <li>等待添加完成，查看结果反馈</li>
                <li>支持剪切板识别，呼出超级面板，一键上传</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  loadSettings() {
    // 加载主题设置
    this.loadTheme();
    
    // 从uTools数据库加载设置
    if (window.utools) {
      try {
        const tokenData = utools.db.get('maimemo_token');
        const notepadData = utools.db.get('maimemo_notepad_id_setting');
        const cachedNotepadData = utools.db.get('maimemo_notepad_id');
        
        if (tokenData && tokenData.data) {
          document.getElementById('token').value = tokenData.data;
          maimemoAPI.setToken(tokenData.data);
        }
        
        // 优先使用用户手动设置的云词本ID，其次使用自动创建的
        if (notepadData && notepadData.data) {
          document.getElementById('notepadId').value = notepadData.data;
          maimemoAPI.setNotepadId(notepadData.data);
        } else if (cachedNotepadData && cachedNotepadData.data) {
          document.getElementById('notepadId').value = cachedNotepadData.data;
          maimemoAPI.setNotepadId(cachedNotepadData.data);
        }
      } catch (error) {
        console.error('Load settings error:', error);
      }
    }
  }

  bindEvents() {
    // 主题切换
    document.getElementById('themeToggle').addEventListener('click', () => {
      this.toggleTheme();
    });

    // 保存设置
    document.getElementById('saveSettings').addEventListener('click', () => {
      this.saveSettings();
    });

    // 添加单词
    document.getElementById('addWords').addEventListener('click', () => {
      this.addWords();
    });

    // 自动聚焦到第一个空的输入框
    this.autoFocusFirstEmptyInput();

    // 切换token显示
    document.getElementById('toggleToken').addEventListener('click', () => {
      this.toggleTokenVisibility();
    });

    // 标题点击显示帮助弹窗
    document.getElementById('titleClick').addEventListener('click', () => {
      this.showHelpModal();
    });

    // 关闭弹窗
    document.getElementById('closeModal').addEventListener('click', () => {
      this.hideHelpModal();
    });

    // 点击弹窗外部关闭
    document.getElementById('helpModal').addEventListener('click', (e) => {
      if (e.target.id === 'helpModal') {
        this.hideHelpModal();
      }
    });

    // ESC键关闭弹窗
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideHelpModal();
      }
    });

    // 监听uTools输入
    if (window.utools) {
      utools.onPluginEnter(({ code, payload }) => {
        if (code === 'maimemo_add_word' && payload && payload !== '墨墨云词本') {
          document.getElementById('words').value = payload;
        } else if (code === 'maimemo_clipboard' && payload) {
          const words = this.parseWords(payload);
          if (words.length > 0) {
            document.getElementById('words').value = words.join('\n');
            this.showResult(`从剪切板检测到 ${words.length} 个单词`, 'info');
            // 自动添加到云词本
            setTimeout(() => this.addWords(), 1000);
          } else {
            this.showResult('剪切板内容不包含有效的英文单词', 'error');
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
        utools.db.put(tokenDoc);
        
        if (notepadId) {
          const existingNotepad = utools.db.get('maimemo_notepad_id_setting');
          const notepadDoc = {
            _id: 'maimemo_notepad_id_setting',
            data: notepadId
          };
          if (existingNotepad && existingNotepad._rev) {
            notepadDoc._rev = existingNotepad._rev;
          }
          utools.db.put(notepadDoc);
          // 如果用户手动设置了云词本ID，清除自动创建的缓存
          utools.db.remove('maimemo_notepad_id');
        } else {
          // 如果用户清空了云词本ID，也清除手动设置的记录
          utools.db.remove('maimemo_notepad_id_setting');
        }
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
      }, 1500);
      
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

  showToast(message, type = 'info') {
    // 移除现有的toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.classList.add('hide');
      setTimeout(() => {
        if (existingToast.parentNode) {
          existingToast.remove();
        }
      }, 300);
    }
    
    // 创建新的toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // 创建图标元素
    const icon = document.createElement('div');
    icon.className = 'toast-icon';
    
    // 创建内容元素
    const content = document.createElement('div');
    content.className = 'toast-content';
    content.textContent = message;
    
    // 组装toast结构
    toast.appendChild(icon);
    toast.appendChild(content);
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);
    
    // 根据消息类型设置不同的隐藏时间
    const hideTime = type === 'error' ? 2000 : 1000;
    
    // 添加鼠标悬停暂停功能
    let hideTimer;
    let progressPaused = false;
    
    const startHideTimer = () => {
      hideTimer = setTimeout(() => {
        if (!progressPaused) {
          this.hideToast(toast);
        }
      }, hideTime);
    };
    
    // 鼠标悬停时暂停隐藏
    toast.addEventListener('mouseenter', () => {
      progressPaused = true;
      clearTimeout(hideTimer);
    });
    
    // 鼠标离开时继续隐藏
    toast.addEventListener('mouseleave', () => {
      progressPaused = false;
      // 重新开始较短的隐藏计时
      startHideTimer();
    });
    
    // 点击关闭
    toast.addEventListener('click', () => {
      clearTimeout(hideTimer);
      this.hideToast(toast);
    });
    
    // 开始隐藏计时
    startHideTimer();
  }
  
  hideToast(toast) {
    if (toast && toast.parentNode) {
      toast.classList.remove('show');
      toast.classList.add('hide');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }
  }
  
  // 兼容旧的showResult方法
  showResult(message, type) {
    this.showToast(message, type);
  }

  showHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) {
      modal.style.display = 'block';
      // 添加动画效果
      setTimeout(() => {
        modal.classList.add('show');
      }, 10);
    }
  }

  hideHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
  }

  autoFocusFirstEmptyInput() {
    // 延迟执行以确保DOM完全加载
    setTimeout(() => {
      const inputs = [
        document.getElementById('token'),
        document.getElementById('notepadId'),
        document.getElementById('words')
      ];
      
      for (const input of inputs) {
        if (input && !input.value.trim()) {
          input.focus();
          break;
        }
      }
    }, 200);
  }
}

// 初始化插件
document.addEventListener('DOMContentLoaded', () => {
  new MaimemoPlugin();
});