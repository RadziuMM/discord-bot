import { Message, TextChannel } from 'discord.js';

export interface MessageConstruct {
  id: string,
  textChannel: TextChannel;
  message: Message;
  deleteAfter: number;
  intervalFunction: () => void;
  options: {
    timeout?: number,
    countdown?: string,
  };
}
