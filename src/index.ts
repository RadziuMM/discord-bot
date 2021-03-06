import 'dotenv/config';
import moment from 'moment';
import { Client } from 'discord.js';
import { LogType, logger } from './util/logger';
import tasks from './tasks';
import Config from './config';

moment.locale('');

const main = () => {
  logger('Application initialization', LogType.INFO);

  if (!Config.token) {
    return logger('Token has not been entered!', LogType.CRITICAL);
  }

  const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'] });
  client.once('ready', (): any => logger('Connected!', LogType.INFO));
  client.once('reconnecting', (): any => logger('Reconnecting!', LogType.WARN));
  client.once('disconnect', (): any => logger('Disconnect!', LogType.INFO));

  client.on('messageCreate', async (message) => {
    if (message.content.startsWith(Config.prefix)) {
      const command = message.content.split(' ')[0].substring(1);
      const tasksArray = Object.values(tasks);
      const task = tasksArray
        .find(({ fullComand, shortcut }) => [fullComand, shortcut].includes(command));

      if (task) {
        task.method(message);
        logger(`#${message.guild?.name}: @${message.author.username}: !${command} - full request: "${message.content}"`, LogType.INFO);
      }

      message.delete();
    }
  });

  return client.login(Config.token);
};

main();
