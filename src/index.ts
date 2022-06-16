import 'dotenv/config';
import moment from 'moment';
import { Client } from 'discord.js';
import { LogType } from './util/logger/enum/log-type.enum';
import logger from './util/logger';
import CustomError from './util/error';
import tasks from './tasks';
import Config from './config';

moment.locale('');

const main = () => {
  logger('Application initialization', LogType.INFO);

  if (!Config.token) {
    try {
      throw new CustomError('Token has not been entered!');
    } catch (_error) {
      const error: CustomError = _error as CustomError;
      return logger(error.message, LogType.CRITICAL);
    }
  }

  const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'] });

  client.once('ready', () => {
    logger('Connected!', LogType.INFO);
  });

  client.once('reconnecting', () => {
    logger('Reconnecting!', LogType.WARN);
  });

  client.once('disconnect', () => {
    logger('Disconnect!', LogType.INFO);
  });

  client.on('messageCreate', async (message) => {
    if (message.content.startsWith(Config.prefix)) {
      const command = message.content.split(' ')[0].substring(1);
      const tasksArray = Object.values(tasks);
      const task = tasksArray
        .find(({ fullComand, shortcut }) => [fullComand, shortcut].includes(command));

      if (task) task.method(message);
      message.delete();
    }
  });

  return client.login(Config.token);
};

main();
