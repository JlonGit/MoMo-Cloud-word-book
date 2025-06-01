class MaimemoAPI {
  constructor() {
    this.apiEndpoint = 'https://open.maimemo.com/open/api/v1';
    this.token = null;
    this.notepadId = null;
  }

  setToken(token) {
    if (!token) {
      this.token = null;
      return;
    }
    this.token = token.startsWith('Bearer') ? token : `Bearer ${token}`;
  }

  setNotepadId(notepadId) {
    this.notepadId = notepadId;
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': this.token
    };
  }

  async createNotepad(words) {
    const todayDate = new Date().toLocaleDateString('en-CA');
    
    try {
      const response = await fetch(`${this.apiEndpoint}/notepads`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          notepad: {
            status: 'PUBLISHED',
            content: `# ${todayDate}\n${words.join('\n')}\n`,
            title: 'uTools Plugin',
            brief: 'uTools 插件录入词汇',
            tags: ['词典']
          }
        })
      });

      const data = await response.json();
      
      if (data.success && data.data?.notepad) {
        this.notepadId = data.data.notepad.id;
        if (window.utools) {
          utools.db.put({
            _id: 'maimemo_notepad_id',
            data: this.notepadId
          });
        }
        return `云词本创建成功，单词 ${words.join(', ')} 已添加`;
      } else {
        throw new Error('创建云词本失败');
      }
    } catch (error) {
      throw new Error(`创建云词本失败: ${error.message}`);
    }
  }

  async addWordsToNotepad(notepadId, words) {
    const todayDate = new Date().toLocaleDateString('en-CA');
    
    try {
      // 获取现有云词本内容
      const getResponse = await fetch(`${this.apiEndpoint}/notepads/${notepadId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const getData = await getResponse.json();
      
      if (!getData.success || !getData.data?.notepad) {
        throw new Error('未找到云词本');
      }

      const { status, content, title, brief, tags } = getData.data.notepad;
      const lines = content.split('\n').map(line => line.trim());
      
      let targetLineIndex = lines.findIndex(line => 
        line.startsWith(`# ${todayDate}`)
      );

      if (targetLineIndex === -1) {
        lines.unshift('');
        lines.unshift(`# ${todayDate}`);
        targetLineIndex = 0;
      }
      
      lines.splice(targetLineIndex + 1, 0, ...words);

      const updateResponse = await fetch(`${this.apiEndpoint}/notepads/${notepadId}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          notepad: {
            status,
            content: lines.join('\n'),
            title,
            brief,
            tags
          }
        })
      });

      const updateData = await updateResponse.json();
      
      if (updateData.success) {
        return `单词 ${words.join(', ')} 已添加到云词本`;
      } else {
        throw new Error('添加单词到云词本失败');
      }
    } catch (error) {
      throw new Error(`添加单词失败: ${error.message}`);
    }
  }

  async addWords(words) {
    if (!this.token) {
      throw new Error('请先配置墨墨开放API Token');
    }

    if (!this.notepadId && window.utools) {
      const cached = utools.db.get('maimemo_notepad_id');
      if (cached) {
        this.notepadId = cached.data;
      }
    }

    if (this.notepadId) {
      return await this.addWordsToNotepad(this.notepadId, words);
    } else {
      return await this.createNotepad(words);
    }
  }
}

window.maimemoAPI = new MaimemoAPI();