import { describe, it, beforeEach, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithI18n } from './test-utils'
import i18n from '@/lib/i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher'

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    i18n.changeLanguage('en')
    try { localStorage.removeItem('i18nextLng') } catch (_e) { void _e }
  })

  it('toggles language EN <-> RU', async () => {
    renderWithI18n(<LanguageSwitcher />)

    const triggerEn = screen.getByRole('button', { name: /en/i })
    expect(i18n.language).toMatch(/^en/)

    fireEvent.click(triggerEn)
    const ruOption = await screen.findByRole('option', { name: /ru/i })
    fireEvent.click(ruOption)
    expect(i18n.language).toMatch(/^ru/)

    const triggerRu = screen.getByRole('button', { name: /ru/i })
    fireEvent.click(triggerRu)
    const enOption = await screen.findByRole('option', { name: /en/i })
    fireEvent.click(enOption)
    expect(i18n.language).toMatch(/^en/)
  })
})
