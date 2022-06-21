import clsx from 'clsx';

type HTMLSelectValue = JSX.IntrinsicElements['select']['value'] &
  JSX.IntrinsicElements['option']['key'];
type LabelSelectProps<T extends HTMLSelectValue> = {
  value: T;
  identification: string;
  states: readonly { value: T; label: string }[];
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
  return (
    <div className={clsx('grid grid-cols-5 h-8', className)} {...rest}>
      <div className="col-span-2 leading-4 align-middle text-center flex items-center whitespace-nowrap">
        <label htmlFor={identification} className="w-full h-full flex items-center">
          {title}
        </label>
      </div>
      <div className="col-span-3 flex items-center justify-center">
        <select
          className="w-full h-7 rounded"
          name={identification}
          id={identification}
          value={value}
          onChange={(event) => {
            setState(event.target.value as T);
          }}
        >
          {children}
          {states.map((state) => {
            return (
              <option value={state.value} key={state.value}>
                {state.label}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};
