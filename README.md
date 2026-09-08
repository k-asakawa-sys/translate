# SKN Korean Translator - 無料Google翻訳版

Discordに韓国語が投稿されたら、自動で日本語に翻訳して返信するBotです。

## 特徴
- Python不要
- OpenAI API不要
- Google Cloud API不要
- APIキー不要
- 非公式Google翻訳ライブラリを使用
- Railway等のNode.js常駐環境で動作

## 必要な環境変数
Railwayには以下だけ設定します。

DISCORD_TOKEN=Discord Bot Token

## Discord設定
Discord Developer Portal > Bot > Privileged Gateway Intents

Message Content Intent をONにしてください。

## Railway
1. GitHubへファイルをアップロード
2. RailwayでDeploy from GitHub repo
3. VariablesにDISCORD_TOKENを追加
4. Deploy

## 注意
このBotは非公式のGoogle翻訳アクセスを使用します。
Google公式APIではないため、Google側の仕様変更・アクセス制限・レート制限などで
突然動かなくなる可能性があります。

その場合はライブラリ更新または翻訳方式の変更が必要です。

## 既存読み上げBotについて
翻訳結果はBot自身の投稿になります。
読み上げBotが「Botの投稿を無視する」仕様の場合は読み上げられません。
