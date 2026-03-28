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

interface HeadingConfigProps {
  text: string;
  level: number;
  emoji: string;
  alignment: string;
  onTextChange: (value: string) => void;
  onLevelChange: (value: number) => void;
  onEmojiChange: (value: string) => void;
  onAlignmentChange: (value: string) => void;
}

export function HeadingConfig({
  text,
  level,
  emoji,
  alignment,
  onTextChange,
  onLevelChange,
  onEmojiChange,
  onAlignmentChange,
}: HeadingConfigProps) {
  return (
    <>
      <FieldGroup>
        <Label>Text</Label>
        <Input value={text} onChange={(e) => onTextChange(e.target.value)} />
      </FieldGroup>
      <FieldGroup>
        <Label>Level</Label>
        <Select value={String(level)} onValueChange={(v) => onLevelChange(parseInt(v))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">H1</SelectItem>
            <SelectItem value="2">H2</SelectItem>
            <SelectItem value="3">H3</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>
      <FieldGroup>
        <Label>Emoji (optional)</Label>
        <Input value={emoji} onChange={(e) => onEmojiChange(e.target.value)} />
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
