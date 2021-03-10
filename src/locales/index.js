import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import ko from './ko.json';
import en from './en.json';
import jp from './jp.json';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async cb => {
    cb(RNLocalize.getLocales()[0].languageCode);

    // const preferredLang = await AsyncStorage.getItem('language');
    // if (preferredLang) {
    //   cb(preferredLang);
    // } else {
    //   console.log('lang', RNLocalize.getLocales()[0].languageCode);
    //   cb(RNLocalize.getLocales()[0].languageCode);
    // }
    initReactI18next
    
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
    resources: { ko, en, jp },
    react: {
      useSuspense: false
    }
  });
export default i18next;
