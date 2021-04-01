import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import ko from './ko.json';
import en from './en.json';
import ja from './ja.json';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async cb => {
    const language = await RNLocalize.getLocales()[0].languageCode;
    cb(language);
    initReactI18next;
  },
  init: () => {},
  cacheUserLanguage: () => {}
};

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ko',
    debug: true,
    resources: { ko, en, ja },
    react: {
      useSuspense: false
    }
  });
export default i18next;
