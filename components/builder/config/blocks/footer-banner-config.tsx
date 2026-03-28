'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { FieldGroup } from '../field-group';

interface FooterBannerConfigProps {
  text: string;
  waveColor: string;
  fontColor: string;
  height: number;
  onTextChange: (value: string) => void;
  onWaveColorChange: (value: string) => void;
  onFontColorChange: (value: string) => void;
  onHeightChange: (value: number) => void;
}

export function FooterBannerConfig({
  text,
  waveColor,
  fontColor,
  height,
  onTextChange,
  onWaveColorChange,
  onFontColorChange,
  onHeightChange,
}: FooterBannerConfigProps) {
  return (
    <>
      <FieldGroup>
        <Label>Text</Label>
        <Input value={text} onChange={(e) => onTextChange(e.target.value)} />
      </FieldGroup>
      <FieldGroup>
        <Label>Wave Color (gradient)</Label>
        <Input
          value={waveColor}
          onChange={(e) => onWaveColorChange(e.target.value)}
          placeholder="0:EEFF00,100:a82DA"
        />
      </FieldGroup>
      <FieldGroup>
        <Label>Font Color (hex without #)</Label>
        <Input
          value={fontColor}
          onChange={(e) => onFontColorChange(e.target.value)}
          placeholder="ffffff"
        />
      </FieldGroup>
      <FieldGroup>
        <Label>Height (px)</Label>
        <Input
          type="number"
          value={height}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val) && val > 0) {
              onHeightChange(val);
            }
          }}
          min={1}
          placeholder="80"
        />
      </FieldGroup>
    </>
  );
}
