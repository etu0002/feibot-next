import 'module-alias/register'
import { Client, GatewayIntentBits, Message, Events } from 'discord.js'
import { connect } from '@src/lib/mongoose'
import { storeMessage } from '@src/service/chat-message-service'
import config from '@src/config'
import { getAiResponse } from '@src/service/openai-service'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
})

client.once(Events.ClientReady, (client: Client) => {
    console.log(`Ready! Logged in as ${client.user.tag}`)
})

client.on(Events.MessageCreate, async (message: Message) => {
    console.log('on message', message.cleanContent)
    // Save message to be used later when generating response from OpenAI
    await storeMessage(message)

    // Check for ping
    if (message.cleanContent && message.cleanContent.includes(`@${config.bot.name}`)) {
        message.channel.sendTyping()

        // Get the AI response and reply to message
        const response = await getAiResponse(message)
        if (response) message.channel.send(response).catch(console.log)
    }
})


const main = async () => {
    // Wait for MongoDB connection
    await connect()

    // Login to discord as Bot
    client.login(config.discord.token)
}

main()