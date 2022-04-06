import 'dotenv/config';
import moment from 'moment';
import { Client } from 'discord.js';
import Logger from './util/logger';
import { LogType } from './util/logger/enum/log-type.enum';
import CustomError from './util/error';
import Config from './config';

moment.locale('');

const main = () => {
  Logger('Application initialization', LogType.INFO);

  if (!Config.token) {
    try {
      throw new CustomError('Token has not been entered!');
    } catch (_error) {
      const error: CustomError = _error as CustomError;
      return Logger(error.message, LogType.CRITICAL);
    }
  }

  const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'] });

  client.once('ready', () => {
    Logger('Connected!', LogType.INFO);
  });

  client.once('reconnecting', () => {
    Logger('Reconnecting!', LogType.WARN);
  });

  client.once('disconnect', () => {
    Logger('Disconnect!', LogType.INFO);
  });

  client.on('messageCreate', async (message) => {
    if (message.content.startsWith(Config.prefix)) {
      const command = message.content.split(' ')[0].substring(1);
      const tasksArray = Object.values(Config.commands);
      const task = tasksArray
        .find(({ fullComand, shortcut }) => [fullComand, shortcut].includes(command));

      if (task) return task.method(message);
    }
  });

  return client.login(Config.token);
};

main();
