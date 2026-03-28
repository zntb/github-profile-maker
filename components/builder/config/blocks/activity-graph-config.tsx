'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { FieldGroup } from '../field-group';
import { ThemeField } from '../theme-field';

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
      <FieldGroup>
        <div className="flex items-center justify-between">
          <Label>Hide Border</Label>
          <Switch
            checked={Boolean(hideBorder)}
            onCheckedChange={(checked) => onHideBorderChange(checked)}
          />
        </div>
      </FieldGroup>
    </>
  );
}
