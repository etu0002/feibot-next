import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL"
      ),
    DISCORD_TOKEN: z.string().min(1),
    OPENAI_APIKEY: z.string().min(1),
    OPENAI_MODEL: z.string().min(1),
    OPENAI_TOKEN_LIMIT: z.string().min(0),
    OPEN_WEATHER_APIKEY: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    OPENAI_APIKEY: process.env.OPENAI_APIKEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    OPENAI_TOKEN_LIMIT: process.env.OPENAI_TOKEN_LIMIT,
    OPEN_WEATHER_APIKEY: process.env.OPEN_WEATHER_APIKEY,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
