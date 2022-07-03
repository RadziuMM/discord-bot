import { Message } from 'discord.js';
import { i18n } from '../../i18n';
import showQueue from './showQueue';
import play from './play';
import playNext from './playNext';
import skip from './skip';
import stop from './stop';
import leave from './leave';

const map: Map<string, any> = new Map();

export default {
  showQueue: {
    fullComand: 'list',
    shortcut: 'l',
    description: i18n('command_description.showQueue'),
    method: (message: Message) => showQueue(message, map),
  },
  play: {
    fullComand: 'play',
    shortcut: 'p',
    description: i18n('command_description.play'),
    method: (message: Message): Promise<any> => play(message, map),
  },
  playNext: {
    fullComand: 'next',
    shortcut: 'n',
    description: i18n('command_description.next'),
    method: (message: Message) => playNext(message, map),
  },
  skip: {
    fullComand: 'skip',
    shortcut: 'fs',
    description: i18n('command_description.skip'),
    method: (message: Message) => skip(message, map),
  },
  stop: {
    fullComand: 'stop',
    shortcut: 'stop',
    description: i18n('command_description.stop'),
    method: (message: Message) => stop(message, map),
  },
  leave: {
    fullComand: 'leave',
    shortcut: 'leave',
    description: i18n('command_description.leave'),
    method: (message: Message) => leave(message, map),
  },
};
