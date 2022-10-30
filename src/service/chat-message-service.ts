import ChatMessage from '@src/models/chat-message'
import { Message } from 'discord.js'

export const storeMessage = async (message: Message) => {
    const { cleanContent, channelId, author } = message

    if (!cleanContent) return
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