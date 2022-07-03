import { Message, TextChannel } from 'discord.js';
import { createMessage } from '../../../util/messages';
import { i18n } from '../../../i18n';
import {
  hasPermissions, isAllowed, Permission, Wheel,
} from '../../../guard';
import { LogType, logger } from '../../../util/logger';
import { Song } from '../interface/song.interface';
import { addToQueue, findSongsByArguments } from '../utils';

export default async (
  message: Message,
  map: Record<string, any>,
): Promise<void> => {
  if (
    !await isAllowed(message, [
      Wheel.WHEEL1,
      Wheel.WHEEL2,
      Wheel.ADMIN,
      Wheel.SUPER,
    ]) || !await hasPermissions(message, [
      Permission.WRITE,
      Permission.CONNECT,
      Permission.SPEAK,
    ])
  ) return;

  const args = message.content.split(' ');
  args.shift();

  try {
    const songs: Song[] = await findSongsByArguments(message, args);
    if (!songs.length) return;
    logger('Songs found.', LogType.INFO);

    const { success } = await addToQueue(message, songs.slice(0, 20), map);
    if (!success) return;

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
