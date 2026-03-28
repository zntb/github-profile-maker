'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { CardWidthField } from '../card-width-field';
import { FieldGroup } from '../field-group';
import { ThemeField } from '../theme-field';

interface StreakStatsConfigProps {
  layoutWidth: string;
  width: string;
  theme: string;
  hideBorder: boolean;
  borderRadius: number;
  onLayoutWidthChange: (value: string) => void;
  onWidthChange: (value: string | undefined) => void;
  onThemeChange: (value: string) => void;
  onHideBorderChange: (value: boolean) => void;
  onBorderRadiusChange: (value: number) => void;
}

export function StreakStatsConfig({
  layoutWidth,
  width,
  theme,
  hideBorder,
  borderRadius,
  onLayoutWidthChange,
  onWidthChange,
  onThemeChange,
  onHideBorderChange,
  onBorderRadiusChange,
}: StreakStatsConfigProps) {
  return (
    <>
      <CardWidthField
        layoutWidth={layoutWidth}
        width={width}
        onLayoutWidthChange={onLayoutWidthChange}
        onWidthChange={onWidthChange}
      />
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
      <FieldGroup>
        <Label>Border Radius ({borderRadius}px)</Label>
        <Input
          type="number"
          value={borderRadius}
          onChange={(e) => onBorderRadiusChange(parseInt(e.target.value) || 10)}
          min={0}
          max={20}
        />
      </FieldGroup>
    </>
  );
}
