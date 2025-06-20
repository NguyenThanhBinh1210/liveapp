import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import các file ngôn ngữ
import vi from './locales/vi.json'
import en from './locales/en.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'vi',
    debug: import.meta.env.DEV,
    resources: {
      vi: { translation: vi },
      en: { translation: en }
    },
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
