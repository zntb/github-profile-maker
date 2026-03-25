'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useBuilderStore } from '@/lib/store';
import type { Block } from '@/lib/types';
import { BlockPreview } from './block-preview';

interface CanvasBlockProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
}

export function CanvasBlock({ block, isSelected, onSelect }: CanvasBlockProps) {
  const { removeBlock, duplicateBlock } = useBuilderStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeBlock(block.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateBlock(block.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative rounded-lg border bg-card transition-all',
        isSelected
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-border hover:border-muted-foreground/50',
        isDragging && 'opacity-50 shadow-lg'
      )}
      onClick={onSelect}
    >
      {/* Drag Handle - Desktop: left side, Mobile: top-left corner */}
      <div
        className={cn(
          'absolute top-2 left-2 sm:-left-10 sm:top-1/2 sm:-translate-y-1/2 flex items-center gap-1 transition-opacity',
          'opacity-100 sm:opacity-0 sm:group-hover:opacity-100',
          isSelected && 'sm:opacity-100'
        )}
      >
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Quick Actions - Desktop: right side, Mobile: top-right corner */}
      <div
        className={cn(
          'absolute top-2 right-2 sm:-right-10 sm:top-1/2 sm:-translate-y-1/2 flex sm:flex-col items-center gap-1 transition-opacity',
          'opacity-100 sm:opacity-0 sm:group-hover:opacity-100',
          isSelected && 'sm:opacity-100'
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={handleDuplicate}
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Block Type Label */}
      <div className="absolute -top-2.5 left-3 px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-card">
        {block.type.replace(/-/g, ' ')}
      </div>

      {/* Block Content Preview */}
      <div className="p-3 pt-10 sm:p-4 sm:pt-5">
        <BlockPreview block={block} />
      </div>
    </div>
  );
}
