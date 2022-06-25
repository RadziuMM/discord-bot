import { Message } from 'discord.js';
import { addToQueue, isSameChannel, joinRoom, play } from '../..';
import logger from '../../../../../util/logger';
import { LogType } from '../../../../../util/logger/enum/log-type.enum';
import { Response } from '../../interface/response.interface';
import { Room } from '../../interface/room.interface';
import { Song } from '../../interface/song.interface';

export default async(
  message: Message,
  songs: Song[],
  map: Record<string, any>,
): Promise<Response> => {
  const room: Room = map.get(message.guild!.id);
  if (!room?.voiceChannel) {
    await joinRoom(message);
    return addToQueue(message, songs);
  }

  if (!isSameChannel(room, message))
    return { success: false };

  songs.forEach(async(song: Song) => room.songs.push(song));
  if (!room.isPlaying) play(message.guild!.id);
  
  logger(`Songs added to queue.`, LogType.INFO);
  return { success: true };
};