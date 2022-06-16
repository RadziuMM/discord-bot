import moment from 'moment';
import logger from './index';
import { LogType } from './enum/log-type.enum';

const cases = [
  ['error text', LogType.ERROR],
  ['warnig test', LogType.WARN],
  ['info test', LogType.INFO],
  ['test', null],
];

describe('logger', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  test.each(cases)('text: %p | type: %p', (text, type: any) => {
    const date = new Date();
    const time = moment(date).format('DD-MM-YYYY HH:mm:ss');

    const value = `[${time}][${type || 'log'}]: ${text}`;
    expect(logger(`${text}`, type)).toBe(value);
  });
});
