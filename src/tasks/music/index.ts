import { Message } from 'discord.js';
import { i18n } from '../../i18n';
import showQueue from './showQueue';
import play from './play';
import playNext from './playNext';
import skip from './skip';
import stop from './stop';
import leave from './leave';

export default {
  showQueue: {
    fullComand: 'showPlaylist',
    shortcut: 'spl',
    description: i18n('command_description.showQueue'),
    method: (message: Message) => showQueue(message),
  },
  play: {
    fullComand: 'play',
    shortcut: 'p',
    description: i18n('command_description.play'),
    method: (message: Message) => play(message),
  },
  playNext: {
    fullComand: 'next',
    shortcut: 'n',
    description: i18n('command_description.next'),
    method: (message: Message) => playNext(message),
  },
  skip: {
    fullComand: 'skip',
    shortcut: 'fs',
    description: i18n('command_description.skip'),
    method: (message: Message) => skip(message),
  },
  stop: {
    fullComand: 'stop',
    shortcut: 'stop',
    description: i18n('command_description.stop'),
    method: (message: Message) => stop(message),
  },
  leave: {
    fullComand: 'leave',
    shortcut: 'leave',
    description: i18n('command_description.leave'),
    method: (message: Message) => leave(message),
  },
};
