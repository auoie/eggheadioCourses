import { FC } from 'react';

type SetThemeProps = {
  setTheme: (theme: string) => void;
  theme: string;
};
const ThemeSwitch: FC<SetThemeProps> = ({ setTheme, theme }) => {
  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="rounded"
    >
      <option value="system">System</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  );
};

export default ThemeSwitch;
