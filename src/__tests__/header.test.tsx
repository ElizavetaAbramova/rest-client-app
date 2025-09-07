import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from '@/widgets/Header'

describe('Header', () => {
  it('renders nav buttons', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
  })
})
