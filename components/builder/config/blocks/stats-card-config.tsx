'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { CardWidthField } from '../card-width-field';
import { FieldGroup } from '../field-group';
import { ThemeField } from '../theme-field';

interface StatsCardConfigProps {
  layoutWidth: string;
  width: string;
  theme: string;
  showIcons: boolean;
  hideBorder: boolean;
  hideTitle: boolean;
  hideRank: boolean;
  borderRadius: number;
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
  layoutWidth,
  width,
  theme,
  showIcons,
  hideBorder,
  hideTitle,
  hideRank,
  borderRadius,
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
      <CardWidthField
        layoutWidth={layoutWidth}
        width={width}
        onLayoutWidthChange={onLayoutWidthChange}
        onWidthChange={onWidthChange}
      />
      <ThemeField value={theme} onChange={onThemeChange} />
      <FieldGroup>
        <div className="flex items-center justify-between">
          <Label>Show Icons</Label>
          <Switch
            checked={Boolean(showIcons)}
            onCheckedChange={(checked) => onShowIconsChange(checked)}
          />
        </div>
      </FieldGroup>
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
        <div className="flex items-center justify-between">
          <Label>Hide Title</Label>
          <Switch
            checked={Boolean(hideTitle)}
            onCheckedChange={(checked) => onHideTitleChange(checked)}
          />
        </div>
      </FieldGroup>
      <FieldGroup>
        <div className="flex items-center justify-between">
          <Label>Hide Rank</Label>
          <Switch
            checked={Boolean(hideRank)}
            onCheckedChange={(checked) => onHideRankChange(checked)}
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
