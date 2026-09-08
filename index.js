import { Client, GatewayIntentBits } from "discord.js";
import translate from "google-translate-api-x";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!DISCORD_TOKEN) {
  throw new Error("DISCORD_TOKEN is missing.");
}

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
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  try {
    // Bot投稿は無視して無限ループを防止
    if (message.author.bot) return;
    if (!message.guild) return;

    const text = message.content.trim();
    if (!text || !containsKorean(text)) return;

    const result = await translate(text, {
      from: "ko",
      to: "ja",
      client: "gtx"
    });

    const translated = result.text?.trim();
    if (!translated) return;

    await message.reply({
      content: translated,
      allowedMentions: { repliedUser: false }
    });

  } catch (error) {
    console.error("Translation error:", error);
  }
});

client.login(DISCORD_TOKEN);
