import {
  AudioPlayerStatus,
  NoSubscriberBehavior,
  VoiceConnection,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel as joinVc,
} from "@discordjs/voice";
import { Message } from "discord.js";

const resource = createAudioResource(
  "/home/dev/projects/feibot/src/assets/hello-46355.mp3"
);

let connection: VoiceConnection | undefined = undefined;

const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Pause,
  },
  debug: true,
});

player.on(AudioPlayerStatus.Playing, () => {
  console.log("The audio player has started playing!");
});

const joinVoiceChannel = async (message: Message) => {
  if (!message.member?.voice.channel || !message.guild) return;

  const joinable = message.member.voice.channel?.joinable;
  console.log("JOINABLE", joinable);

  connection = joinVc({
    channelId: message.member?.voice.channel.id,
    guildId: message.guild.id,
    adapterCreator: message.guild?.voiceAdapterCreator,
    selfDeaf: false,
  });
};

const playAudio = (voice: string) => {
  console.log("PLAYING");

  player.play(createAudioResource(voice));

  if (connection) connection.subscribe(player);
};

export { connection, joinVoiceChannel, playAudio };
