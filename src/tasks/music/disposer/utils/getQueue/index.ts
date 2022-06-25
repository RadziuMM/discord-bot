import { Message } from 'discord.js';
import { isSameChannel } from '../..';
import { i18n } from '../../../../../i18n';
import logger from '../../../../../util/logger';
import { LogType } from '../../../../../util/logger/enum/log-type.enum';
import { Response } from '../../interface/response.interface';
import { Room } from '../../interface/room.interface';

export default async(
  message: Message,
  map: Record<string, any>,
): Promise<Response> => {
  const room: Room = map.get(message.guild!.id);

  logger(`Room ${message.guild!.id} song list downloaded.`, LogType.INFO);
  return { 
    success: (room && await isSameChannel(room, message)),
    ...room ? { data: { songs: room.songs } } : {},
    ...await isSameChannel(room, message) ? { message: i18n('alert_message.room_not_exist') } : {},
  };
};