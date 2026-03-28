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

import { FieldGroup } from './field-group';

interface CardWidthFieldProps {
  layoutWidth: string;
  width: string;
  onLayoutWidthChange: (value: string) => void;
  onWidthChange: (value: string | undefined) => void;
}

export function CardWidthField({
  layoutWidth,
  width,
  onLayoutWidthChange,
  onWidthChange,
}: CardWidthFieldProps) {
  return (
    <>
      <FieldGroup>
        <Label>Layout Width</Label>
        <Select value={layoutWidth} onValueChange={onLayoutWidthChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="half">Half (2 cards per row)</SelectItem>
            <SelectItem value="full">Full (1 card per row)</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>
      <FieldGroup>
        <Label>Custom Width (%)</Label>
        <Input
          type="text"
          value={width}
          onChange={(e) => onWidthChange(e.target.value || undefined)}
          placeholder="e.g., 48%"
        />
      </FieldGroup>
    </>
  );
}
