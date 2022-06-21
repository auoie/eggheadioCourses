import { render } from '@testing-library/react';

describe('Pagination', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<div></div>);
    expect(baseElement).toBeTruthy();
  });
});
