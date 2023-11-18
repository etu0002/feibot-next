import fs from "fs";

const writeLog = (message: any) => {
  if (typeof message !== "string") message = JSON.stringify(message);
  const log = `${new Date().toISOString()} ${message}`;
  console.log(log);
  fs.appendFileSync("log.txt", log + "\n");
};

export { writeLog };
