import { render } from '@testing-library/react';

describe('Badge', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<div></div>);
    expect(baseElement).toBeTruthy();
  });
});
