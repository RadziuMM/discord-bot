import { Message } from 'discord.js';
import {
  hasPermissions, isAllowed, Permission, Wheel,
} from '../../../guard';
import { Room } from '../interface/room.interface';
import { LogType, logger } from '../../../util/logger';
import { isSameChannel, resetRoom } from '../utils';

export default async (
  message: Message,
  map: Record<string, any>,
): Promise<void> => {
  if (
    !await isAllowed(message, [
      Wheel.WHEEL1,
      Wheel.WHEEL2,
      Wheel.ADMIN,
      Wheel.SUPER,
    ]) || !await hasPermissions(message, [
      Permission.WRITE,
      Permission.CONNECT,
      Permission.SPEAK,
    ])
  ) return;

  const args = message.content.split(' ');
  const skipBy = Math.max(Number(args[1]) || 1, 1);

  const room: Room = map.get(message.guild!.id);
  if (!room || !isSameChannel(room, message) || !room?.songs?.length) return;

  room.songs = room.songs.slice(skipBy - 1);
  resetRoom(room);

  logger(`Skipped ${skipBy} songs.`, LogType.INFO);
};
