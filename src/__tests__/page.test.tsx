import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '../app/page';
import RootLayout from '../app/layout';

describe('Main page', () => {
  test('renders main page content', () => {
    render(<Page />);
    expect(screen.getByRole('main')).toBeTruthy();
    expect(screen.getByText('Hi! This is our team')).toBeTruthy();
  });
  test('renders profile cards', async () => {
    render(<Page />);
    expect(screen.getAllByAltText('profile-photo').length).toBe(3);
  });
});

describe('RootLayout', () => {
  test('renders Header, Footer and children', () => {
    vi.mock('@/widgets/Header', () => ({
      default: () => <header>Header</header>,
    }));
    vi.mock('@/widgets/Footer', () => ({
      default: () => <footer>Footer</footer>,
    }));
    render(
      <RootLayout>
        <main>Main Content</main>
      </RootLayout>
    );
    expect(screen.getByText('Header')).toBeTruthy();
    expect(screen.getByText('Footer')).toBeTruthy();
    expect(screen.getByText('Main Content')).toBeTruthy();
  });
});
