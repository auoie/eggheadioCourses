import { FC } from 'react';

export const Check: FC<JSX.IntrinsicElements['svg']> = ({ ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
