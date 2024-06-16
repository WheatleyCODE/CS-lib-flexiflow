import { render, screen } from '@testing-library/react';
import {App} from './App';

describe('App', () => {
  test('Render', async () => {
    render(<App />);
    expect(screen.getByText('Flexiflow')).toBeInTheDocument();
  });
});