# リポジトリガイドライン

## プロジェクト概要（Overview）

このリポジトリは、ブラウザで動作する小規模な放置・クリック系ゲーム「wisp-increment」を管理するためのものである。プレイヤーはウィスプをクリックして火を集め、石炭・マシュマロ・おばけ・メダルによる生産チェーンを育て、冷却によるフロスト獲得で周回強化を行う。

アプリケーションは Vite + React + TypeScript の SPA として構成し、ゲーム状態はブラウザの `localStorage` に保存する。主な実装範囲は `src/App.tsx` のゲームループと画面合成、`src/game/` のゲーム状態・定数・ロジック・保存処理、`src/components/` の表示コンポーネント、`src/App.css` の見た目とアニメーションである。

## コーディング規約（Coding Style Guidelines）

- TypeScript は `strict` 前提で記述する。共有するゲーム概念は `src/game/types.ts` の明示的な型へ集約し、`ResourceId` や `ItemId` のような文字列リテラル Union を変更する場合は、定数・初期状態・保存データ正規化・ゲームロジック・UI 表示を同時に確認する。
- React は関数コンポーネントと Hooks を使う。描画に使う状態は不変なスナップショットとして扱い、長時間更新されるゲーム本体の状態は既存方針に合わせて `useRef` と `cloneGameState` で管理する。`useEffect` で `requestAnimationFrame`、`setInterval`、`setTimeout` などを使う場合は必ず cleanup を返す。
- インポートはダブルクォート、文末はセミコロンを使う。変数・関数は `camelCase`、React コンポーネントと型は `PascalCase`、CSS クラスは `kebab-case` とする。
- ゲーム定義は `src/game/constants.ts`、ゲーム処理は `src/game/logic.ts`、保存処理は `src/game/storage.ts`、表示専用処理は `src/components/` に置く。責務をまたぐ変更では、既存の分割を保つ。
- 大きな数値リテラルには読みやすい範囲で `_` 区切りを使う。日本語の UI 文言や絵文字表現は既存トーンに合わせる。
- CSS は原則 `src/App.css` に集約する。既存のグリッド・Flex・レスポンシブ指定、8px 前後のカード角丸、ウィスプの暗色/シアン/炎テーマを尊重する。
- 現時点で ESLint、Prettier、テストランナーの npm script は定義されていない。自動整形・自動修正を追加または実行する場合は、先に設定と影響範囲を明確にする。
- コメントは、処理の目的や非自明なゲーム計算を説明するために使う。型名や関数名から明らかな内容を繰り返すだけのコメントは増やさない。

Karpathy-Inspired Guidelines として、以下の 4 原則を常に適用する。

- Think Before Coding: 実装前に要求、既存構造、影響範囲、保存データ互換性、検証方法を短く整理する。仕様が不明なまま推測で広範囲を変更しない。
- Simplicity First: 小さな関数、明示的なデータ、既存パターンを優先する。新しい抽象化、状態管理ライブラリ、ビルド設定、依存関係は、重複や複雑さを実際に減らす場合だけ導入する。
- Surgical Changes: 目的に必要な最小範囲を変更する。無関係なリファクタ、見た目の好みだけの変更、ロックファイルや生成物の不要な更新を避ける。
- Goal-Driven Execution: 変更はユーザー体験または保守性の明確な目的に結びつける。完了時は `npm run build` で TypeScript と Vite のビルドを確認し、UI やゲームバランスを変えた場合はブラウザ上の挙動も確認する。

## セキュリティ（Security considerations）

- API キー、トークン、パスワード、個人情報をリポジトリにコミットしない。将来環境変数を使う場合でも、Vite のクライアントコードへ公開される `VITE_` 接頭辞付き変数には秘密情報を入れない。
- `envPrefix` を空文字にするなど、環境変数を一括でクライアントへ露出する設定は禁止する。クライアントに渡す値は公開してよい設定値だけに限定する。
- セーブデータはユーザーが改変可能な `localStorage` を信頼しない。読み込み時は `src/game/storage.ts` のように欠損・不正値を正規化し、例外時は安全に初期状態へ戻す。
- DOM へ任意 HTML を注入しない。UI テキストは React の通常の文字列レンダリングを使い、`dangerouslySetInnerHTML` は原則使わない。
- 依存関係を追加・更新する場合は、必要性、ライセンス、メンテナンス状況、ブラウザへ送られるバンドル量を確認する。`package-lock.json` を使うため、依存関係操作は npm に統一する。
- 外部通信を追加する場合は HTTPS を前提とし、エラー時のフォールバック、タイムアウト、ユーザー入力の検証、保存データとの境界を明確にする。

## ビルド＆テスト手順（Build & Test）

セットアップと実行は npm を使う。

- 依存関係のインストール: `npm install`
- 開発サーバー起動: `npm run dev`
- 本番ビルド: `npm run build`
- ビルド結果のローカル確認: `npm run preview`

`npm run build` は `tsc -b` による TypeScript プロジェクトビルドと `vite build` を連続実行するため、現時点の主要な検証コマンドである。変更完了前には原則として `npm run build` を実行する。

現時点で `test`、`lint`、`format`、CI/CD 設定は確認されていない。テストを追加する場合は、ゲーム計算は `src/game/logic.ts` を中心に単体テスト化し、保存データ互換性は `src/game/storage.ts` の正規化処理を対象にする。UI やアニメーションを変更した場合は、開発サーバーでクリック、購入、最大購入、冷却、リセット、保存復元の主要導線を手動確認する。

## 知識＆ライブラリ（Knowledge & Library）

- 実装前に`Context7 MCP Server`を利用し、`resolve-library-id` → `get-library-docs` で関連ライブラリ（例：`/upstash/context7`）の最新情報を取得する。

## メンテナンス_ポリシー（Maintenance policy）

- 新規実装や変更を行った後、 AGENTS.md の更新を検討すること
- 会話の中で繰り返し指示されたことがある場合は反映を検討すること
- 冗長だったり、圧縮の余地がある箇所を検討すること
- 簡潔でありながら密度の濃い文書にすること
