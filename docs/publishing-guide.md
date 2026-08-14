# 匿名博客新手发布指南

这份指南适合第一次维护本博客的人。请按顺序操作：先把文章保存为草稿并在本地检查，确认匿名信息清理完成后，再公开并推送到 GitHub。也可以使用 Pages CMS 在网页中完成同样的写作流程。

## 一、准备本地环境

1. 安装 [Node.js](https://nodejs.org/) 20 或更高版本。安装后打开终端，运行：

   ```bash
   node --version
   ```

   成功时会看到 `v20.x.x` 或更高版本号。

2. 安装 pnpm：

   ```bash
   npm install --global pnpm
   ```

   成功时命令结束且没有 `ERR!`。再确认版本：

   ```bash
   pnpm --version
   ```

   成功时会显示 pnpm 版本号。

3. 在终端进入本仓库根目录，然后安装依赖：

   ```bash
   pnpm install
   ```

   成功时会看到依赖安装摘要，命令以退出码 0 结束，并生成或复用 `node_modules/`。

4. 启动开发服务器：

   ```bash
   pnpm dev
   ```

   成功时终端会显示 `Local http://localhost:4321/`。保持这个终端窗口运行，浏览器打开 <http://localhost:4321/> 即可预览。

## 二、在本地写一篇文章

1. 先复制一篇已有文章作为模板。在 Windows PowerShell 中运行：

   ```powershell
   Copy-Item src/content/blog/confusion-is-not-failure.md src/content/blog/my-new-post.md
   ```

   成功时命令不会报错，`src/content/blog/` 中会出现 `my-new-post.md`。文件名只使用小写英文字母、数字和连字符，并把命令中的文件名改成与你文章相符的名字。

2. 打开新文件，修改 frontmatter（文件开头两条 `---` 之间的内容）和正文。`slug` 应与文件名一致且不能与已有文章重复。写作阶段务必保持：

   ```yaml
   draft: true
   ```

   保存后，运行中的开发服务器会自动刷新。草稿不会出现在公开列表、搜索索引或文章地址中，这是正常且成功的结果。

3. 在 <http://localhost:4321/> 检查网站整体样式。因为草稿不可公开访问，如需逐字预览，可暂时在本地把 `draft` 改为 `false`，检查完成后立即改回 `true`，并且不要在草稿公开状态下提交或推送。

4. 完成下方“匿名发布检查表”。尤其要逐张打开文章图片，检查画面内容和元数据。

5. 运行隐私检查：

   ```bash
   pnpm privacy:check
   ```

   成功时会显示图片元数据检查通过，命令以退出码 0 结束；若报告文件名或敏感字段，先处理对应图片再继续。

6. 确认文章可以公开后，把 frontmatter 改为：

   ```yaml
   draft: false
   ```

7. 生成正式站点：

   ```bash
   pnpm build
   ```

   成功时隐私检查通过、Astro check 显示 `0 errors`，构建结束后生成 `dist/`。若出现错误，不要推送，先根据终端给出的文件与行号修正。

8. 检查本次将要提交的文件：

   ```bash
   git status --short
   ```

   成功时只应列出你打算发布的 Markdown、图片或配置文件；`.astro/`、`dist/`、`node_modules/` 不应出现。

9. 将文章加入提交（把示例文件名换成你的文件名）：

   ```bash
   git add src/content/blog/my-new-post.md
   ```

   成功时命令没有报错。

10. 创建提交：

    ```bash
    git commit -m "post: publish my new post"
    ```

    成功时会显示新的提交编号和改动文件数量。

11. 推送当前分支：

    ```bash
    git push
    ```

    成功时会看到远端分支已更新。连接到该 GitHub 仓库的 Vercel 项目会自动开始一次新构建。

## 三、使用 Pages CMS 在网页中写作

1. 访问 <https://app.pagescms.org>。
2. 使用专门用于匿名写作的 GitHub 账号登录，不要使用会暴露真实姓名、头像或单位的账号。
3. 首次使用时安装 Pages CMS GitHub App。授权范围选择 **Only select repositories**，只勾选这个博客仓库，不要授予其他仓库权限。
4. 进入博客仓库，在左侧选择 `posts`。
5. 创建文章，填写标题、slug、日期、摘要、栏目、标签、正文等字段。写作和检查阶段保持“草稿”开启，也就是 `draft: true`。
6. 使用 CMS 的预览功能逐段检查文字和图片。确认图片没有用户名、文件路径、通知、标签页账号、公司内部信息或可识别位置。
7. 完成“匿名发布检查表”后，关闭“草稿”，使其变为 `draft: false`，再保存。

Pages CMS 的“保存”不是只保存在浏览器中：它会修改 GitHub 仓库里的 Markdown 或图片文件并创建提交。GitHub 更新后，Vercel 会自动触发新构建。保存后请到 GitHub 确认变更内容，并到 Vercel 确认部署成功；如果匿名检查尚未完成，就不要关闭草稿。

## 四、匿名发布检查表

每次公开文章前逐项勾选；任何一项不确定，都应继续保持 `draft: true`。

- [ ] 正文没有真实姓名、单位、住址或可识别的精确时间地点组合
- [ ] 截图没有用户名、文件路径、通知、标签页账号或公司内部信息
- [ ] `pnpm privacy:check` 已通过
- [ ] Git 提交邮箱是 GitHub 提供的匿名 noreply 邮箱
- [ ] 关于页没有私人邮箱、社交账号或简历式经历
- [ ] 预览地址上的手机和桌面页面均检查完毕

检查当前仓库的提交邮箱：

```bash
git config user.email
```

成功时应显示 GitHub 设置页提供的 noreply 地址，例如 `12345678+username@users.noreply.github.com`。如果不是，先只为本仓库设置正确地址：

```bash
git config user.email "12345678+username@users.noreply.github.com"
```

成功时命令没有输出；再次运行查询命令应显示新地址。请把示例地址替换为你自己的 GitHub noreply 地址。

## 五、在 Vercel 配置生产站点地址

`astro.config.mjs` 会读取 `SITE_URL` 环境变量；本地未设置时使用 `http://localhost:4321`。生产环境必须配置真实域名，否则 canonical 链接和 sitemap 会错误地指向本地地址。

1. 打开 Vercel 项目的 **Overview** 页面，在 **Production Deployment** 卡片复制生产域名的完整地址。
2. 打开 **Settings → Environment Variables**，新建名为 `SITE_URL` 的变量。
3. 环境选择 **Production**，值粘贴完整的 `https://` 地址，例如 `https://example.com`，然后保存。
4. 回到部署页面，对生产部署执行 **Redeploy**。成功时部署状态会变为 **Ready**。
5. 打开生产站点任一页面并查看页面源代码，搜索 `rel="canonical"`；其地址应以刚设置的域名开头。
6. 打开 `https://你的域名/sitemap-index.xml`；成功时能看到 sitemap，且其中网址使用同一个生产域名。

如需在本地模拟生产地址，PowerShell 可运行：

```powershell
$env:SITE_URL='https://example.com'; pnpm build
```

成功时构建完成，生成文件中的 canonical 和 sitemap 使用 `https://example.com`。这个设置只影响当前 PowerShell 会话，不要把真实域名硬编码进 `astro.config.mjs`。

## 六、发布前完整本地验证

先运行全部自动测试，再构建：

```bash
pnpm test
```

成功时 Vitest 显示所有测试文件和测试用例均通过，没有失败用例。

```bash
pnpm build
```

成功时 `pnpm privacy:check` 通过、Astro check 为 `0 errors`，并生成 `dist/`。

然后启动正式构建的本地预览：

```bash
pnpm preview
```

成功时终端显示本地预览地址（通常是 `http://localhost:4321/`）。在浏览器中逐项检查：

- 首页只有两篇公开文章，草稿标题不出现。
- 两篇公开文章的标题链接均能打开。
- 归档页能打开且只列出公开文章。
- 三个栏目入口均可访问。
- 标签入口可访问。
- 搜索“报错”返回技术文章；搜索一个随机不存在的词显示“没有找到相关文章”。
- 关于页可访问，且不包含可识别个人身份的信息。
- 随机不存在的地址（如 `/this-page-does-not-exist/`）显示 404 页面。
- 直接访问草稿地址 `/posts/private-draft/` 显示 404。

分别在浏览器开发者工具中使用 `1440 × 900` 和 `390 × 844` 视口检查：页面没有整体横向溢出；导航可点击；正文行宽舒适；代码块可在自身内部横向滚动；移动端侧栏位于文章列表下方。完成两种尺寸检查后，再勾选匿名检查表的最后一项。
