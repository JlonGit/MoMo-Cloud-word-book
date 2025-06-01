# 墨墨云词本 uTools 插件

一个用于快速添加单词到墨墨背单词云词本的 uTools 插件。

## 功能特性

- 🚀 快速添加单词到墨墨背单词云词本
- 📝 支持批量添加（换行或逗号分隔）
- 🔄 自动创建或更新云词本
- 💾 本地缓存配置信息
- 🎯 支持 uTools 关键词快速调用

## 安装使用

### 1. 获取墨墨开放API Token

1. 访问 [墨墨开放平台](https://open.maimemo.com/)
2. 注册并登录账号
3. 创建应用获取 API Token

### 2. 安装插件

1. 下载插件文件
2. 在 uTools 中按 `Ctrl + ,` 打开设置
3. 选择「插件应用」→「开发者」→「安装本地插件」
4. 选择插件目录进行安装

### 3. 配置插件

1. 在 uTools 中输入 `墨墨` 或 `maimemo` 打开插件
2. 输入墨墨开放API Token
3. （可选）输入云词本ID，留空将自动创建
4. 点击「保存设置」

## 使用方法

### 方法一：直接使用

1. 在 uTools 中输入 `墨墨` 打开插件
2. 在文本框中输入要添加的单词
3. 点击「添加到云词本」

### 方法二：快速添加

1. 选中任意英文单词
2. 呼出 uTools（通常是 `Alt + Space`）
3. 输入 `墨墨` 或直接按回车
4. 插件会自动识别选中的单词并添加

## 支持的输入格式

```
# 换行分隔
hello
world
apple

# 逗号分隔
hello, world, apple

# 混合格式
hello, world
apple
```

## 项目结构

```
maimemo-utools-plugin/
├── plugin.json          # 插件配置文件
├── index.html           # 主界面
├── preload.js          # 预加载脚本
├── assets/
│   ├── script.js       # 主要逻辑
│   └── style.css       # 样式文件
├── lib/
│   └── maimemo-api.js  # 墨墨API封装
└── README.md           # 说明文档
```

## API 说明

插件使用墨墨背单词开放API，主要接口：

- `POST /notepads` - 创建云词本
- `GET /notepads/{id}` - 获取云词本详情
- `POST /notepads/{id}` - 更新云词本内容

## 开发说明

### 本地开发

1. 克隆项目到本地
2. 在 uTools 中安装本地插件
3. 修改代码后重新加载插件

### 核心文件说明

- `plugin.json`: uTools 插件配置，定义插件信息和功能
- `preload.js`: uTools 预加载脚本，处理插件生命周期
- `lib/maimemo-api.js`: 墨墨API封装类，处理与墨墨服务器的交互
- `assets/script.js`: 主要业务逻辑，UI交互和数据处理

## 注意事项

1. 需要有效的墨墨开放API Token
2. 仅支持添加英文单词
3. 单词会按日期分组添加到云词本
4. 插件会自动去重和过滤无效输入

## 许可证

MIT License

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基本的单词添加功能
- 支持批量添加和自动创建云词本