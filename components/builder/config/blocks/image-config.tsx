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

interface ImageConfigProps {
  url: string;
  alt: string;
  width: number | undefined;
  height: number | undefined;
  borderRadius: number;
  alignment: string;
  onUrlChange: (value: string) => void;
  onAltChange: (value: string) => void;
  onWidthChange: (value: number | undefined) => void;
  onHeightChange: (value: number | undefined) => void;
  onBorderRadiusChange: (value: number) => void;
  onAlignmentChange: (value: string) => void;
}

export function ImageConfig({
  url,
  alt,
  width,
  height,
  borderRadius,
  alignment,
  onUrlChange,
  onAltChange,
  onWidthChange,
  onHeightChange,
  onBorderRadiusChange,
  onAlignmentChange,
}: ImageConfigProps) {
  return (
    <>
      <FieldGroup>
        <Label>Image URL</Label>
        <Input value={url} onChange={(e) => onUrlChange(e.target.value)} />
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
        <Label>Height (optional)</Label>
        <Input
          type="number"
          value={height ?? ''}
          onChange={(e) => onHeightChange(e.target.value ? parseInt(e.target.value) : undefined)}
        />
      </FieldGroup>
      <FieldGroup>
        <Label>Border Radius</Label>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            min={0}
            max={100}
            value={borderRadius}
            onChange={(e) => {
              const value = Number(e.target.value);
              onBorderRadiusChange(Math.max(0, Math.min(100, value || 0)));
            }}
            className="w-20"
          />
          <span className="text-xs text-muted-foreground">px</span>
        </div>
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
