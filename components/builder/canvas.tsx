'use client';

import { useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBuilderStore } from '@/lib/store';
import { CanvasBlock } from './canvas-block';
import { Empty } from '@/components/ui/empty';
import { Layers } from 'lucide-react';

export function Canvas() {
  const { blocks, setBlocks, selectBlock, selectedBlockId } = useBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = blocks.findIndex((b) => b.id === active.id);
        const newIndex = blocks.findIndex((b) => b.id === over.id);
        setBlocks(arrayMove(blocks, oldIndex, newIndex));
      }
    },
    [blocks, setBlocks]
  );

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectBlock(null);
    }
  };

  if (blocks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-background p-4 sm:p-8">
        <Empty
          icon={Layers}
          title="No blocks yet"
          description="Add blocks from the sidebar to start building your GitHub Profile README"
        />
      </div>
    );
  }

  return (
    <ScrollArea className="h-full bg-background">
      <div
        className="min-h-full p-3 sm:p-6"
        onClick={handleCanvasClick}
      >
        <div className="mx-auto max-w-4xl">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {blocks.map((block) => (
                  <CanvasBlock
                    key={block.id}
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => selectBlock(block.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </ScrollArea>
  );
}
