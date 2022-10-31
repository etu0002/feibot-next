import { Message } from 'discord.js'
import { getMessageLog } from '@src/service/chat-message-service'
import config from '@src/config'
import openai from '@src/lib/openai'

/* eslint @typescript-eslint/no-var-requires: "off" */
const { encode } = require('gpt-3-encoder')

/**
 * @description Generate response from OpenAI using latest few messages from the channel which the message Object comes from.
 *
 * @param {Message} message The message object from Discord, retreived when someone send a message to a channel.
 * @returns {Promise<string>}
 */
export const getAiResponse = async (message: Message): Promise<string> => {
    const { name, identity, contextLength } = config.bot
    const messagePrompt = await generateMessagePrompt(message.channelId, contextLength)

    const prompt = `${identity} My name is ${name}.${messagePrompt} \n${name}: `
    console.log(prompt)

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-002',
            prompt: prompt,
            temperature: 0.9,
            top_p: 0.95,
            frequency_penalty: 0.5,
            presence_penalty: 0.5,
            max_tokens: 1000,
            stop: [`${name}: `]
        })

        if (response && response.data.choices.length > 0 && response.data.choices[0].text) {
            return response.data.choices[0].text
        } else {
            console.log('no response')
        }
    } catch (error) {
        console.log('error')
        console.log(error.response.status)
        console.log(error.response.statusText)
        console.log(error.response.data)
    }
}

/**
 * @description Get the latest messages from specified channel and arrange it into format that will be understand by OpenAI to generate response.
 * The format will be:
 * [User Name]: question
 * [Bot Name]: answer
 *
 * @param {string} channelId the channel ID
 * @param {number} limit contextLength or how many message we want to retreive and make into prompt
 * @returns {Promise<string>}
 */
const generateMessagePrompt = async (channelId: string, limit: number): Promise<string> => {
    const messages = await getMessageLog(channelId, limit)
    messages.reverse()

    let prompt = ''

    messages.forEach(message => {
        prompt += `\n${message.authorName}: ${message.text}`
    })

    const encodedPrompt = encode(prompt)

    if (encodedPrompt.length > 3000) {
        return generateMessagePrompt(channelId, limit - 1)
    }

    return prompt
}
