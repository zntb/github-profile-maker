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

interface DividerConfigProps {
  type: string;
  gifUrl: string;
  onTypeChange: (value: string) => void;
  onGifUrlChange: (value: string) => void;
}

export function DividerConfig({ type, gifUrl, onTypeChange, onGifUrlChange }: DividerConfigProps) {
  return (
    <>
      <FieldGroup>
        <Label>Type</Label>
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">Line</SelectItem>
            <SelectItem value="gif">GIF</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>
      {type === 'gif' && (
        <FieldGroup>
          <Label>GIF URL</Label>
          <Input
            value={gifUrl}
            onChange={(e) => onGifUrlChange(e.target.value)}
            placeholder="https://..."
          />
        </FieldGroup>
      )}
    </>
  );
}
