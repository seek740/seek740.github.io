---
title: "Git 工作流最佳实践"
date: "2024-03-15T00:00:00+08:00"
tags: ["Git", "开发工具", "效率"]
categories: ["development"]
draft: false
comments: true
showToc: true
TocOpen: false
description: "从分支策略到提交规范，一套完整的 Git 工作流指南。"
---

## 为什么需要 Git 工作流

团队协作中，混乱的分支和提交信息会让项目难以维护。一套好的工作流让代码库整洁、可追溯。

---

## 1. 分支策略

推荐 **GitHub Flow**，适合大多数项目：

```text
main ─────●────────●────────●────
           \       /        /
feature-a   ●──●──●        /
                            /
feature-b   ●────●─────────●
```

- `main` 分支始终可部署
- 功能开发从 `main` 拉新分支
- 完成后提 Pull Request

---

## 2. 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```bash
feat: 添加用户登录功能
fix: 修复导航栏样式错乱
docs: 更新 README 部署说明
refactor: 重构数据处理逻辑
chore: 升级依赖版本
```

**好处**：自动生成 Changelog，语义化版本号。

---

## 3. 代码审查清单

| 检查项 | 说明 |
|--------|------|
| 逻辑正确 | 功能是否符合需求 |
| 边界处理 | 空值、超长输入等异常情况 |
| 代码风格 | 遵循项目 ESLint 规则 |
| 测试覆盖 | 关键路径有测试 |
| 性能影响 | 无明显性能退化 |

---

## 4. 常用 Git 别名

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --all"
git config --global alias.undo "reset --soft HEAD^"
```

---

## 5. 交互式 Rebase

保持提交历史干净：

```bash
# 合并最近 3 个提交
git rebase -i HEAD~3

# 选项中：
# pick   = 保留
# squash = 合并到上一个
# reword = 修改提交信息
```

---

> 💡 小提示：`git reflog` 是你的后悔药，几乎所有误操作都能找回。

## 参考

- [Git 官方文档](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow 指南](https://docs.github.com/en/get-started/quickstart/github-flow)
