# AGENTS.md

## 提交约定

- 完成用户请求的改动后，自动 `git add` 相关文件并提交，无需再次询问。
- 仓库的 `post-commit` 钩子会自动 push，提交后确认工作区干净、与 `origin/main` 一致。
- 不要提交 `.env`、密钥，以及与本次改动无关的文件。
- 提交信息沿用现有风格：`fix:` / `feat:` / `perf:` / `refactor:` + 中文简述。
- 提交前运行 `npm run lint` 和 `npm run typecheck`；涉及构建产物时再跑 `npm run build`。
