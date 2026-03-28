'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { STATS_THEMES } from '@/lib/types';

import { FieldGroup } from './field-group';

interface ThemeFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ThemeField({ value, onChange, label = 'Theme' }: ThemeFieldProps) {
  return (
    <FieldGroup>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {STATS_THEMES.map((theme) => (
            <SelectItem key={theme} value={theme}>
              {theme}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldGroup>
  );
}
