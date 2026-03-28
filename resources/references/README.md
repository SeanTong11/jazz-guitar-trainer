# External Reference Resources

同步日期：`2026-03-29`

这里保存的是当前项目开发时拉到本地的外部参考资源。它们的角色是“参考”，不是运行时强依赖。

## 1. tonaljs / tonal

- 上游：<https://github.com/tonaljs/tonal>
- 本地目录：[`./tonal`](./tonal)

当前同步内容：

- `README.md`
- `package.json`
- `packages/chord/README.md`
- `packages/chord-type/README.md`
- `packages/chord-dictionary/README.md`
- `packages/voicing/README.md`

用途：

- 查看 chord / chord-type / voicing 相关 API 和命名约定
- 后续如果要把 hand-written 规则迁到更系统化的理论层，这里是第一参考源

## 2. szaza / guitar-chords-db-json

- 上游：<https://github.com/szaza/guitar-chords-db-json>
- 本地目录：[`./guitar-chords-db-json`](./guitar-chords-db-json)

当前同步内容：

- `README.MD`
- `LICENSE`
- `C/` 目录下与当前功能直接相关的一组代表性 JSON
  - triads: `major`, `minor`, `aug`, `dim`
  - sixth chords: `6`, `m6`, `6add9`, `m6add9`
  - seventh chords: `maj7`, `7`, `m7`, `m7b5`, `dim7`
  - extensions / tensions: `add9`, `maj#11`, `9`, `11`, `13`, `7b9`, `7#9`, `maj9`, `maj13`, `m9`, `m11`, `m13`

用途：

- 查看吉他和弦图 JSON 的字段结构
- 对照 chord suffix 的命名方式
- 后续把练耳反馈和和弦图 / 指板联动时，作为指型参考来源之一

## 使用原则

- 当前练耳题库仍由项目内部规则生成，避免 UI 和题目逻辑直接受外部仓库结构牵制
- 外部资源优先用于对照、校验和后续设计扩展
- 如果后面要正式接入运行时依赖，应该先做一层本地 schema / adapter，而不是直接耦合上游文件名
