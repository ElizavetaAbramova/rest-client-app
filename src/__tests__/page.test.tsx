import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from '@/widgets/Header'
import Footer from '@/widgets/Footer'

describe('RootLayout', () => {
  it('renders Header, Footer and children', () => {
    render(
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
