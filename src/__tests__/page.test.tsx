import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithI18n } from './test-utils'
import Header from '@/widgets/Header'
import Footer from '@/widgets/Footer'

describe('RootLayout', () => {
  it('renders Header, Footer and children', () => {
    renderWithI18n(
      <>
        <Header />
        <div>Content</div>
        <Footer />
      </>
    )
    expect(screen.getByText(/REST Client/i)).toBeInTheDocument()
    expect(screen.getByText(/All right reserved/i)).toBeInTheDocument()
    expect(screen.getByText(/Content/i)).toBeInTheDocument()
  })
})
