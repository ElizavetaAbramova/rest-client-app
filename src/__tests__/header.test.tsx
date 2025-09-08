import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithI18n } from './test-utils'
import Header from '@/widgets/Header'

describe('Header', () => {
  it('renders nav buttons', () => {
    renderWithI18n(<Header />)
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
  })
})
