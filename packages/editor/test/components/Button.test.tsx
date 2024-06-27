import React from 'react';
import { render } from '@testing-library/react';
import { describe, test, expect } from 'vitest'

describe('Button Test', () => {
  test('Button', () => {
    let button = render(<button>Button</button>);
    const { container } = button;

    expect(button.getByText('Button'));
    expect(container.classList.contains('Root__Button'));
  });
});
