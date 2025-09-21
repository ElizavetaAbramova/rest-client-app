import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyHistory from '@/components/EmptyHistory';

describe('EmptyHistory component', () => {
  const mockNavigator = vi.fn();
  const props = {
    onClickNavigator: mockNavigator,
    header: 'No Requests Yet',
    text: 'Your request history is empty.',
    clickLabel: 'Client',
    varLabel: 'Variables',
  };

  it('renders header, text and buttons', () => {
    render(<EmptyHistory {...props} />);
    expect(screen.getByText(props.header)).toBeInTheDocument();
    expect(screen.getByText(props.text)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: props.clickLabel })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: props.varLabel })
    ).toBeInTheDocument();
  });

  it('calls onClickNavigator with "/client" when the client button is clicked', () => {
    render(<EmptyHistory {...props} />);

    fireEvent.click(screen.getByRole('button', { name: props.clickLabel }));
    expect(mockNavigator).toHaveBeenCalledWith('/client');
  });

  it('calls onClickNavigator with "/variables" when the variables button is clicked', () => {
    render(<EmptyHistory {...props} />);

    fireEvent.click(screen.getByRole('button', { name: props.varLabel }));
    expect(mockNavigator).toHaveBeenCalledWith('/variables');
  });
});
