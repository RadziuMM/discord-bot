import { Message } from 'discord.js';
import { isSameChannel, resetRoom } from '../..';
import logger from '../../../../../util/logger';
import { LogType } from '../../../../../util/logger/enum/log-type.enum';
import { Response } from '../../interface/response.interface';
import { Room } from '../../interface/room.interface';

export default async(
  message: Message,
  map: Record<string, any>,
): Promise<Response> => {
  const room: Room = map.get(message.guild!.id);
  if (!isSameChannel(room, message) || !room)
    return { success: false };

  room.songs = [];
  resetRoom(room);

  logger(`The playlist has been stopped.`, LogType.INFO);
  return { success: true };
}