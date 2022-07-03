import { Message } from 'discord.js';
import { logger, LogType } from '../../../../util/logger';
import { isSameChannel, joinRoom, run } from '..';
import { TaskStatus } from '../../interface/task-status.interface';
import { Room } from '../../interface/room.interface';
import { Song } from '../../interface/song.interface';

export default async (
  message: Message,
  songs: Song[],
  map: Record<string, any>,
): Promise<TaskStatus> => {
  const { id } = message.guild!;
  let room: Room = map.get(id);

  if (!room?.voiceChannel) {
    room = await joinRoom(message, map);
  }

  if (!isSameChannel(room, message)) {
    return { success: false };
  }

  songs.forEach(async (song: Song) => room.songs.push(song));
  if (!room.isPlaying) run(id, map);

  logger('Songs added to queue.', LogType.INFO);
  return { success: true };
};
