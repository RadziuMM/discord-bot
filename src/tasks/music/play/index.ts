import { Message, TextChannel } from 'discord.js';
import { createMessage } from '../../../util/messages';
import { i18n } from '../../../i18n';
import { addToQueue } from '../../../disposer';
import { findSongsByArgs } from '../musicTools';
import { hasPermissions, isAllowed } from '../../../guard';
import Permission from '../../../guard/enum/permission.enum';
import Wheel from '../../../guard/enum/group.enum';
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
  args.shift();

  try {
    const songs: any = await findSongsByArgs(message, args);
    if (!songs.length) return;

    logger('Songs found.', LogType.INFO);
    await addToQueue(message, songs.slice(0, 20));
    
    await createMessage(
      message.channel as TextChannel,
      songs.length === 1 
        ? i18n('message.added_song', { title: songs[0].title })
        : i18n('message.added_songs'),
    );
  } catch (error) {
    await createMessage(
      message.channel as TextChannel,
      i18n('alert_message.unknow_error'),
    );
  }
};
