import { Message } from 'discord.js';
import { resetRoom } from '../..';
import logger from '../../../../../util/logger';
import { LogType } from '../../../../../util/logger/enum/log-type.enum';
import { Response } from '../../interface/response.interface';
import { Room } from '../../interface/room.interface';
import isSameChannel from '../isSameChannel';

export default async (
  message: Message,
  skipBy: number,
  map: Record<string, any>,
): Promise<Response> => {
  const room: Room = map.get(message.guild!.id);
  if (!room || !isSameChannel(room, message) || !room?.songs?.length) { return { success: false }; }

  room.songs = room.songs.slice(skipBy - 1);
  resetRoom(room);

  logger(`Skipped ${skipBy} songs.`, LogType.INFO);
  return { success: true };
};
