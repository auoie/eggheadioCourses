import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown } from '../../icons/ChevronDown';
import clsx from 'clsx';
import { Check } from '../../icons/Check';
import { Fragment, ReactNode } from 'react';

type HTMLSelectValue = JSX.IntrinsicElements['select']['value'] &
  JSX.IntrinsicElements['option']['key'];
type LabelSelectProps<T extends HTMLSelectValue> = {
  value: T;
  identification: string;
  states: readonly { value: T; label: ReactNode }[];
  setState: (value: T) => void;
  title: string;
  labelHidden?: boolean;
};
export const LabelSelect = <T extends HTMLSelectValue>({
  value,
  identification,
  setState,
  states,
  title,
  className,
  children,
  ...rest
}: JSX.IntrinsicElements['div'] & LabelSelectProps<T>) => {
  const curState = states.find((state) => state.value === value);
  return (
    <>
      <div className={clsx('grid grid-cols-5', className)} {...rest}>
        <Listbox value={value} onChange={setState}>
          {({ open }) => (
            <>
              <Listbox.Label className={'col-span-2 flex items-center'}>
                {title}
              </Listbox.Label>
              <div className="col-span-3 relative w-full">
                <Listbox.Button
                  className={clsx(
                    'w-full rounded-md text-left px-3 h-9 transition-colors whitespace-nowrap',
                    open
                      ? 'bg-zinc-900 bg-opacity-10 dark:bg-zinc-100 dark:bg-opacity-10'
                      : 'bg-zinc-900 bg-opacity-5  dark:bg-zinc-100 dark:bg-opacity-5 dark:hover:text-zinc-50'
                  )}
                >
                  <div className="flex justify-between w-full items-center">
                    {curState?.label}
                    <ChevronDown width={16} height={16} />
                  </div>
                </Listbox.Button>
                <Transition
                  show={open}
                  as={Fragment}
                  leave={'transition'}
                  leaveFrom="opacity-100"
                  leaveTo="opacity-10"
                >
                  <Listbox.Options
                    className={
                      'absolute top-[130%] py-1 w-full shadow-xl dark:shadow-zinc-950 z-40 overflow-auto max-h-96 bg-white dark:bg-zinc-800 rounded-md dark:ring-white dark:ring-opacity-20 ring-1 ring-black ring-opacity-5'
                    }
                  >
                    {states.map((state) => {
                      return (
                        <Listbox.Option
                          key={state.value}
                          value={state.value}
                          className={({ active, selected }) =>
                            clsx(
                              'relative px-3 min-h-[36px] py-1.5 flex items-center select-none',
                              selected ? '' : '',
                              active
                                ? 'dark:bg-zinc-100 dark:bg-opacity-10 bg-zinc-900 bg-opacity-10'
                                : ''
                            )
                          }
                        >
                          <div className="mr-2">
                            {state.value === value ? (
                              <Check height={16} width={16} />
                            ) : (
                              <div className="h-4 w-4"></div>
                            )}
                          </div>

                          {state.label}
                        </Listbox.Option>
                      );
                    })}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      </div>
    </>
  );
};
