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
import { FileUpload } from '../file-upload';

interface GifConfigProps {
  url: string;
  alt: string;
  width: number | undefined;
  alignment: string;
  onUrlChange: (value: string) => void;
  onAltChange: (value: string) => void;
  onWidthChange: (value: number | undefined) => void;
  onAlignmentChange: (value: string) => void;
}

export function GifConfig({
  url,
  alt,
  width,
  alignment,
  onUrlChange,
  onAltChange,
  onWidthChange,
  onAlignmentChange,
}: GifConfigProps) {
  return (
    <>
      <FieldGroup>
        <FileUpload
          accept="image/gif"
          value={url}
          onChange={onUrlChange}
          label="GIF URL"
          placeholder="Enter GIF URL or upload a file"
        />
      </FieldGroup>
      <FieldGroup>
        <Label>Alt Text</Label>
        <Input value={alt} onChange={(e) => onAltChange(e.target.value)} />
      </FieldGroup>
      <FieldGroup>
        <Label>Width (optional)</Label>
        <Input
          type="number"
          value={width ?? ''}
          onChange={(e) => onWidthChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
