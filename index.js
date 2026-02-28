require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const OpenAI = require('openai');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

client.on('ready', () => {
  console.log("Bot connecté !");
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.mentions.has(client.user)) return;

  const content = message.content.replace(`<@${client.user.id}>`, '').trim();

  try {

    if (content.startsWith("image")) {
      const prompt = content.replace("image", "").trim();

      const img = await openai.images.generate({
        model: "gpt-image-1",
        prompt: prompt,
        size: "1024x1024"
      });

      return message.reply(img.data[0].url);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: content }
      ]
    });

    message.reply(response.choices[0].message.content);

  } catch (err) {
    console.error(err);
    message.reply("Erreur IA.");
  }
});

client.login(process.env.TOKEN);
