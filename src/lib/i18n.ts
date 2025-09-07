'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '@/locales/en/common'
import ru from '@/locales/ru/common'

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: { en: { translation: en }, ru: { translation: ru } },
      lng: 'en',
      fallbackLng: 'en',
      interpolation: { escapeValue: false }
    })
}

export default i18n
