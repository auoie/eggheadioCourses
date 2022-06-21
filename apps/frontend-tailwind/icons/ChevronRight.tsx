import { FC } from 'react';

export const ChevronRight: FC<JSX.IntrinsicElements['svg']> = ({
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m 11 16  4 -4 -4 -4" />
    <circle xmlns="http://www.w3.org/2000/svg" cx="12" cy="12" r="10" />
  </svg>
);
