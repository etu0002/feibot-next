console.log('started')

import { Client, GatewayIntentBits, Message, Events } from 'discord.js'
import { env } from './env'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
})

client.once(Events.ClientReady, (client: Client) => {
  if (client) console.log('Ready! Logged in as', client.user?.tag)
})

client.on(Events.MessageCreate, async (message: Message) => {
  console.log('on message', message.cleanContent)
})

const main = async () => {
  // Login to discord as Bot
  client.login(env.DISCORD_TOKEN)
}

main()
