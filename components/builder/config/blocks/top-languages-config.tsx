'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { CardWidthField } from '../card-width-field';
import { FieldGroup } from '../field-group';
import { ThemeField } from '../theme-field';
import { ToggleField } from '../toggle-field';

interface TopLanguagesConfigProps {
  layoutWidth: string;
  width: string;
  theme: string;
  layout: string;
  langs_count: number;
  hideBorder: boolean;
  hideProgress: boolean;
  onLayoutWidthChange: (value: string) => void;
  onWidthChange: (value: string | undefined) => void;
  onThemeChange: (value: string) => void;
  onLayoutChange: (value: string) => void;
  onLangsCountChange: (value: number) => void;
  onHideBorderChange: (value: boolean) => void;
  onHideProgressChange: (value: boolean) => void;
}

export function TopLanguagesConfig({
  layoutWidth,
  width,
  theme,
  layout,
  langs_count,
  hideBorder,
  hideProgress,
  onLayoutWidthChange,
  onWidthChange,
  onThemeChange,
  onLayoutChange,
  onLangsCountChange,
  onHideBorderChange,
  onHideProgressChange,
}: TopLanguagesConfigProps) {
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
        <Label>Layout</Label>
        <Select value={layout} onValueChange={onLayoutChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compact">Compact</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="donut">Donut</SelectItem>
            <SelectItem value="donut-vertical">Donut Vertical</SelectItem>
            <SelectItem value="pie">Pie</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>
      <FieldGroup>
        <Label>Languages Count ({langs_count})</Label>
        <Input
          type="number"
          value={langs_count}
          onChange={(e) => onLangsCountChange(parseInt(e.target.value) || 8)}
          min={1}
          max={20}
        />
      </FieldGroup>
      <ToggleField
        label="Hide Border"
        checked={Boolean(hideBorder)}
        onChange={onHideBorderChange}
      />
      <ToggleField
        label="Hide Progress"
        checked={Boolean(hideProgress)}
        onChange={onHideProgressChange}
      />
    </>
  );
}
