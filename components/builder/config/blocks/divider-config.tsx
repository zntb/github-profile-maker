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
import { Slider } from '@/components/ui/slider';

import { FieldGroup } from '../field-group';
import {
  GradientColorPicker,
  type AnimationType,
  type BackgroundType,
  type GradientDirection,
} from '../gradient-color-picker';

interface DividerConfigProps {
  type: string;
  gifUrl: string;
  bgType?: BackgroundType;
  bgGradientDirection?: GradientDirection;
  bgAnimation?: AnimationType;
  bgStartColor?: string;
  bgEndColor?: string;
  bgSolidColor?: string;
  thickness?: number;
  alignment?: string;
  onTypeChange: (value: string) => void;
  onGifUrlChange: (value: string) => void;
  onBgTypeChange?: (value: BackgroundType) => void;
  onBgGradientDirectionChange?: (value: GradientDirection) => void;
  onBgAnimationChange?: (value: AnimationType) => void;
  onBgStartColorChange?: (value: string) => void;
  onBgEndColorChange?: (value: string) => void;
  onBgSolidColorChange?: (value: string) => void;
  onThicknessChange?: (value: number) => void;
  onAlignmentChange?: (value: string) => void;
}

export function DividerConfig({
  type,
  gifUrl,
  bgType = 'solid',
  bgGradientDirection = 'horizontal',
  bgAnimation = 'none',
  bgStartColor = 'CCCCCC',
  bgEndColor = '999999',
  bgSolidColor = 'CCCCCC',
  thickness = 2,
  alignment = 'center',
  onTypeChange,
  onGifUrlChange,
  onBgTypeChange,
  onBgGradientDirectionChange,
  onBgAnimationChange,
  onBgStartColorChange,
  onBgEndColorChange,
  onBgSolidColorChange,
  onThicknessChange,
  onAlignmentChange,
}: DividerConfigProps) {
  return (
    <>
      <FieldGroup>
        <Label>Type</Label>
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">Line</SelectItem>
            <SelectItem value="gif">GIF</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>

      {type === 'gif' && (
        <FieldGroup>
          <Label>GIF URL</Label>
          <Input
            value={gifUrl}
            onChange={(e) => onGifUrlChange(e.target.value)}
            placeholder="https://..."
          />
        </FieldGroup>
      )}

      {type === 'line' && (
        <>
          <FieldGroup>
            <Label>Background Style</Label>
            <Select value={bgType} onValueChange={(v) => onBgTypeChange?.(v as BackgroundType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="animated">Animated</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>

          {bgType === 'gradient' && (
            <FieldGroup>
              <Label>Gradient Direction</Label>
              <Select
                value={bgGradientDirection}
                onValueChange={(v) => onBgGradientDirectionChange?.(v as GradientDirection)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                  <SelectItem value="vertical">Vertical</SelectItem>
                  <SelectItem value="diagonal">Diagonal</SelectItem>
                  <SelectItem value="radial">Radial</SelectItem>
                  <SelectItem value="conic">Conic</SelectItem>
                </SelectContent>
              </Select>
            </FieldGroup>
          )}

          {bgType === 'animated' && (
            <FieldGroup>
              <Label>Animation</Label>
              <Select
                value={bgAnimation}
                onValueChange={(v) => onBgAnimationChange?.(v as AnimationType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="gradient">Gradient Flow</SelectItem>
                  <SelectItem value="pulse">Pulse</SelectItem>
                  <SelectItem value="wave">Wave</SelectItem>
                  <SelectItem value="shimmer">Shimmer</SelectItem>
                </SelectContent>
              </Select>
            </FieldGroup>
          )}

          {bgType !== 'animated' && (
            <FieldGroup>
              <Label>{bgType === 'solid' ? 'Color' : 'Start Color'}</Label>
              <Input
                type="color"
                value={`#${bgType === 'solid' ? bgSolidColor : bgStartColor}`}
                onChange={(e) => {
                  const hex = e.target.value.replace('#', '').toUpperCase();
                  if (bgType === 'solid') {
                    onBgSolidColorChange?.(hex);
                  } else {
                    onBgStartColorChange?.(hex);
                  }
                }}
                className="h-10 w-full cursor-pointer"
              />
            </FieldGroup>
          )}

          {bgType === 'gradient' && (
            <FieldGroup>
              <Label>End Color</Label>
              <Input
                type="color"
                value={`#${bgEndColor}`}
                onChange={(e) => {
                  const hex = e.target.value.replace('#', '').toUpperCase();
                  onBgEndColorChange?.(hex);
                }}
                className="h-10 w-full cursor-pointer"
              />
            </FieldGroup>
          )}

          {bgType === 'animated' && (
            <GradientColorPicker
              label="Colors"
              value={`${bgType}:${bgGradientDirection}:${bgAnimation}:${bgStartColor}:${bgEndColor}`}
              onChange={(newValue) => {
                // Parse the gradient string back to components
                const parts = newValue.split(':');
                if (parts[0]) onBgTypeChange?.(parts[0] as BackgroundType);
                if (parts[1]) onBgGradientDirectionChange?.(parts[1] as GradientDirection);
                if (parts[2]) onBgAnimationChange?.(parts[2] as AnimationType);
                if (parts[3]) onBgStartColorChange?.(parts[3]);
                if (parts[4]) onBgEndColorChange?.(parts[4]);
              }}
            />
          )}

          <FieldGroup>
            <Label>Thickness ({thickness}px)</Label>
            <Slider
              value={[thickness]}
              onValueChange={(values) => onThicknessChange?.(values[0])}
              min={1}
              max={20}
              step={1}
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
      )}
    </>
  );
}
