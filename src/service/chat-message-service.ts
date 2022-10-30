import ChatMessage from '@src/models/chat-message'
import { Message } from 'discord.js'

export const storeMessage = async (message: Message) => {
    const { cleanContent, channelId, author } = message

    if (!cleanContent) return

    // Remove emoji from tag message
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

export const getMessageLog = async (channelId: string, limit = 10) => ChatMessage.find({ channelId }).limit(limit).sort({ createdAt: -1 })