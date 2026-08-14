---
title: 从一次报错谈起
slug: error-as-a-clue
date: 2026-08-08
description: 从一个小小的程序错误出发，记录排查过程，以及错误如何暴露我们未经检验的假设。
category: 技术
tags: [编程, 调试]
draft: false
---

程序没有突然背叛我，它只是忠实执行了我没有意识到的假设。

```js
const visiblePosts = posts.filter((post) => !post.draft);
```

这次排查让我重新意识到：报错首先是一条线索，其次才是一种阻碍。把假设写出来，比盯着结果反复猜测更有效。
