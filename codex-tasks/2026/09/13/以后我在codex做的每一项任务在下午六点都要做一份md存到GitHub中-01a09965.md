# 以后我在 Codex 做的每一项任务在下午六点都要做一份 MD 存到 GitHub 中

- **任务 ID：** `01a09965-acad-7703-bd3a-073f8c38c91f`
- **归档日期：** 2026-09-13
- **状态：** 已完成
- **自动化 ID：** `codex-github`

## 目标

每天 18:00 自动整理在 Codex 中处理的任务，为每项任务生成独立 Markdown 并保存到 GitHub，以便在不同电脑之间查看和延续工作。

## 完成内容

- 确认 Codex 内置 GitHub 插件已连接。
- 识别到唯一可访问仓库：`sylviajohnston69-sketch/notes-between-code-and-life`。
- 创建并启用每日自动化“每日 Codex 任务归档到 GitHub”。
- 设置为每天 18:00（Asia/Shanghai）执行。
- 首次运行检查过去 24 小时；后续检查自上次运行以来新增、更新或完成的任务。
- 每项任务单独生成中文 Markdown，并提交到 `main` 分支。
- 没有符合条件的任务时保持安静；仅在成功归档、失败或需要用户操作时通知。

## 关键决定

- 使用 Codex 的 GitHub 插件直接读写仓库，不依赖本机安装 GitHub CLI。
- 采用“自上次运行以来”的时间窗口，避免遗漏 18:00 之后产生的任务。
- 文件路径包含日期、任务标题和任务 ID 前八位，兼顾可读性与唯一性。
- 写入前检查同一路径；已存在时更新完整内容，避免重复文件。
- 明确过滤密码、访问令牌、API 密钥、Cookie 等敏感信息。

## 产物与文件

自动化写入路径：

`codex-tasks/YYYY/MM/DD/<安全化任务标题>-<任务ID前8位>.md`

目标仓库：

https://github.com/sylviajohnston69-sketch/notes-between-code-and-life

## 验证

- 自动化已创建，ID 为 `codex-github`。
- 状态确认为 `ACTIVE`。
- 调度规则确认为每天 18:00。
- GitHub 插件已成功读取目标仓库信息。
- 首次心跳已正常触发并执行归档流程。

## 未完成事项

- 无需用户操作。
