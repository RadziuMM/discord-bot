import { Message } from 'discord.js';
import { hasPermissions, isAllowed } from '../../../guard';
import Wheel from '../../../guard/enum/group.enum';
import Permission from '../../../guard/enum/permission.enum';
import logger from '../../../util/logger';
import { LogType } from '../../../util/logger/enum/log-type.enum';

export default async (message: Message): Promise<void> => {
  if (
    !await isAllowed(message, [
      Wheel.ADMIN,
      Wheel.SUPER,
    ]) || !await hasPermissions(message, [Permission.WRITE])
  ) return;

  /* eslint-disable no-restricted-globals */
  const args: any = message.content.split(' ');
  const amount = args[1] && !isNaN(args[1])
    ? Math.min(parseInt(args[1], 10), 100)
    : 5;

  const messageChannel: any = message.channel;
  await messageChannel.bulkDelete(amount, true)
    .then((messages: any) => logger(`Deleted ${messages.size} messages`, LogType.INFO))
    .catch((error: any) => logger(`Delete error: ${error.message} \n ${error}`, LogType.ERROR));
};
