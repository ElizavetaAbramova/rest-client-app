'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = useMemo(() => (i18n.language?.startsWith('ru') ? 'ru' : 'en'), [i18n.language])
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!btnRef.current) return
      if (e.target instanceof Node && !btnRef.current.parentElement?.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const options = [
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' },
  ]

  function choose(code: string) {
    if (!i18n.language?.startsWith(code)) i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className="btn btn-soft btn-primary rounded-sm px-3 hover:ring-2 hover:ring-sky-400 hover:shadow-lg hover:shadow-sky-400/30"
        aria-haspopup="listbox"
        aria-expanded={open}
        title={current.toUpperCase()}
      >
        {current.toUpperCase()}
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-24 overflow-y-auto max-h-48 rounded-sm border border-slate-700 bg-base-200 shadow-lg"
        >
          {options.map(opt => (
            <button
              key={opt.code}
              role="option"
              aria-selected={current === opt.code}
              onClick={() => choose(opt.code)}
              className={`btn btn-ghost btn-sm w-full justify-between rounded-none transition-colors ${
                current === opt.code ? 'bg-base-300' : ''
              } hover:bg-sky-900/40 hover:text-sky-200`}
              type="button"
              title={`Switch to ${opt.label}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
