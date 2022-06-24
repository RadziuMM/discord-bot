import { Message, TextChannel } from 'discord.js';
import { getQueue } from '../../../disposer';
import { hasPermissions, isAllowed } from '../../../guard';
import Wheel from '../../../guard/enum/group.enum';
import Permission from '../../../guard/enum/permission.enum';
import { createMessage } from '../../../util/messages';
import { i18n } from '../../../i18n';

export default async (message: Message): Promise<void> => {
  if (
    !await isAllowed(message, [
      Wheel.WHEEL1,
      Wheel.WHEEL2,
      Wheel.ADMIN,
      Wheel.SUPER,
    ]) || !await hasPermissions(message, [Permission.WRITE])
  ) return;

  const id = message?.guild?.id || '';
  const queue = await getQueue(id);

  if (!queue.success) {
    createMessage(
      message.channel as TextChannel,
      i18n('message.error.unknow_error'),
    );
  } else if (!queue.data?.length) {
    createMessage(
      message.channel as TextChannel,
      i18n('message.queue_empty'),
    );
  } else {
    let msg = '**Queue** \n';
    const min = Math.min(10, queue.data.length)
    for(let i = 0; i < min; i++) {
      msg += i 
        ? `#${i} - **${queue.data[i].title}** \n`
        : `${i18n('message.queue_now', { title: queue.data[i].title })} \n`;
    }

    createMessage(message.channel as TextChannel, msg, { timeout: 50 * 1000 });
  }
};