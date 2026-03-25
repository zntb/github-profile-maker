'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutTemplate, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { templates } from '@/lib/templates';
import { useBuilderStore } from '@/lib/store';

export function TemplatesDialog() {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { loadTemplate, blocks } = useBuilderStore();

  const handleLoadTemplate = () => {
    const template = templates.find((t) => t.id === selectedTemplate);
    if (template) {
      loadTemplate(template);
      setOpen(false);
      setSelectedTemplate(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <LayoutTemplate className="h-4 w-4" />
          <span className="hidden sm:inline">Templates</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Start with a pre-built template and customize it to your needs
            {blocks.length > 0 && (
              <span className="block text-destructive mt-1">
                Warning: Loading a template will replace your current blocks
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={cn(
                  'relative rounded-lg border-2 p-4 text-left transition-all hover:border-primary',
                  selectedTemplate === template.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                )}
              >
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 rounded-full bg-primary p-1">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}

                <div className="mb-3 h-24 rounded-md bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <LayoutTemplate className="h-10 w-10 text-muted-foreground/50" />
                </div>

                <h3 className="font-semibold text-sm">{template.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {template.blocks.length} blocks
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleLoadTemplate}
            disabled={!selectedTemplate}
          >
            Load Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
