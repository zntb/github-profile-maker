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

import { FieldGroup } from '../field-group';

interface VisitorCounterConfigProps {
  label: string;
  color: string;
  style: string;
  onLabelChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onStyleChange: (value: string) => void;
}

export function VisitorCounterConfig({
  label,
  color,
  style,
  onLabelChange,
  onColorChange,
  onStyleChange,
}: VisitorCounterConfigProps) {
  return (
    <>
      <FieldGroup>
        <Label>Label</Label>
        <Input value={label} onChange={(e) => onLabelChange(e.target.value)} />
      </FieldGroup>
      <FieldGroup>
        <Label>Color</Label>
        <Select value={color} onValueChange={onColorChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blue">Blue</SelectItem>
            <SelectItem value="brightgreen">Bright Green</SelectItem>
            <SelectItem value="green">Green</SelectItem>
            <SelectItem value="yellow">Yellow</SelectItem>
            <SelectItem value="orange">Orange</SelectItem>
            <SelectItem value="red">Red</SelectItem>
            <SelectItem value="lightgrey">Light Grey</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>
      <FieldGroup>
        <Label>Style</Label>
        <Select value={style} onValueChange={onStyleChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flat">Flat</SelectItem>
            <SelectItem value="flat-square">Flat Square</SelectItem>
            <SelectItem value="plastic">Plastic</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>
    </>
  );
}
