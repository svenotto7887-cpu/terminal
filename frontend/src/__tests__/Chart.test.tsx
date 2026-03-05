import { render, screen } from '@testing-library/react';
import Chart from '@/components/Chart';
import { Provider } from 'react-redux';
import { store } from '@/store';

test('renders chart container', () => {
  render(
    <Provider store={store}>
      <Chart pair="SEI/USDC" />
    </Provider>
  );
  const canvas = screen.getByTestId('chart-canvas');
  expect(canvas).toBeInTheDocument();
});
