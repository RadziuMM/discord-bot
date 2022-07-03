import {
  AudioPlayerStatus,
  createAudioPlayer,
  DiscordGatewayAdapterCreator,
  joinVoiceChannel,
} from '@discordjs/voice';
import { Message } from 'discord.js';
import { Room } from '../../interface/room.interface';
import { LogType, logger } from '../../../../util/logger';
import { leaveRoom, run } from '..';

export default async (
  message: Message,
  map: Record<string, any>,
): Promise<Room> => {
  const { id } = message.guild!;
  const oldRoom: Room = map.get(id);
  if (oldRoom) await leaveRoom(message, map);

  const voiceChannel = message.member!.voice.channel;
  const adapter = message.guild!.voiceAdapterCreator !as DiscordGatewayAdapterCreator;

  const room: Room = {
    textChannel: message.channel,
    connection: joinVoiceChannel({
      channelId: voiceChannel!.id,
      guildId: id,
      adapterCreator: adapter,
    }),
    voiceChannel,
    player: createAudioPlayer(),
    songs: [],
    isPlaying: false,
    trackedSongMessage: null,
    idle: null,
  };

  room.player.on(AudioPlayerStatus.Idle, async () => {
    room.isPlaying = false;
    room.songs.shift();
    if (room.songs.length) {
      await run(id, map);
    } else {
      room.idle = setTimeout(
        async () => await leaveRoom(message, map),
        5 * 60 * 1000,
      );
    }
  });

  room.player.on('error', async (error: any) => {
    logger(`A problem was encountered while playing a song. Error: ${error.message}`, LogType.ERROR);
    room.songs.shift();
    await run(id, map);
  });

  map.set(id, room);

  logger(`Bot joined the room #${id}`, LogType.INFO);
  return room;
};
