import { Message } from 'discord.js';
import { mayUse } from '../../../guard';
import { Room } from '../interface/room.interface';
import { LogType, logger } from '../../../util/logger';
import { isSameChannel, resetRoom } from '../utils';

export default async (
  message: Message,
  map: Record<string, any>,
): Promise<void> => {
  if (!await mayUse('task-skip', message)) return;

  const args = message.content.split(' ');
  const skipBy = Math.max(Number(args[1]) || 1, 1);

  const room: Room = map.get(message.guild!.id);
  if (!room || !await isSameChannel(room, message) || !room?.songs?.length) return;

  room.songs = room.songs.slice(skipBy - 1);
  resetRoom(room);

  logger(`Skipped ${skipBy} songs.`, LogType.INFO);
};
