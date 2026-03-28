'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { FieldGroup } from '../field-group';

interface CodeBlockConfigProps {
  code: string;
  language: string;
  onCodeChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
}

export function CodeBlockConfig({
  code,
  language,
  onCodeChange,
  onLanguageChange,
}: CodeBlockConfigProps) {
  return (
    <>
      <FieldGroup>
        <Label>Code</Label>
        <Textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          rows={6}
          className="font-mono text-sm"
        />
      </FieldGroup>
      <FieldGroup>
        <Label>Language</Label>
        <Input value={language} onChange={(e) => onLanguageChange(e.target.value)} />
      </FieldGroup>
    </>
  );
}
