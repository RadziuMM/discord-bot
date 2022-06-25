import { Message, TextChannel } from 'discord.js';
import { getQueue } from '../disposer';
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
  } else if (data?.songs && !data?.songs?.length) {
    createMessage(
      message.channel as TextChannel,
      i18n('message.queue_empty'),
    );
  } else if (data?.songs) {
    let msg = '**Queue** \n';
    const min = Math.min(10, data.songs.length);
    for (let i = 0; i < min; i += 1) {
      msg += i
        ? `#${i} - **${data.songs[i].title}** \n`
        : `${i18n('message.queue_now', { title: data.songs[i].title })} \n`;
    }

    createMessage(message.channel as TextChannel, msg, { timeout: 15 * 1000 });
  }
};
