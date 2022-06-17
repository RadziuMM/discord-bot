import { Message } from 'discord.js';
import { leaveRoom } from '../../../disposer';
import { hasPermissions, isAllowed } from '../../../guard';
import Wheel from '../../../guard/enum/group.enum';
import Permission from '../../../guard/enum/permission.enum';

export default async (message: Message): Promise<void> => {
  if (
    !await isAllowed(message, [
      Wheel.WHEEL1,
      Wheel.WHEEL2,
      Wheel.ADMIN,
      Wheel.SUPER
    ]) || !await hasPermissions(message, [Permission.WRITE])
  ) return;

  const id = message?.guild?.id || '';
  await leaveRoom(id);
};