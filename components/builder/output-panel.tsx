'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Download, Check } from 'lucide-react';
import { useBuilderStore } from '@/lib/store';
import { renderMarkdown, downloadMarkdown, copyToClipboard } from '@/lib/markdown';
import { LivePreview } from './live-preview';

interface OutputPanelProps {
  mode: 'preview' | 'markdown';
}

export function OutputPanel({ mode }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);
  const { blocks } = useBuilderStore();

  const markdown = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return renderMarkdown(blocks, window.location.origin);
  }, [blocks]);

  const handleCopy = async () => {
    const success = await copyToClipboard(markdown);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadMarkdown(markdown);
  };

  if (mode === 'preview') {
    return (
      <div className="flex h-full flex-col bg-background">
        <LivePreview blocks={blocks} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center justify-end gap-2 border-b border-border px-3 py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
          disabled={blocks.length === 0}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span className="hidden sm:inline">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleDownload}
          className="gap-2"
          disabled={blocks.length === 0}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4">
          {blocks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Add blocks to generate Markdown
            </p>
          ) : (
            <pre className="rounded-lg bg-muted p-3 sm:p-4 text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-all font-mono">
              <code>{markdown}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
