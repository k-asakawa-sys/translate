# SKN Korean Translator - Fixed

Discord内の韓国語メッセージを検出し、日本語へ自動翻訳して返信するBotです。

## Railway Variables

`DISCORD_TOKEN` に Discord Developer Portal → Bot で発行した Bot Token を設定してください。

## 修正版の変更点

- DISCORD_TOKEN の前後の空白・改行を自動除去
- 誤って付けた `Bot ` を自動除去
- 引用符を自動除去
- Tokenそのものを表示せず、認識文字数だけDeploy Logsに表示
- Discordログイン失敗の原因を分かりやすくログ表示
- 翻訳処理のエラーでBot全体が落ちにくい構成

## 成功時ログ

`✅ Discordログイン成功: ...`

が表示されればDiscordへの接続成功です。
