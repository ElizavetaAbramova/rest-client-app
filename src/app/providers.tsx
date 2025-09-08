'use client'

import { useEffect } from 'react'
import { I18nextProvider, useTranslation } from 'react-i18next'
import i18n from '@/lib/i18n'

function HtmlDirSync() {
  const { i18n } = useTranslation()
  useEffect(() => {
    const apply = () => {
      document.documentElement.lang = i18n.language
      document.documentElement.dir = i18n.dir()
    }
    apply()
    i18n.on('languageChanged', apply)
    return () => i18n.off('languageChanged', apply)
  }, [i18n])
  return null
}

function LanguageBootstrap() {
  useEffect(() => {
    try {
      const stored = localStorage.getItem('i18nextLng')
      const target = stored?.startsWith('ru') ? 'ru' : 'en'
      if (i18n.language !== target) i18n.changeLanguage(target)
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') console.error(e)
    }
  }, [])
  return null
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageBootstrap />
      <HtmlDirSync />
      {children}
    </I18nextProvider>
  )
}
