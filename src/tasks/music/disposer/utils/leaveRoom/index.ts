import { Message } from 'discord.js';
import { isSameChannel, resetRoom } from '../..';
import logger from '../../../../../util/logger';
import { LogType } from '../../../../../util/logger/enum/log-type.enum';
import { Response } from '../../interface/response.interface';
import { Room } from '../../interface/room.interface';

export default async (
  message: Message,
  map: Record<string, any>,
): Promise<Response> => {
  const room: Room = map.get(message.guild!.id);
  if (!room || !isSameChannel(room, message)) { return { success: false }; }

  room.songs = [];
  resetRoom(room);

  await room.connection.destroy();
  map.delete(message.guild!.id);

  logger(`Bot left the room #${message.guild!.id}`, LogType.INFO);
  return { success: true };
};
