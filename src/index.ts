import { Client, GatewayIntentBits, Message, Events } from "discord.js";
import { env } from "~/env";
import { logMessage } from "~/service/messages";
import { getAssistanceResponse } from "~/service/assistance";
import { writeLog } from "./lib/log";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (client: Client) => {
  if (client) {
    writeLog(`Ready! Logged in as ${client.user?.tag}`);
  }
});

client.on(Events.MessageCreate, async (message: Message) => {
  await logMessage(message);

  if (message.author.id === client.user?.id) return;

  const response = await getAssistanceResponse(message);

  writeLog(`ASSISTANCE RESPONSE ${response}`);

  if (response) {
    message.channel.send(response.value).then((message) => {
      writeLog(`ASSISTANCE RESPONSE SENT ${message.content}`);
    });
  }
});

client.on(Events.Error, (error: Error) => {
  writeLog(`The WebSocket encountered an error: ${error}`);
});

const main = async () => {
  client.login(env.DISCORD_TOKEN).catch((error) => {
    writeLog(`Failed to login to Discord: ${error}`);
  });
};

main();
