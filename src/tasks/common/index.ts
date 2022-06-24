import { Message } from 'discord.js';
import { i18n } from '../../i18n';
import move from './move';
import deleteMessages from './deleteMessages';

export default {
  move: {
    fullComand: 'move',
    shortcut: 'm',
    description: i18n('command_description.move'),
    method: (message: Message) => move(message),
  },
  deleteMessages: {
    fullComand: 'clear',
    shortcut: 'c',
    description: i18n('command_description.clear'),
    method: (message: Message) => deleteMessages(message),
  },
};
