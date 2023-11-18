import { Message } from "discord.js";
import { env } from "~/env";
import { writeLog } from "~/lib/log";

const getWeather = async (args: string) => {
  const { location, unit } = JSON.parse(args);
  writeLog(`GET WEATHER ${location} ${unit}`);

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${
        env.OPEN_WEATHER_APIKEY
      }&units=${unit === "c" ? "metric" : "imperial"}`
    );
    const data = await response.json();

    writeLog(data);
    return JSON.stringify(data);
  } catch (error: any) {
    writeLog("FAILED TO GET WEATHER");
    writeLog(error.message);
    return "failed";
  }
};

const getCurrentTime = (args: string) => {
  const { location } = JSON.parse(args);
  writeLog(`GET CURRENT TIME ${location}`);

  const date = new Date();
  const utcDate = new Date(date.toUTCString());

  writeLog(utcDate);

  return `here's current time in ISO 8601 ${utcDate}`;
};

const changeUserNickname = async (args: string, message?: Message) => {
  const { user: nickname, name } = JSON.parse(args);

  writeLog(`CHANGE USER NICKNAME ${nickname} to ${name}`);
  if (!message) return "failed";

  const author = message.guild?.members.cache.find(
    (member) =>
      member.nickname?.toLocaleLowerCase() === nickname.toLocaleLowerCase() ||
      member.displayName.toLocaleLowerCase() === nickname.toLocaleLowerCase()
  );

  try {
    await author?.setNickname(name);

    return "success";
  } catch (error: any) {
    if (typeof error.message === "string") return error.message;
    writeLog("FAILED TO CHANGE USER NICKNAME");
    writeLog(error.message);
    return "failed";
  }
};

export { getWeather, getCurrentTime, changeUserNickname };
