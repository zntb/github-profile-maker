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

interface CustomBadgeConfigProps {
  label: string;
  message: string;
  color: string;
  style: string;
  logo: string;
  onLabelChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onStyleChange: (value: string) => void;
  onLogoChange: (value: string) => void;
}

export function CustomBadgeConfig({
  label,
  message,
  color,
  style,
  logo,
  onLabelChange,
  onMessageChange,
  onColorChange,
  onStyleChange,
  onLogoChange,
}: CustomBadgeConfigProps) {
  return (
    <>
      <FieldGroup>
        <Label>Label</Label>
        <Input value={label} onChange={(e) => onLabelChange(e.target.value)} />
      </FieldGroup>
      <FieldGroup>
        <Label>Message</Label>
        <Input value={message} onChange={(e) => onMessageChange(e.target.value)} />
      </FieldGroup>
      <FieldGroup>
        <Label>Color</Label>
        <Input
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          placeholder="red, blue, #ff0000"
        />
      </FieldGroup>
      <FieldGroup>
        <Label>Style</Label>
        <Select value={style} onValueChange={onStyleChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flat">Flat</SelectItem>
            <SelectItem value="flat-square">Flat Square</SelectItem>
            <SelectItem value="for-the-badge">For the Badge</SelectItem>
            <SelectItem value="plastic">Plastic</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>
      <FieldGroup>
        <Label>Logo (optional)</Label>
        <Input
          value={logo}
          onChange={(e) => onLogoChange(e.target.value)}
          placeholder="github, twitter, etc."
        />
      </FieldGroup>
    </>
  );
}
