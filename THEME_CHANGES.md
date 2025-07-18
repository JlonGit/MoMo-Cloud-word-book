# 主题配色调整说明

## 更改概述
为了使插件界面与utools主程序的标题栏保持视觉一致性，避免色彩冲突和突兀感，已将插件的主题背景色调整为与utools保持一致的配色方案。

## 具体更改

### 1. 亮色主题背景色调整
- **主背景色**: `#ffffff` → `#f4f4f4` (与utools亮色主题保持一致)
- **次背景色**: `#fafbfc` → `#ffffff` (提供更好的层次感)
- **三级背景色**: 保持 `#f1f3f5` (无需调整)

### 2. 暗色主题背景色调整
- **主背景色**: `#0f1419` → `#303133` (与utools暗色主题保持一致)
- **次背景色**: `#1a1f29` → `#3a3c3f` (提供更好的层次感和对比度)
- **三级背景色**: 保持 `#252a35` (无需调整)

### 3. 暗色主题文字对比度优化
- **主文字色**: `#f7fafc` → `#ffffff` (提高对比度和可读性)
- **次文字色**: `#a0aec0` → `#b8c5d1` (在新背景色上更清晰)
- **弱化文字色**: `#718096` → `#8a9ba8` (保持适当的层次感)

### 4. 暗色主题边框颜色优化
- **边框色**: `#2d3748` → `#4a5568` (在新背景色上更协调)

### 5. Toast弹窗优化
- **信息类弹窗背景**: 透明度从 `0.15` 降低到 `0.08` (颜色更柔和)
- **信息类弹窗边框**: 透明度从 `0.3` 降低到 `0.2` (减少突兀感)
- **内边距**: 从 `0.5rem 0.875rem` 调整为 `0.5rem 0.625rem` (更紧凑)

## 设计原则

### 视觉一致性
- 确保插件界面与utools主程序在视觉上保持统一
- 避免色彩冲突，提供无缝的用户体验

### 平滑过渡
- 所有颜色变化都通过CSS变量实现
- 主题切换时具有平滑的过渡效果 (`transition: var(--transition)`)

### 可读性保证
- 优化文字与背景的对比度
- 确保在新的背景色上所有文字都清晰可读
- 保持适当的视觉层次

### 用户体验
- Toast弹窗颜色更柔和，减少视觉干扰
- 更紧凑的弹窗设计，减少不必要的空间占用
- 保持界面的简洁和纯净感

## 技术实现
- 使用CSS自定义属性 (CSS Variables) 实现主题系统
- 通过 `.dark-theme` 类切换暗色主题
- 所有颜色变化都具有平滑的过渡动画
- 兼容现有的主题切换逻辑

## 兼容性
- 保持与现有功能的完全兼容
- 不影响插件的核心功能
- 支持用户手动切换主题
- 记住用户的主题偏好设置
