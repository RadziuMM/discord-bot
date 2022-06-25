import { AudioPlayerStatus, createAudioPlayer, DiscordGatewayAdapterCreator, joinVoiceChannel } from '@discordjs/voice';
import { Message } from 'discord.js';
import { Room } from '../../interface/room.interface';
import { leaveRoom, play } from '../..';
import logger from '../../../../../util/logger';
import { LogType } from '../../../../../util/logger/enum/log-type.enum';
import { Response } from '../../interface/response.interface';

export default async(
  message: Message,
  map: Record<string, any>,
): Promise<Response> => {
  const _room: Room = map.get(message.guild!.id);
  if(_room) await leaveRoom(message);

  const voiceChannel = message.member!.voice.channel;
  const adapter = message.guild!.voiceAdapterCreator !as DiscordGatewayAdapterCreator;

  const room: Room = {
    textChannel: message.channel,
    voiceChannel: voiceChannel,
    connection: joinVoiceChannel({
      channelId: voiceChannel!.id,
      guildId: message.guild!.id,
      adapterCreator: adapter,
    }),
    player: createAudioPlayer(),
    songs: [],
    isPlaying: false,
    trackedSongMessage: null,
    idle: null,
  };

  room.player.on(AudioPlayerStatus.Idle, async() => {
    room.isPlaying = false;
    room.songs.shift();
    if (room.songs.length) {
      await play(message.guild!.id);
    } else {
      room.idle = setTimeout(
        async() => await leaveRoom(message),
        5 * 60 * 1000,
      );
    }
  });

  room.player.on('error', async(error: any) => {
    logger(`A problem was encountered while playing a song. Error: ${error.message}`, LogType.ERROR);
    room.songs.shift();
    await play(message.guild!.id);
  });

  map.set(message.guild!.id, room);

  logger(`Bot joined the room #${message.guild!.id}`, LogType.INFO);
  return { success: true };
};