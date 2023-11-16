import fs from "fs";
import path from "path";
import openai from "../lib/openai";

const createSpeech = async (text: string) => {
  const file = path.resolve(__dirname, "../../audio/speech.mp3");
  const voice = await openai.audio.speech.create({
    model: "tts-1",
    voice: "nova",
    input: text,
  });

  console.log("FILE");
  console.log(file);

  const buffer = Buffer.from(await voice.arrayBuffer());
  await fs.promises.writeFile(file, buffer);

  return file;
};

export { createSpeech };
