import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import CodeGenerator from '../components/CodeGenerator';
import { convert, getLanguageList, Language } from 'postman-code-generators';
import { Props } from '../../types/CodeGeneratorProps';

vi.mock('postman-code-generators', () => {
  return {
    getLanguageList: vi.fn(),
    convert: vi.fn(),
  };
});

const getLanguageListMock = vi.mocked(getLanguageList);
const convertMock = vi.mocked(convert);

describe('CodeGenerator', () => {
  const mockLanguages: Language[] = [
    {
      key: 'javascript',
      label: 'JavaScript',
      syntax_mode: '',
      variants: [{ key: 'fetch' }, { key: 'axios' }],
    },
    {
      key: 'python',
      label: 'Python',
      syntax_mode: '',
      variants: [{ key: 'requests' }],
    },
  ];

  const defaultProps: Props = {
    url: 'https://api.example.com',
    method: 'POST',
    json: '{"foo":"bar"}',
    headers: [{ key: 'Authorization', value: 'Bearer token' }],
  };
  getLanguageListMock.mockReturnValue(mockLanguages);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders language and variants list', () => {
    render(<CodeGenerator {...defaultProps} />);

    expect(screen.getByLabelText('select-language')).toBeInTheDocument();
    expect(screen.getByLabelText('select-variant')).toBeInTheDocument();
  });

  it('generate code by default in first language in list', async () => {
    convertMock.mockImplementation((_lang, _variant, _req, _opts, cb) => {
      cb(null, 'some generated code');
    });

    render(<CodeGenerator {...defaultProps} />);

    expect(convertMock).toHaveBeenCalled();
    expect(screen.getByLabelText('select-language')).toHaveValue('javascript');
    expect(screen.getByLabelText('select-variant')).toHaveValue('fetch');

    await screen.findByText('some generated code');
  });

  it('change language triggers re-generate code', () => {
    convertMock.mockImplementation((lang, variant, _req, _opts, cb) => {
      if (lang === 'javascript' && variant === 'fetch') {
        cb(null, 'js fetch code');
      }
      if (lang === 'python' && variant === 'requests') {
        cb(null, 'python requests code');
      }
    });

    render(<CodeGenerator {...defaultProps} />);

    fireEvent.change(screen.getByLabelText('select-language'), {
      target: { value: 'python' },
    });

    expect(convertMock).toHaveBeenCalledWith(
      'python',
      'requests',
      expect.anything(),
      expect.anything(),
      expect.any(Function)
    );

    expect(screen.getByText('python requests code')).toBeInTheDocument();
    expect(screen.getByLabelText('select-language')).toHaveValue('python');
    expect(screen.getByLabelText('select-variant')).toHaveValue('requests');
  });

  it('shows error message if convert catch error', async () => {
    convertMock.mockImplementation((_lang, _variant, _req, _opts, cb) => {
      cb(new Error('fail'), '');
    });

    render(<CodeGenerator {...defaultProps} />);

    expect(screen.getByText('Error: incorrect request')).toBeInTheDocument();
    expect(screen.queryByText('some generated code')).not.toBeInTheDocument();
  });

  it('copies code in clipboard', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
    convertMock.mockImplementation((_lang, _variant, _req, _opts, cb) => {
      cb(null, 'some code');
    });

    render(<CodeGenerator {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('copy-button'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('some code');
  });
});
