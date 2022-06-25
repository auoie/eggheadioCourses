import { Hamburger } from '../../icons/Hamburger';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import ThemeSwitch from '../ThemeSwitch';

export const Navbar: FC<JSX.IntrinsicElements['div']> = ({
  className,
  children,
  ...props
}) => {
  const { pathname } = useRouter();
  const [menu, setMenu] = useState(false);
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
          'flex flex-col items-center px-4 fixed left-0 right-0 top-0 z-50',
          'bg-white border-zinc-200 dark:bg-zinc-900 border-b dark:border-zinc-800 shadow-xl dark:shadow-zinc-950',
          'nextra-nav-container-blur'
        )}
      >
        <div className="flex items-center max-w-[90rem] w-full mx-auto h-16">
          <div className="flex w-full ">
            <div className="">
              <Link href={'/'}>
                <a
                  className="hover:opacity-50 whitespace-nowrap transition duration-300 font-head font-extrabold text-xl"
                  onClick={() => {
                    setMenu(false);
                  }}
                >
                  egghead.io Courses
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
                      : 'dark:text-zinc-400 text-zinc-500',
                    'hidden md:inline-block'
                  )}
                >
                  {item.label}
                </a>
              </Link>
            ))}
            <ThemeSwitch className="hidden md:inline-block w-[93.5156px]" />
            <button
              className="md:hidden"
              onClick={() => setMenu((menu) => !menu)}
            >
              <Hamburger />
            </button>
          </div>
        </div>
        <div
          className={clsx(
            'w-full space-y-2 pb-2 px-2 md:hidden',
            menu ? 'flex flex-col' : 'hidden'
          )}
        >
          {items.map((item) => (
            <Link href={item.path} key={item.path}>
              <a
                className={clsx(
                  pathname.startsWith(item.path)
                    ? ''
                    : 'dark:text-zinc-400 text-zinc-500',
                  'py-0.5 px-2 rounded-md w-full dark:bg-zinc-800'
                )}
                onClick={() => setMenu((menu) => !menu)}
              >
                {item.label}
              </a>
            </Link>
          ))}
          <div className="">
            <ThemeSwitch className="w-full" />
          </div>
        </div>
      </nav>
    </div>
  );
};
