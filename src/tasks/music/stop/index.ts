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

  const room: Room = map.get(message.guild!.id);
  if (!isSameChannel(room, message) || !room) return;

  room.songs = [];
  resetRoom(room);

  logger('The playlist has been stopped.', LogType.INFO);
};
