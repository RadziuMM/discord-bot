import { Message, TextChannel } from 'discord.js';
import { createMessage } from '../../../util/messages';
import { logger, LogType } from '../../../util/logger';
import { mayUse } from '../../../guard';
import { i18n } from '../../../i18n';
import { isSameChannel } from '../utils';
import { Room } from '../interface/room.interface';

export default async (
  message: Message,
  map: Record<string, any>,
): Promise<void> => {
  if (!await mayUse('task-showQueue', message)) return;

  const { id } = message.guild!;
  const room: Room = map.get(id);

  if (!room?.voiceChannel) {
    createMessage(
      message.channel as TextChannel,
      i18n('alert_message.room_not_exist'),
    );
    return;
  }

  if (!await isSameChannel(room, message)) return;
  logger(`Room ${message.guild!.id} song list downloaded.`, LogType.INFO);

  if (!room.songs?.length) {
    createMessage(
      message.channel as TextChannel,
      i18n('message.queue_empty'),
    );
    return;
  }

  let msg = '**Queue** \n';
  const min = Math.min(10, room.songs.length);
  for (let i = 0; i < min; i += 1) {
    msg += i
      ? `#${i} - **${room.songs[i].title}** \n`
      : `${i18n('message.queue_now', { title: room.songs[i].title })} \n`;
  }

  createMessage(message.channel as TextChannel, msg, { timeout: 15 * 1000 });
};
