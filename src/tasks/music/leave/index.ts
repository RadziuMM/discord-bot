import { Message } from 'discord.js';
import { mayUse } from '../../../guard';
import { leaveRoom } from '../utils';

export default async (
  message: Message,
  map: Record<string, any>,
): Promise<void> => {
  if (!await mayUse('task-leave', message)) return;
  await leaveRoom(message, map);
};
