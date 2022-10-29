import dotenv from 'dotenv'

dotenv.config()

export default {
    /**
     * @description MongoDB database connection config
     *
     * @type {object}
     * @property {string} host MongoBD host
     * @property {number} port MongoDB post
     * @property {string} name MongoDB database name
     */
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 27017,
        name: process.env.DB_NAME || '0'
    },

    /**
     * @description Discord configuration
     *
     * @type {object}
     * @property {string} token discord bot token
     */
    discord: {
        token: process.env.DISCORD_TOKEN || ''
    },

    /**
     * @description Bot configuration
     *
     * @type {object}
     * @property {string} name Bot name
     * @property {string} identity Bot default identity
     */
    bot: {
        name: process.env.BOT_NAME || 'Fei',
        identity: process.env.BOT_IDENTITY || ''
    },

    /**
     * @description OpenAI API configuration
     *
     * @type {object}
     * @property {string} apiKey OpenAI API key
     */
    openai: {
        apiKey: process.env.OPENAI_APIKEY
    }
}