import { Message, TextChannel } from 'discord.js';
import { createMessage } from '../../../util/messages';
import { i18n } from '../../../i18n';
import Wheel from '../../../guard/group.enum';
import guard from '../../../guard';

export default async (message: Message) => {
  if (!guard(message, [Wheel.super])) {
    return createMessage(
      message.channel as TextChannel,
      i18n('alertMessage.msg403'),
      {},
    );
  }

  await createMessage(
    message.channel as TextChannel,
    'Test depercated function :(',
    {
      countdown: 'Test depercated function :(',
    },
  );
};
