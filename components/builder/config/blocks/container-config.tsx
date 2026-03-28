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

interface ContainerConfigProps {
  alignment: string;
  direction: string;
  gap: number;
  onAlignmentChange: (value: string) => void;
  onDirectionChange: (value: string) => void;
  onGapChange: (value: number) => void;
}

export function ContainerConfig({
  alignment,
  direction,
  gap,
  onAlignmentChange,
  onDirectionChange,
  onGapChange,
}: ContainerConfigProps) {
  return (
    <>
      <FieldGroup>
        <Label>Alignment</Label>
        <Select value={alignment} onValueChange={onAlignmentChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>
      <FieldGroup>
        <Label>Direction</Label>
        <Select value={direction} onValueChange={onDirectionChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="column">Column</SelectItem>
            <SelectItem value="row">Row</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>
      <FieldGroup>
        <Label>Gap ({gap}px)</Label>
        <Input
          type="number"
          min={0}
          max={48}
          step={4}
          value={gap}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val)) {
              onGapChange(Math.min(48, Math.max(0, val)));
            }
          }}
        />
      </FieldGroup>
    </>
  );
}
