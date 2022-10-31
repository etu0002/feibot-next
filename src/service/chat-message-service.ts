import ChatMessage, { ChatMessageInterface } from '@src/models/chat-message'
import { Message } from 'discord.js'

/**
 * @description Store the message Object into database.
 *
 * @param {Message} message The message object from Discord, retreived when someone send a message to a channel.
 * @returns {Promise<void>}
 */
export const storeMessage = async (message: Message): Promise<void> => {
    const { cleanContent, channelId, author } = message

    // Make sure message isn't empty
    if (!cleanContent) return

    // Remove emoji tag from message
    const text = cleanContent.replace(/(<a?)?:\w+:(\d{18}>)?/g, '').trim()
    if (!text) return

    const chatMessage = new ChatMessage({
        text,
        channelId,
        authorId: author.id,
        authorName: author.username
    })

    await chatMessage.save()
}

/**
 * @description Retreive a list of messages from database.
 *
 * @param {string} channelId the channel ID
 * @param {number} limit contextLength or how many message we want to retreive and make into prompt
 * @returns {Promise<ChatMessageInterface[]>}
 */
export const getMessageLog = async (channelId: string, limit: number): Promise<ChatMessageInterface[]> => ChatMessage.find({ channelId }).limit(limit).sort({ createdAt: -1 })