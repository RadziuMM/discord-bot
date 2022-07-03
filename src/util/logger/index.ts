import moment from 'moment';
import 'moment/locale/pl';
import { appendFile } from 'fs';
import { LogType } from './enum/log-type.enum';

import Config from '../../config/index';

const mods = {
  [LogType.CRITICAL]: '\x1b[31m%s\x1b[0m',
  [LogType.ERROR]: '\x1b[31m%s\x1b[0m',
  [LogType.WARN]: '\x1b[33m%s\x1b[0m',
  [LogType.INFO]: '\x1b[32m%s\x1b[0m',
};

const logger = (text: string, type?: LogType) => {
  const date = new Date();

  const time = moment(date).format('DD-MM-YYYY HH:mm:ss');
  const value = `[${time}][${type || 'log'}]: ${text}`;

  const today = moment(date).format('YYYY-MM-DD');
  appendFile(`logs/${today}.log`, `${value} \n`, (err) => {
    if (err) throw err;
  });

  if (Config.debug) {
    const mod = mods[type || LogType.INFO];
    console.log(mod, value); // eslint-disable-line no-console
  }

  return value;
};

export {
  LogType,
  logger,
};
