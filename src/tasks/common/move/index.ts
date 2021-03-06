import { Message, TextChannel } from 'discord.js';
import { createMessage } from '../../../util/messages';
import { LogType, logger } from '../../../util/logger';
import { mayUse } from '../../../guard';
import { i18n } from '../../../i18n';

export default async (message: Message): Promise<void> => {
  if (!await mayUse('task-move', message)) return;

  const voiceChannel: any = message.member?.voice?.channel;
  if (!voiceChannel) {
    createMessage(
      message.channel as TextChannel,
      i18n('alert_message.room_not_found'),
    );
    return;
  }

  // no mentions
  const members = message?.mentions?.members;
  if (!members) return;

  try {
    members.forEach((user: any) => {
      if (user.voice.channel) {
        user.voice.setChannel(voiceChannel);
        logger(`User @${user.user.username} has been moved to another room!`, LogType.INFO);
      }
    });
  } catch (error) {
    logger('Error when trying to move users.', LogType.ERROR);
    createMessage(
      message.channel as TextChannel,
      i18n('message.alert_message.unknow_error'),
    );
  }
};
