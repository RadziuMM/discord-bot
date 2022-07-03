import { Message } from 'discord.js';
import { isSameChannel, resetRoom } from '..';
import { logger, LogType } from '../../../../util/logger';
import { Room } from '../../interface/room.interface';

export default async (message: Message, map: Record<string, any>) => {
  const room: Room = map.get(message.guild!.id);
  if (!room || !await isSameChannel(room, message)) return;

  room.songs = [];
  resetRoom(room);

  await room.connection.destroy();
  map.delete(message.guild!.id);

  logger(`Bot left the room #${message.guild!.id}`, LogType.INFO);
};
