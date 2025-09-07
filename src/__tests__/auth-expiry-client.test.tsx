import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AuthExpiryClient from '@/components/AuthExpiryClient'

describe('AuthExpiryClient', () => {
  it('renders its children', () => {
    render(
      <AuthExpiryClient>
        <span data-testid="probe">ok</span>
      </AuthExpiryClient>
    )
    expect(screen.getByTestId('probe')).toBeInTheDocument()
  })
})
