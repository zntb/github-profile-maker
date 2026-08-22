'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { AlignmentField } from '../alignment-field';
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
      <AlignmentField value={alignment} onChange={onAlignmentChange} />
    </>
  );
}
