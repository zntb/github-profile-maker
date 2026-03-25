'use client';

import { useState } from 'react';
import { 
  Layout, Minus, Space, Sparkles, User, Hand, Type, Heading, 
  AlignLeft, ChevronDown, Code, Image, Film, Share2, Badge, 
  Layers, BarChart2, PieChart, Flame, Activity, Award, Eye,
  Quote, PanelBottom, Search, ChevronRight
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BLOCK_CATEGORIES, type BlockType } from '@/lib/types';
import { useBuilderStore, generateId } from '@/lib/store';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Layout,
  Minus,
  Space,
  Sparkles,
  User,
  Hand,
  Type,
  Heading,
  AlignLeft,
  ChevronDown,
  Code,
  Image,
  Film,
  Share2,
  Badge,
  Layers,
  BarChart2,
  PieChart,
  Flame,
  Activity,
  Award,
  Eye,
  Quote,
  PanelBottom,
};

export function BlockSidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    BLOCK_CATEGORIES.map((c) => c.name)
  );
  const { addBlock } = useBuilderStore();

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleAddBlock = (type: BlockType, defaultProps: Record<string, unknown>) => {
    addBlock({
      id: generateId(),
      type,
      props: defaultProps,
      children: type === 'container' || type === 'collapsible' ? [] : undefined,
    });
  };

  const filteredCategories = BLOCK_CATEGORIES.map((category) => ({
    ...category,
    blocks: category.blocks.filter(
      (block) =>
        block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        block.type.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.blocks.length > 0);

  return (
    <div className="flex h-full w-full lg:w-72 flex-col border-r border-border bg-sidebar">
      <div className="border-b border-border p-4">
        <h2 className="mb-3 text-sm font-semibold text-sidebar-foreground">Blocks</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-sidebar-accent text-sidebar-foreground placeholder:text-muted-foreground border-sidebar-border"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredCategories.map((category) => (
            <div key={category.name} className="mb-2">
              <button
                onClick={() => toggleCategory(category.name)}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              >
                <span>{category.name}</span>
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    expandedCategories.includes(category.name) && 'rotate-90'
                  )}
                />
              </button>

              {expandedCategories.includes(category.name) && (
                <div className="mt-1 space-y-1 pl-2">
                  {category.blocks.map((block) => {
                    const Icon = iconMap[block.icon] || Layout;
                    return (
                      <Button
                        key={block.type}
                        variant="ghost"
                        className="w-full justify-start gap-3 px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        onClick={() => handleAddBlock(block.type, block.defaultProps)}
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        <span>{block.label}</span>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground text-center">
          Click a block to add it to your README
        </p>
      </div>
    </div>
  );
}
