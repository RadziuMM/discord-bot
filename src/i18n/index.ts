/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import Logger from '../util/logger';
import { LogType } from '../util/logger/enum/log-type.enum';
import CustomError from '../util/error';
import Config from '../config';

const folderPath = './src/i18n/locales';
const getJsonFromFile = (fileName : string) => ({
  [fileName.split('.')[0]]: JSON.parse(`${readFileSync(path.join(folderPath, fileName))}`),
});

const filesInLocales = readdirSync(folderPath).filter((file: string) => path.extname(file) === '.json');
const locales: Record<string, any> = filesInLocales.length > 1
  ? filesInLocales.reduce((previous: any, current: string) => ({
    ...(typeof previous === 'string')
      ? getJsonFromFile(previous)
      : previous,
    ...getJsonFromFile(current),
  })) as unknown as Record<string, unknown>
  : getJsonFromFile(filesInLocales[0]);

if (!locales.en_US) {
  Logger('No primary language found.(en_US.json)', LogType.ERROR);
  throw new CustomError('No primary language found.(en_US.json)');
}

const getTranslation = (
  keychain: string,
  translation: Record<string, any> = locales[Config.lang],
) => {
  if (!keychain.length) return null;
  const keys = keychain.split('.');

  if (keys.length === 1) return translation[keys[0]];
  return keys.reduce((previous: any, current: string, index) => (
    index <= 1
      ? translation[previous][current]
      : previous[current]
  ));
};

const i18n = (_key: string, values = {}): string => {
  let translation = getTranslation(_key);
  if (!translation) {
    Logger(`Key "${_key}" does not exist in ${Config.lang} locale.`, LogType.WARN);
    translation = getTranslation(_key, locales.en_US);
  }

  if (!translation) {
    Logger(`Key "${_key}" does not exist`, LogType.WARN);
  }

  Object.entries(values).forEach(([key, value]) => {
    translation = translation?.replace(`{${key}}`, value);
  });

  return translation || _key;
};

export {
  filesInLocales,
  locales,
  getTranslation,
  i18n,
};
