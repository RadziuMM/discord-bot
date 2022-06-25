import { Message, TextChannel } from 'discord.js';
import { skip } from '../../../disposer';
import { hasPermissions, isAllowed } from '../../../guard';
import Wheel from '../../../guard/enum/group.enum';
import Permission from '../../../guard/enum/permission.enum';
import logger from '../../../util/logger';
import { LogType } from '../../../util/logger/enum/log-type.enum';

export default async (message: Message): Promise<void> => {
  if (
    !await isAllowed(message, [
      Wheel.WHEEL1,
      Wheel.WHEEL2,
      Wheel.ADMIN,
      Wheel.SUPER,
    ]) || !await hasPermissions(message,[
      Permission.WRITE,
      Permission.CONNECT,
      Permission.SPEAK
    ])
  ) return;
  
  const args = message.content.split(' ');  
  const skipBy = Math.max(Number(args[1]) || 1, 1);
  
  // skip counting songs from 0;
  await skip(message, skipBy - 1);
  logger(`Skipped ${skipBy} songs.`, LogType.INFO);
};