process.stdin.resume();

console.log("started");

import { Client, GatewayIntentBits, Message, Events } from "discord.js";
import { env } from "./env";
import { logMessage } from "./service/messages";
import {
  getTextCompletionsPrompt,
  textCompletions,
} from "./service/openai-service";
import { checkIfMessageIsDirectedAtBot } from "./service/bot";
import { db } from "./db";
import { botLogs } from "./db/schema";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (client: Client) => {
  if (client) console.log("Ready! Logged in as", client.user?.tag);
});

client.on(Events.MessageCreate, async (message: Message) => {
  await logMessage(message);

  if (message.author.id === client.user?.id) return;

  const messageDirectedAtBot = await checkIfMessageIsDirectedAtBot(message);

  if (messageDirectedAtBot) {
    let prompt = await getTextCompletionsPrompt(
      message,
      `My name is ${client.user?.displayName}.`
    );

    prompt += `\n${client.user?.displayName}: `;

    const response = await textCompletions(prompt);

    if (response) {
      message.channel.send(response);
    }

    await db.insert(botLogs).values({
      channelUuid: message.channelId,
      message: message.cleanContent,
      messageIsDirectedAtBot: messageDirectedAtBot,
      response,
    });
  } else {
    await db.insert(botLogs).values({
      channelUuid: message.channelId,
      message: message.cleanContent,
      messageIsDirectedAtBot: messageDirectedAtBot,
      response: "",
    });
  }
});

client.on(Events.Error, (error: Error) => {
  console.error("The WebSocket encountered an error:", error);
});

const main = async () => {
  client.login(env.DISCORD_TOKEN);
};

main();

function exitHandler(options: any, exitCode: any) {
  if (options.cleanup) {
    if (client) client.destroy();
  }
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}

process.on("exit", exitHandler.bind(null, { cleanup: true }));
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
