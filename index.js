import { Client, GatewayIntentBits } from "discord.js";
import translate from "google-translate-api-x";

// Railway Variables から Discord Bot Token を取得。
// 前後の空白・改行・引用符・誤って付けた "Bot " を除去します。
function normalizeToken(raw) {
  if (!raw) return "";

  let token = raw.trim();

  // "xxxxx" または 'xxxxx' のように貼られていた場合
  if (
    (token.startsWith('"') && token.endsWith('"')) ||
    (token.startsWith("'") && token.endsWith("'"))
  ) {
    token = token.slice(1, -1).trim();
  }

  // "Bot xxxxx" と貼られていた場合
  token = token.replace(/^Bot\s+/i, "").trim();

  return token;
}

const rawToken = process.env.DISCORD_TOKEN;
const DISCORD_TOKEN = normalizeToken(rawToken);

if (!DISCORD_TOKEN) {
  console.error("❌ DISCORD_TOKEN が設定されていません。");
  console.error("Railway → translate → Variables → DISCORD_TOKEN を確認してください。");
  process.exit(1);
}

// Tokenそのものは絶対にログへ出しません。
// 認識された文字数など、安全な診断情報だけ表示します。
console.log("=== SKN Translator 起動チェック ===");
console.log(`DISCORD_TOKEN: 設定あり (${DISCORD_TOKEN.length} characters)`);
console.log(`前後の不要文字を除去: ${rawToken !== DISCORD_TOKEN ? "あり" : "なし"}`);
console.log("Discordへログインしています...");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const koreanRegex = /[가-힣ㄱ-ㅎㅏ-ㅣ]/;

function containsKorean(text) {
  return koreanRegex.test(text);
}

client.once("ready", () => {
  console.log(`✅ Discordログイン成功: ${client.user.tag}`);
  console.log("✅ SKN Korean → Japanese Translator is ready.");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const text = message.content?.trim();
  if (!text || !containsKorean(text)) return;

  try {
    console.log(`韓国語メッセージを検出: ${message.guild.name} / #${message.channel?.name ?? "unknown"}`);

    const result = await translate(text, {
      from: "ko",
      to: "ja",
      client: "gtx"
    });

    const translated = result?.text?.trim();
    if (!translated) {
      console.warn("⚠️ 翻訳結果が空でした。");
      return;
    }

    await message.reply({
      content: translated,
      allowedMentions: { repliedUser: false }
    });

    console.log("✅ 翻訳を送信しました。");
  } catch (error) {
    console.error("❌ Translation error:", error);
  }
});

client.on("error", (error) => {
  console.error("❌ Discord client error:", error);
});

client.on("warn", (warning) => {
  console.warn("⚠️ Discord warning:", warning);
});

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught exception:", error);
});

client.login(DISCORD_TOKEN).catch((error) => {
  console.error("❌ Discordへのログインに失敗しました。");

  if (error?.code === "TokenInvalid") {
    console.error("原因: DISCORD_TOKEN がDiscordに無効なTokenとして拒否されました。");
    console.error(`Railwayが認識したToken文字数: ${DISCORD_TOKEN.length}`);
    console.error("Discord Developer Portal → Bot → Reset Token で再発行し、RailwayのDISCORD_TOKENへTokenだけを貼ってください。");
  } else {
    console.error(error);
  }

  process.exit(1);
});
