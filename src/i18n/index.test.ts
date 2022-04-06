import {
  getTranslation,
  filesInLocales,
  locales,
} from './index';

describe('i18n', () => {
  test('does each file have its own locale', async () => {
    expect(filesInLocales.length).toBe(Object.keys(locales).length);
  });

  test('get translation', () => {
    expect(getTranslation('test')).toBe('200');
  });
});
