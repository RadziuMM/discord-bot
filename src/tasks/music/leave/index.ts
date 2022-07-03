import { Message } from 'discord.js';
import {
  hasPermissions, isAllowed, Permission, Wheel,
} from '../../../guard';
import { leaveRoom } from '../utils';

export default async (
  message: Message,
  map: Record<string, any>,
): Promise<void> => {
  const allowedGroups = [Wheel.WHEEL1, Wheel.WHEEL2, Wheel.ADMIN, Wheel.SUPER];
  const premissions = [Permission.WRITE];

  if (
    !await isAllowed(message, allowedGroups)
    || !await hasPermissions(message, premissions)
  ) return;

  await leaveRoom(message, map);
};
