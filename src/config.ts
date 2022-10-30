import dotenv from 'dotenv'

dotenv.config()

export default {
    /**
     * @description MongoDB database connection
     * @see https://www.mongodb.com if you are not planning on hosting your own database server
     *
     * @type {object}
     * @property {string} host MongoBD host
     * @property {number} port MongoDB post
     * @property {string} name MongoDB database name
     * @property {string} user MongoDB database user, required if your database has auth enabled
     * @property {string} password MongoDB database password, same with user required if auth enabled
     */
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 27017,
        name: process.env.DB_NAME || '0',
        user: process.env.DB_USER || '',
        password: process.env.DB_PASSWORD || ''
    },

    /**
     * @description Discord Bot API configuration
     * @see https://discord.com/developers/docs/getting-started#creating-an-app
     *
     * @type {object}
     * @property {string} token discord bot token
     */
    discord: {
        token: process.env.DISCORD_TOKEN || ''
    },

    /**
     * @description Your bot name and identity
     *
     * @type {object}
     * @property {string} name Bot name
     * @property {string} identity Bot default identity, will be used if custom identity has not been set
     * @property {number} contextLength Number of the latest chat messages that will be used to generate response from OpenAI
     */
    bot: {
        name: process.env.BOT_NAME || 'Fei',
        identity: process.env.BOT_IDENTITY || '',
        contextLength: parseInt(process.env.BOT_CONTEXT_LENGTH) || 10
    },

    /**
     * @description OpenAI API configuration
     * @see https://openai.com/api/
     *
     * @type {object}
     * @property {string} apiKey OpenAI API key
     */
    openai: {
        apiKey: process.env.OPENAI_APIKEY
    }
}