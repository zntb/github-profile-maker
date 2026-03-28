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

interface GreetingConfigProps {
  text: string;
  emoji: string;
  alignment: string;
  onTextChange: (value: string) => void;
  onEmojiChange: (value: string) => void;
  onAlignmentChange: (value: string) => void;
}

export function GreetingConfig({
  text,
  emoji,
  alignment,
  onTextChange,
  onEmojiChange,
  onAlignmentChange,
}: GreetingConfigProps) {
  return (
    <>
      <FieldGroup>
        <Label>Text</Label>
        <Input value={text} onChange={(e) => onTextChange(e.target.value)} />
      </FieldGroup>
      <FieldGroup>
        <Label>Emoji (optional)</Label>
        <Input
          value={emoji}
          onChange={(e) => onEmojiChange(e.target.value)}
          placeholder="e.g., 👋"
        />
      </FieldGroup>
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
    </>
  );
}
