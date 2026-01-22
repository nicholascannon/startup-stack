import { render, screen } from '@testing-library/react';
import { App } from '../app';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Startup Stack')).toBeVisible();
  });
});
