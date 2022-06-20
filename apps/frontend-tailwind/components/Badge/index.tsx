import { FC } from 'react';
import clsx from 'clsx';

export interface BadgeProps {
  color: 'blue' | 'green' | 'plain';
}

export const Badge: FC<JSX.IntrinsicElements['div'] & BadgeProps> = ({
  className,
  children,
  color,
  ...rest
}) => {
  const colors = {
    green: 'bg-green-100 text-green-800 dark:bg-green-400  dark:text-green-200',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-400  dark:text-blue-200',
    plain: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-400  dark:text-zinc-200 ',
  };
  return (
    <div
      className={clsx(
        'font-bold text-xs rounded-sm px-1 py-0.5 uppercase whitespace-nowrap dark:bg-opacity-20',
        colors[color]
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
