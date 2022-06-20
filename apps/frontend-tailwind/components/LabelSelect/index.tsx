type HTMLSelectValue = JSX.IntrinsicElements['select']['value'] &
  JSX.IntrinsicElements['option']['key'];
type LabelSelectProps<T extends HTMLSelectValue> = {
  value: T;
  identification: string;
  states: readonly { value: T; label: string }[];
  setState: (value: T) => void;
  title: string;
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
    <div className={className} {...rest}>
      <label htmlFor={identification}>{title}</label>
      <select
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
  );
};
