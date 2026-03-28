'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
