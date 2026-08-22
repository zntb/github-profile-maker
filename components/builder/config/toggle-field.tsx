'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { FieldGroup } from './field-group';

interface ToggleFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleField({ label, checked, onChange }: ToggleFieldProps) {
  return (
    <FieldGroup>
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Switch checked={checked} onCheckedChange={onChange} />
      </div>
    </FieldGroup>
  );
}
