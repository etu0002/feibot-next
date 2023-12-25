import { Message } from "discord.js";
import { getTextCompletionsPrompt, textCompletions } from "./openai-service";

const checkIfMessageIsDirectedAtBot = async (message: Message) => {
  if (!message.cleanContent) return false;

  if (message.mentions.has(message.client.user?.id!)) return true;

  const botName = message.client.user?.displayName.toLocaleLowerCase();
  const cleanContent = message.cleanContent.toLocaleLowerCase();
  const cleanContentSplit = cleanContent.split(" ");

  if (
    cleanContent.endsWith(botName) ||
    cleanContent.startsWith(botName) ||
    cleanContent.endsWith(botName + "?") ||
    cleanContent.startsWith(botName + "?") ||
    (cleanContentSplit.length > 1 && cleanContentSplit[1] === botName)
  )
    return true;

  let previousMessages = await message.channel.messages.fetch({
    limit: 4,
    before: message.id,
  });

  if (
    previousMessages.at(0)?.cleanContent.endsWith("?") &&
    previousMessages.at(0)?.author.id === message.client.user?.id &&
    previousMessages.at(1)?.author.id === message.author.id
  )
    return true;

  if (
    previousMessages
      .at(0)
      ?.cleanContent.includes(message.client.user?.displayName!) &&
    previousMessages
      .at(1)
      ?.cleanContent.includes(message.client.user?.displayName!)
  )
    return true;

  if (
    !previousMessages.some(
      (message) => message.author.id === message.client.user?.id
    )
  )
    return false;

  let prompt = await getTextCompletionsPrompt(
    message,
    `Determine if the last message is directed at ${message.client.user?.displayName}, reply with yes or no.`,
    10
  );

  const response = await textCompletions(prompt);

  if (response && response.toLocaleLowerCase().includes("yes")) return true;

  return false;
};

export { checkIfMessageIsDirectedAtBot };
