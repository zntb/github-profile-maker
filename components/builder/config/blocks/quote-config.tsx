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
import { Textarea } from '@/components/ui/textarea';

import { FieldGroup } from '../field-group';
import { ThemeField } from '../theme-field';

interface QuoteConfigProps {
  quote: string;
  author: string;
  theme: string;
  type: string;
  onQuoteChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onThemeChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export function QuoteConfig({
  quote,
  author,
  theme,
  type,
  onQuoteChange,
  onAuthorChange,
  onThemeChange,
  onTypeChange,
}: QuoteConfigProps) {
  return (
    <>
      <FieldGroup>
        <Label>Custom Quote (optional)</Label>
        <Textarea
          value={quote}
          onChange={(e) => onQuoteChange(e.target.value)}
          placeholder="Leave empty for random quote"
          rows={3}
        />
      </FieldGroup>
      <FieldGroup>
        <Label>Author (optional)</Label>
        <Input value={author} onChange={(e) => onAuthorChange(e.target.value)} />
      </FieldGroup>
      <ThemeField value={theme} onChange={onThemeChange} />
      <FieldGroup>
        <Label>Layout</Label>
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="horizontal">Horizontal</SelectItem>
            <SelectItem value="vertical">Vertical</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>
    </>
  );
}
