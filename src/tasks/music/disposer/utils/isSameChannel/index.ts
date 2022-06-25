import { Message, TextChannel } from 'discord.js';
import { i18n } from '../../../../../i18n';
import logger from '../../../../../util/logger';
import { LogType } from '../../../../../util/logger/enum/log-type.enum';
import { createMessage } from '../../../../../util/messages';
import { Room } from '../../interface/room.interface';

export default async(
  room: Room,
  message: Message,
): Promise<boolean> => {
  if (!room || room.voiceChannel !== message.member!.voice.channel) {
    createMessage(
      message.channel as TextChannel,
      i18n('alert_message.not_in_same_channel'),
    );

    logger(`The user was in a different room from the bot.`, LogType.INFO);
    return false;
  }

  return true;
};