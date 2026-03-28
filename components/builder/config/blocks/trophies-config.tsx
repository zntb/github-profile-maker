'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { FieldGroup } from '../field-group';
import { ThemeField } from '../theme-field';

interface TrophiesConfigProps {
  theme: string;
  column: number;
  row: number;
  noFrame: boolean;
  noBg: boolean;
  onThemeChange: (value: string) => void;
  onColumnChange: (value: number) => void;
  onRowChange: (value: number) => void;
  onNoFrameChange: (value: boolean) => void;
  onNoBgChange: (value: boolean) => void;
}

export function TrophiesConfig({
  theme,
  column,
  row,
  noFrame,
  noBg,
  onThemeChange,
  onColumnChange,
  onRowChange,
  onNoFrameChange,
  onNoBgChange,
}: TrophiesConfigProps) {
  return (
    <>
      <ThemeField value={theme} onChange={onThemeChange} />
      <FieldGroup>
        <Label>Columns ({column})</Label>
        <Input
          type="number"
          value={column}
          onChange={(e) => onColumnChange(parseInt(e.target.value) || 4)}
          min={1}
          max={10}
        />
      </FieldGroup>
      <FieldGroup>
        <Label>Rows ({row})</Label>
        <Input
          type="number"
          value={row}
          onChange={(e) => onRowChange(parseInt(e.target.value) || 2)}
          min={1}
          max={4}
        />
      </FieldGroup>
      <FieldGroup>
        <div className="flex items-center justify-between">
          <Label>No Frame</Label>
          <Switch
            checked={Boolean(noFrame)}
            onCheckedChange={(checked) => onNoFrameChange(checked)}
          />
        </div>
      </FieldGroup>
      <FieldGroup>
        <div className="flex items-center justify-between">
          <Label>No Background</Label>
          <Switch checked={Boolean(noBg)} onCheckedChange={(checked) => onNoBgChange(checked)} />
        </div>
      </FieldGroup>
    </>
  );
}
