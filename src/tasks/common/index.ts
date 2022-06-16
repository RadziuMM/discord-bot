import { Message } from 'discord.js';
import test from './test';

export default {
  test: {
    fullComand: 'test',
    shortcut: 't',
    description: 'test',
    method: (message: Message) => test(message),
  },
};
