import { Configuration, OpenAIApi } from 'openai'
import config from '@src/config'

const configuration = new Configuration({
    apiKey: config.openai.apiKey
})

const openai = new OpenAIApi(configuration)

export default openai