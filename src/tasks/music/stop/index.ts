import { Message } from 'discord.js';
import { mayUse } from '../../../guard';
import { Room } from '../interface/room.interface';
import { LogType, logger } from '../../../util/logger';
import { isSameChannel, resetRoom } from '../utils';

export default async (
  message: Message,
  map: Record<string, any>,
): Promise<void> => {
  if (!await mayUse('task-stop', message)) return;

  const room: Room = map.get(message.guild!.id);
  if (!await isSameChannel(room, message) || !room) return;

  room.songs = [];
  resetRoom(room);

  logger('The playlist has been stopped.', LogType.INFO);
};
