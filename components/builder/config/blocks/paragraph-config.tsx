'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { AlignmentField } from '../alignment-field';
import { FieldGroup } from '../field-group';

interface ParagraphConfigProps {
  text: string;
  alignment: string;
  onTextChange: (value: string) => void;
  onAlignmentChange: (value: string) => void;
}

export function ParagraphConfig({
  text,
  alignment,
  onTextChange,
  onAlignmentChange,
}: ParagraphConfigProps) {
  return (
    <>
      <FieldGroup>
        <Label>Text</Label>
        <Textarea value={text} onChange={(e) => onTextChange(e.target.value)} rows={4} />
      </FieldGroup>
      <AlignmentField value={alignment} onChange={onAlignmentChange} />
    </>
  );
}
