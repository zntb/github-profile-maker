'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { FieldGroup } from '../field-group';

interface SpacerConfigProps {
  height: number;
  onHeightChange: (value: number) => void;
}

export function SpacerConfig({ height, onHeightChange }: SpacerConfigProps) {
  return (
    <FieldGroup>
      <Label>Height ({height}px)</Label>
      <Input
        type="number"
        min={10}
        max={100}
        step={5}
        value={height}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10);
          if (!isNaN(val)) {
            onHeightChange(Math.min(100, Math.max(10, val)));
          }
        }}
      />
    </FieldGroup>
  );
}
