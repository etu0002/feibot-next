import { Client, GatewayIntentBits, Message, Events } from "discord.js";
import { env } from "./env";
import { logMessage } from "./service/messages";
import { getAssistanceResponse } from "./service/assistance";
import { generateDependencyReport } from "@discordjs/voice";
import { joinVoiceChannel, playAudio } from "./service/voice";
import { createSpeech } from "./service/openai-speech";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once(Events.ClientReady, (client: Client) => {
  if (client) {
    console.log("Ready! Logged in as", client.user?.tag);
    console.log(generateDependencyReport());
  }
});

client.on(Events.MessageCreate, async (message: Message) => {
  if (message.content === "join") {
    console.log("JOINING");
    joinVoiceChannel(message);
    return;
  }

  await logMessage(message);

  if (message.author.id === client.user?.id) return;

  const response = await getAssistanceResponse(message);

  console.log("ASSISTANCE RESPONSE");
  console.log(response);

  if (response) {
    if (client.voice.adapters.size > 0) {
      console.log("VOICE");
      const speech = await createSpeech(response.value);

      playAudio(speech);
    } else {
      message.channel.send(response.value).then((message) => {
        console.log("MESSAGE SENT");
      });
    }
  }
});

client.on(Events.Error, (error: Error) => {
  console.error("The WebSocket encountered an error:", error);
});

const main = async () => {
  client.login(env.DISCORD_TOKEN).catch((error) => {
    console.error("Failed to login:", error);
  });
};

main();
