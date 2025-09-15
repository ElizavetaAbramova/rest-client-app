import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '../app/not-found';

describe('Error-404 page', () => {
  test('renders page content', () => {
    render(<Page />);
    expect(screen.getByRole('img')).toBeTruthy();
    expect(screen.getByText('Back to home')).toBeTruthy();
    expect(
      screen.getByText(
        'Sorry, page not found. Probably wrong URL. Probably page stolen by aliens.'
      )
    ).toBeTruthy();
  });
});
