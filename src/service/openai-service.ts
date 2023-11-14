import { ChatCompletionMessage } from "openai/resources";
import { db } from "~/db";
import { openaiLogs } from "~/db/schema";
import { env } from "~/env";
import openai from "~/lib/openai";
import { sanitizeMessageContent } from "./messages";
import { Message } from "discord.js";
import { encode } from "gpt-3-encoder";

const chatCompletions = async (
  message: string,
  user: string,
  context: ChatCompletionMessage[]
): Promise<ChatCompletionMessage | undefined> => {
  const completions = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that helps me with my homework",
      },
      {
        role: "user",
        content: message,
      },
    ],
    model: env.OPENAI_MODEL,
  });

  if (completions && completions.choices.length > 0) {
    return completions.choices[0]!.message;
  }
};

const getTextCompletionsPrompt = async (message: Message, settings: string) => {
  const chats = await message.channel.messages.fetch({
    limit: 20,
  });

  let prompt = `${settings}\n`;

  chats.reverse().forEach((chat) => {
    if (encode(prompt).length > 3000) return;

    const author = chat.guild?.members.cache.get(chat.author.id);

    prompt += `\n${
      author?.nickname || chat.author.displayName
    }: ${sanitizeMessageContent(chat.cleanContent)}`;
  });

  console.log(prompt);
  console.log("prompt length", encode(prompt).length);

  return prompt;
};

const textCompletions = async (prompt: string): Promise<string | undefined> => {
  const completions = await openai.completions.create({
    prompt: prompt,
    model: env.OPENAI_MODEL,
    max_tokens: 500,
  });

  await db.insert(openaiLogs).values({
    prompt: prompt,
    promthLength: encode(prompt).length,
    response: JSON.stringify(completions),
  });

  if (completions && completions.choices.length > 0) {
    return completions.choices[0]!.text;
  }
};

export { chatCompletions, textCompletions, getTextCompletionsPrompt };

// import { Message } from 'discord.js'
// import { getMessageLog } from '@src/service/chat-message-service'
// import config from '@src/config'
// import openai from '@src/lib/openai'

// /* eslint @typescript-eslint/no-var-requires: "off" */
// const { encode } = require('gpt-3-encoder')

// /**
//  * @description Generate response from OpenAI using latest few messages from the channel which the message Object comes from.
//  *
//  * @param {Message} message The message object from Discord, retreived when someone send a message to a channel.
//  * @returns {Promise<string>}
//  */
// export const getAiResponse = async (message: Message): Promise<string> => {
//     const { name, identity, contextLength } = config.bot
//     const { model, tokenLimit } = config.openai
//     const messagePrompt = await generateMessagePrompt(message.channelId, contextLength)

//     const prompt = `${identity} My name is ${name}.${messagePrompt} \n${name}: `

//     try {
//         const response = await openai.createCompletion({
//             model: model,
//             prompt: prompt,
//             temperature: 0.9,
//             top_p: 0.95,
//             frequency_penalty: 0.5,
//             presence_penalty: 0.5,
//             max_tokens: tokenLimit * 0.25,
//             stop: [`${name}: `]
//         })

//         if (response && response.data.choices.length > 0 && response.data.choices[0].text) {
//             return response.data.choices[0].text
//         } else {
//             console.log('no response')
//         }
//     } catch (error) {
//         console.log('error')
//         console.log(error.response.status)
//         console.log(error.response.statusText)
//         console.log(error.response.data)
//     }
// }

// /**
//  * @description Get the latest messages from specified channel and arrange it into format that will be understand by OpenAI to generate response.
//  * The format will be:
//  * [User Name]: question
//  * [Bot Name]: answer
//  *
//  * @param {string} channelId the channel ID
//  * @param {number} limit contextLength or how many message we want to retreive and make into prompt
//  * @returns {Promise<string>}
//  */
// const generateMessagePrompt = async (channelId: string, limit: number): Promise<string> => {
//     const messages = await getMessageLog(channelId, limit)
//     const { tokenLimit } = config.openai
//     messages.reverse()

//     let prompt = ''

//     messages.forEach(message => {
//         prompt += `\n${message.authorName}: ${message.text}`
//     })

//     const encodedPrompt = encode(prompt)

//     if (encodedPrompt.length > (tokenLimit * 0.75)) {
//         return generateMessagePrompt(channelId, limit - 1)
//     }

//     return prompt
// }
