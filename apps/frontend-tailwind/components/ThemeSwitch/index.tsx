import { Listbox, Transition } from '@headlessui/react';
import React, { FC } from 'react';
import clsx from 'clsx';
import { Moon } from '../../icons/Moon';
import { Sun } from '../../icons/Sun';
import { useMountedTheme } from '../../hooks/useMountedTheme';
import { Check } from '../../icons/Check';
type SetThemeProps = unknown;
const ThemeSwitch: FC<SetThemeProps> = () => {
  const { theme, setTheme, resolvedTheme } = useMountedTheme();
  const options = [
    {
      key: 'light',
      name: 'Light',
    },
    {
      key: 'dark',
      name: 'Dark',
    },
    {
      key: 'system',
      name: 'System',
    },
  ] as const;
  const selectedOption = options.find((option) => option.key === theme);
  return (
    <div className="relative">
      <Listbox
        value={selectedOption}
        onChange={(option: typeof options[number]) => {
          setTheme(option.key);
        }}
      >
        {({ open }) => (
          <>
            <Listbox.Button
              className={clsx(
                'rounded-md px-2 h-7 transition-colors flex items-center',
                open
                  ? 'bg-zinc-900 bg-opacity-10 dark:bg-zinc-100 dark:bg-opacity-10'
                  : 'hover:bg-zinc-900 hover:bg-opacity-5 dark:hover:bg-zinc-100 dark:hover:bg-opacity-5'
              )}
            >
              <div className="h-3 w-3 mr-2">
                {resolvedTheme === 'dark' ? (
                  <Moon height={12} width={12} />
                ) : resolvedTheme === 'light' ? (
                  <Sun height={12} width={12} />
                ) : (
                  ''
                )}
              </div>
              {selectedOption?.name}
            </Listbox.Button>
            <Transition
              show={open}
              as={React.Fragment}
              leave={'transition'}
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className={clsx(
                  'absolute py-1 right-0 top-[130%] bg-white dark:bg-zinc-800 dark:ring-white rounded-md ring-1 ring-black ring-opacity-5 dark:ring-opacity-20 text-sm focus:outline-none'
                )}
              >
                {options.map((option) => (
                  <Listbox.Option
                    key={option.key}
                    value={option}
                    className={({ active, selected }) =>
                      clsx(
                        selected ? '' : '',
                        active
                          ? 'dark:bg-zinc-100 dark:bg-opacity-10  bg-zinc-900 bg-opacity-10'
                          : 'dark:text-zinc-100 text-zinc-800',
                        'px-3 py-1.5 relative whitespace-nowrap select-none pr-9'
                      )
                    }
                  >
                    {option.name}
                    {option.key === selectedOption?.key && (
                      <span className="absolute right-0 pr-3 flex items-center justify-center inset-y-0">
                        <Check height={12} width={12} />
                      </span>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  );
};

export default ThemeSwitch;