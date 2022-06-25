import { Message } from 'discord.js';
import {
  addToQueue, isSameChannel, joinRoom, play,
} from '../..';
import logger from '../../../../../util/logger';
import { LogType } from '../../../../../util/logger/enum/log-type.enum';
import { Response } from '../../interface/response.interface';
import { Room } from '../../interface/room.interface';
import { Song } from '../../interface/song.interface';

export default async (
  message: Message,
  newSongs: Song[],
  map: Record<string, any>,
): Promise<Response|Promise<Response>> => {
  const room: Room = map.get(message.guild!.id);
  if (!isSameChannel(room, message)) { return { success: false }; }

  if (!room || !room?.voiceChannel) {
    await joinRoom(message);
    return addToQueue(message, newSongs);
  }

  if (!room.songs.length) {
    room.songs = newSongs;
    return play(message.guild!.id);
  }

  const songs = [...room.songs];
  const firstSong = songs.shift() as Song;

  room.songs = [firstSong, ...newSongs, ...songs];
  if (!room.songs.length) play(message.guild!.id);

  logger('New songs added as next.', LogType.INFO);
  return { success: true };
};
