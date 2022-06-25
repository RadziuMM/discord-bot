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

  const { success, data, message: _message } = await getQueue(message);
  
  if (!success && _message) {
    createMessage(message.channel as TextChannel, _message);
  } else if (!data?.length) {
    createMessage(
      message.channel as TextChannel,
      i18n('message.queue_empty'),
    );
  } else {
    let msg = '**Queue** \n';
    const min = Math.min(10, data.length)
    for(let i = 0; i < min; i++) {
      msg += i 
        ? `#${i} - **${data[i].title}** \n`
        : `${i18n('message.queue_now', { title: data[i].title })} \n`;
    }

    createMessage(message.channel as TextChannel, msg, { timeout: 50 * 1000 });
  }
};