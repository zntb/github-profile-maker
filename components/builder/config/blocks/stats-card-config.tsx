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

interface StatsCardConfigProps {
  layoutStyle: 'standard' | 'compact';
  layoutWidth: string;
  width: string;
  theme: string;
  showIcons: boolean;
  hideBorder: boolean;
  hideTitle: boolean;
  hideRank: boolean;
  borderRadius: number;
  onLayoutStyleChange: (value: 'standard' | 'compact') => void;
  onLayoutWidthChange: (value: string) => void;
  onWidthChange: (value: string | undefined) => void;
  onThemeChange: (value: string) => void;
  onShowIconsChange: (value: boolean) => void;
  onHideBorderChange: (value: boolean) => void;
  onHideTitleChange: (value: boolean) => void;
  onHideRankChange: (value: boolean) => void;
  onBorderRadiusChange: (value: number) => void;
}

export function StatsCardConfig({
  layoutStyle,
  layoutWidth,
  width,
  theme,
  showIcons,
  hideBorder,
  hideTitle,
  hideRank,
  borderRadius,
  onLayoutStyleChange,
  onLayoutWidthChange,
  onWidthChange,
  onThemeChange,
  onShowIconsChange,
  onHideBorderChange,
  onHideTitleChange,
  onHideRankChange,
  onBorderRadiusChange,
}: StatsCardConfigProps) {
  return (
    <>
      {/* Card style variant */}
      <FieldGroup>
        <Label>Card Style</Label>
        <Select
          value={layoutStyle}
          onValueChange={(v) => onLayoutStyleChange(v as 'standard' | 'compact')}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard — list view (195 px tall)</SelectItem>
            <SelectItem value="compact">Compact — grid view (305 px tall)</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>

      <CardWidthField
        layoutWidth={layoutWidth}
        width={width}
        onLayoutWidthChange={onLayoutWidthChange}
        onWidthChange={onWidthChange}
      />
      <ThemeField value={theme} onChange={onThemeChange} />
      <ToggleField label="Show Icons" checked={Boolean(showIcons)} onChange={onShowIconsChange} />
      <ToggleField
        label="Hide Border"
        checked={Boolean(hideBorder)}
        onChange={onHideBorderChange}
      />
      <ToggleField label="Hide Title" checked={Boolean(hideTitle)} onChange={onHideTitleChange} />
      <ToggleField label="Hide Rank" checked={Boolean(hideRank)} onChange={onHideRankChange} />
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
