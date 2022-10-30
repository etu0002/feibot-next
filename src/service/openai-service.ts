import { Message } from 'discord.js'
import { getMessageLog } from '@src/service/chat-message-service'
import config from '@src/config'
import openai from '@src/lib/openai'

/* eslint @typescript-eslint/no-var-requires: "off" */
const { encode } = require('gpt-3-encoder')


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
            if (response.data.choices[0].text) return response.data.choices[0].text
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

const generateMessagePrompt = async (channelId: string, limit = 10): Promise<string> => {
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
