import { help } from '../tasks/common';

export default {
  help: {
    fullComand: 'help',
    shortcut: 'h',
    description: 'help me step bro i stuck',
    method: (message: unknown) => help(message),
  },
};
