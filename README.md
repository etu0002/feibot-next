## Feibot

A discord chat bot integrated with OpenAI.

Before starting you need [Discord Bot Token](https://discord.com/developers/docs/getting-started#creating-an-app) and [OpenAI API Key](https://openai.com/api/). All of the Privileged Gateway Intents also need to be enabled in you discord bot.
![The San Juan Mountains are beautiful!](https://cdn.discordapp.com/attachments/699173597742104637/1036513241922293761/unknown.png)


### Manual Installation
For manual installation you'll need [Node.js](https://nodejs.org/en/) 16 or above and a MongoDB server for storing chat messages which later be used to generate conversation responses from OpenAI. If you don't want to host MongoDB yourself you can try getting it from [mongodb.com](https://www.mongodb.com/) for free.

- Rename `.env.example` to `.env`
- Fill up the cofiguration in the .env file
- Install the dependencies with `npm install`
- Start the bot with `npm run start` or `npm run dev` for development


### Docker Installation
Make sure you have docker installed on you machine, you can refer to [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/) for the installation


- Rename `.env.example` to `.env`
- Fill up the cofiguration in the `.env` (don't change the `DB_HOST` as it is provided by docker, you can leave `DB_USER` and `DB_PASSWORD` empty)
- Start the container `docker compose up`
- Start the container in detached mode so you don't need to leave command promt opened `docker compose up -d`
- Force rebuilding the bot, for when you make some changes to the source code `docker compose up --build`
- Stop the container `docker-compose down`