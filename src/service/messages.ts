import { Message } from "discord.js";
import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import { messages } from "../db/schema";

/**
 * Sanitizes the content of a message by removing user mentions and custom emojis.
 * @param content - The content of the message to sanitize.
 * @returns The sanitized message content.
 */
const sanitizeMessageContent = (content: string) => {
  return (
    content
      // .replace(/<@!\d+>/g, "")
      // .replace(/<a:.+:\d+>/g, "")
      // .replace(/<:.+:\d+>/g, "")
      .replace(/@/g, "")
  );
};

/**
 * Logs a message to the database.
 * @param message The message to log.
 */
const logMessage = async (message: Message) => {
  const cleanContent = sanitizeMessageContent(message.cleanContent);
  if (!cleanContent) return;

  const author = message.guild?.members.cache.get(message.author.id);
  const server = message.guild;
  const channel = server?.channels.cache.find(
    (channel) => channel.id === message.channelId
  );

  await db
    .insert(messages)
    .values({
      bot: message.author.bot,
      uuid: message.id,
      userUuid: author?.id,
      userName: author?.user.username,
      userDisplayName: author?.nickname ?? message.author.displayName,
      channelUuid: message.channelId,
      channelName: channel?.name,
      serverUuid: server?.id,
      serverName: server?.name,
      content: message.content,
      cleanContent: cleanContent,
    })
    .execute();
};

const getMessagesByChannel = async (channelId: string, limit: 10) => {
  const data = await db
    .select()
    .from(messages)
    .where(eq(messages.channelUuid, channelId))
    .orderBy(desc(messages.createdAt))
    .limit(limit)
    .execute();
  return data;
};

export { logMessage, sanitizeMessageContent, getMessagesByChannel };
