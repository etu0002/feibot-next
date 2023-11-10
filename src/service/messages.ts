import { Message } from 'discord.js'
import { db } from '~/db'
import { messages } from '~/db/schema'

const logMessage = async (message: Message) => {
  const cleanContent = message.cleanContent
    .replace(/<@!\d+>/g, '')
    .replace(/<a:.+:\d+>/g, '')
    .replace(/@/g, '')

  const author = message.guild?.members.cache.get(message.author.id)

  await db
    .insert(messages)
    .values({
      uuid: message.id,
      userUuid: message.author.id,
      userName: author?.nickname ?? message.author.username,
      channelUuid: message.channelId,
      serverUuid: message.guildId,
      serverName: message.guild?.name,
      content: message.content,
      cleanContent: cleanContent
    })
    .execute()
}

export { logMessage }
