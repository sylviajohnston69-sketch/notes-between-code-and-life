# 在代码与生活之间

一个默认保护草稿、面向匿名写作的 Astro 静态博客。公开文章来自 `src/content/blog/`，草稿不会出现在首页、归档、栏目、标签、搜索索引或文章路由中。

## 本地启动

需要 Node.js 20 或更高版本，以及 pnpm。

```bash
pnpm install
```

成功时会完成依赖安装，并生成或复用 `node_modules/`。

```bash
pnpm dev
```

终端出现 `Local http://localhost:4321/` 后，用浏览器打开该地址。

## 发布前验证

```bash
pnpm test
```

```bash
pnpm build
```

两条命令均成功后，`dist/` 中会生成可部署站点；构建同时执行有限的图片隐私自动防护与 Astro 类型检查。图片脚本只查找 JPEG EXIF 标记并拒绝 TIF/TIFF/HEIC，不能检查 PNG/WebP 元数据、JPEG XMP/IPTC 或画面中的身份信息；发布图片前仍须重新导出并清除元数据，再逐张人工检查画面和文件属性。

从新建草稿到 Pages CMS、Vercel 发布和域名配置的完整步骤，请阅读 [新手发布指南](docs/publishing-guide.md)。
