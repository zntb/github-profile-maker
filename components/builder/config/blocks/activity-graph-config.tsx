'use client';

import { ThemeField } from '../theme-field';
import { ToggleField } from '../toggle-field';

interface ActivityGraphConfigProps {
  theme: string;
  hideBorder: boolean;
  onThemeChange: (value: string) => void;
  onHideBorderChange: (value: boolean) => void;
}

export function ActivityGraphConfig({
  theme,
  hideBorder,
  onThemeChange,
  onHideBorderChange,
}: ActivityGraphConfigProps) {
  return (
    <>
      <ThemeField value={theme} onChange={onThemeChange} />
      <ToggleField
        label="Hide Border"
        checked={Boolean(hideBorder)}
        onChange={onHideBorderChange}
      />
    </>
  );
}
