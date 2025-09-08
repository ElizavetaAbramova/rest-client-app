import Footer from '@/widgets/Footer';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

describe('Footer', () => {
  test('renders links and copyright text', () => {
    render(<Footer />);
    expect(screen.getAllByRole('link').length).toBe(2);
    expect(screen.findByText('Copyright')).toBeTruthy();
  });
});
