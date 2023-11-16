import { Message } from "discord.js";
import { env } from "../env";

const getWeather = async (args: string) => {
  const { location, unit } = JSON.parse(args);
  console.log("GET WEATHER");
  console.log(location, unit);

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${
        env.OPEN_WEATHER_APIKEY
      }&units=${unit === "c" ? "metric" : "imperial"}`
    );
    const data = await response.json();

    console.log(data);
    return JSON.stringify(data);
  } catch (error: any) {
    console.log(error.message);
    return "failed";
  }
};

const getCurrentTime = (args: string) => {
  const { location } = JSON.parse(args);
  console.log("GET TIME");
  console.log(location);

  const date = new Date();
  const utcDate = new Date(date.toUTCString());

  console.log(utcDate);

  return `here's current time in ISO 8601 ${utcDate}`;
};

const changeUserNickname = async (args: string, message?: Message) => {
  console.log("CHANGE NICKNAME");
  const { user: nickname, name } = JSON.parse(args);

  console.log(nickname, name);
  console.log(message ? "has message" : "no message");
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
    console.log(error.message);
    return "failed";
  }
};

export { getWeather, getCurrentTime, changeUserNickname };
