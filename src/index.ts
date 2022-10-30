import 'module-alias/register'
import { Client, GatewayIntentBits, Message, Events } from 'discord.js'
import { connect } from '@src/lib/mongoose'
import { storeMessage } from './service/chat-message-service'
import config from '@src/config'

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
    // Save message to be used later when generating response from OpenAI
    await storeMessage(message)

    console.log('chat message saved')
})


const main = async () => {
    await connect()
    client.login(config.discord.token)
}

main()