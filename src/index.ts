import 'module-alias/register'
import { Client, GatewayIntentBits, Message, Events } from 'discord.js'
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

client.on(Events.MessageCreate, (message: Message) => {
    console.log('on message', message.cleanContent, message.channelId)
})

client.login(config.discord.token)