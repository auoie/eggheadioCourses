import { Listbox } from '@headlessui/react';
type SelectProps<T extends string> = {
  value: T;
  states: readonly { value: T; label: string }[];
  setState: (value: T) => void;
};
export const Select = <T extends string>({
  setState,
  states,
  value,
}: SelectProps<T>) => {
  const matchingState = states.find((state) => state.value === value);
  return (
    <Listbox onChange={setState} value="">
      <Listbox.Button>{matchingState?.label}</Listbox.Button>
      <Listbox.Options>
        {states.map((state) => {
          return (
            <Listbox.Option key={state.value} value={state.value}>
              {state.label}
            </Listbox.Option>
          );
        })}
      </Listbox.Options>
    </Listbox>
  );
};
