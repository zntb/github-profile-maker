'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { FieldGroup } from '../field-group';

interface CollapsibleConfigProps {
  title: string;
  defaultOpen: boolean;
  onTitleChange: (value: string) => void;
  onDefaultOpenChange: (value: boolean) => void;
}

export function CollapsibleConfig({
  title,
  defaultOpen,
  onTitleChange,
  onDefaultOpenChange,
}: CollapsibleConfigProps) {
  return (
    <>
      <FieldGroup>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => onTitleChange(e.target.value)} />
      </FieldGroup>
      <FieldGroup>
        <div className="flex items-center justify-between">
          <Label>Default Open</Label>
          <Switch
            checked={defaultOpen === true}
            onCheckedChange={(checked) => onDefaultOpenChange(checked)}
          />
        </div>
      </FieldGroup>
    </>
  );
}
