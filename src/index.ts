process.stdin.resume()

console.log('started')

import { Client, GatewayIntentBits, Message, Events } from 'discord.js'
import { env } from './env'
import { logMessage } from './service/messages'

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
  if (message.author.bot && message.author.id !== client.user?.id) return

  await logMessage(message)
})

const main = async () => {
  client.login(env.DISCORD_TOKEN)
}

main()

function exitHandler(options: any, exitCode: any) {
  if (options.cleanup) {
    if (client) client.destroy()
  }
  if (exitCode || exitCode === 0) console.log(exitCode)
  if (options.exit) process.exit()
}

process.on('exit', exitHandler.bind(null, { cleanup: true }))
process.on('SIGINT', exitHandler.bind(null, { exit: true }))
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))
process.on('uncaughtException', exitHandler.bind(null, { exit: true }))
