import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import ThemeSwitch from '../ThemeSwitch';

export const Navbar: FC<JSX.IntrinsicElements['div']> = ({
  className,
  children,
  ...props
}) => {
  const { pathname } = useRouter();
  const items = [{ path: '/about', label: 'About' }] as const;
  return (
    <div
      className={clsx(
        'bg-transparent dark:bg-transparent nextra-nav-container',
        className
      )}
      {...props}
    >
      <nav
        className={clsx(
          'h-16 flex items-center px-4 fixed left-0 right-0 top-0',
          'bg-white border-zinc-200 dark:bg-zinc-900 border-b dark:border-zinc-800 shadow-md',
          'nextra-nav-container-blur'
        )}
      >
        <div className="flex items-center max-w-[90rem] w-full mx-auto">
          <div className="flex w-full ">
            <div className="font-extrabold">
              <Link href={'/'}>
                <a className="hover:opacity-75 whitespace-nowrap">
                  Egghead IO Courses
                </a>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {items.map((item) => (
              <Link href={item.path} key={item.path}>
                <a
                  className={clsx(
                    pathname.startsWith(item.path)
                      ? ''
                      : 'dark:text-zinc-400 text-zinc-500'
                  )}
                >
                  {item.label}
                </a>
              </Link>
            ))}
            <ThemeSwitch className="ring-1 ring-zinc-200 dark:ring-zinc-800" />
          </div>
        </div>
      </nav>
    </div>
  );
};
