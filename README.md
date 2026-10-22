# Aviation CBT

航空大学校受験生向けの、10問構成CBT模試のテスト運用版です。ログイン、注意事項確認、受験、タイマー、自動採点、解説、受験履歴までを動作確認できます。

## 技術・起動

- React 18 / TypeScript / Vite / React Router
- `npm install` → `npm run dev`
- ビルドは `npm run build`、Vercelはこのリポジトリを接続してFramework PresetをViteにします。

テストログイン：`test-user` / `test1234`

## 構成と問題追加

型は `src/types.ts`、問題データは `src/data.ts`、保存・認証は `src/services.ts`、画面は `src/main.tsx` に分離しています。新規問題は [templates/question-generation-template.json](./templates/question-generation-template.json) を使い、[docs/monthly-question-workflow.md](./docs/monthly-question-workflow.md) の手順で年月ごとに追加してください。AI生成問題は draft/unpublished から始め、正答・解説を人間が確認してから公開します。

## 制限事項と本番化

このテスト版の簡易ログインは認証基盤ではなく、ブラウザ内のlocalStorageを利用します。localStorageは改ざん可能で、結果・受験セッションも安全な保存先ではありません。正答データも静的配信物に含まれるため、本番ではSupabase等のサーバー側認証、DB保存、サーバー側採点、権限検証、監査ログ、レート制限、HTTPSを導入してください。パスワードやAPIキーはlocalStorageへ保存していません。
