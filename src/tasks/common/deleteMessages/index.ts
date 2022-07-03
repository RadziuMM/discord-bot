import { Message } from 'discord.js';
import { LogType, logger } from '../../../util/logger';
import { mayUse } from '../../../guard';

export default async (message: Message): Promise<void> => {
  if (!await mayUse('task-deleteMessages', message)) return;

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
