"use client";

import { Button } from "@/components/ui/button";
import { TemplatesDialog } from "./templates-dialog";
import { useBuilderStore } from "@/lib/store";
import { Download, RotateCcw, GitCommit } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";
import { toast } from "sonner";

export function BuilderHeader() {
  const { blocks, clearBlocks } = useBuilderStore();

  const handleExport = () => {
    const markdown = renderMarkdown(blocks, window.location.origin);
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("README.md downloaded!");
  };

  const handleClear = () => {
    if (blocks.length === 0) return;
    clearBlocks();
    toast.success("Canvas cleared");
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-2 sm:px-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <GitCommit className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="font-semibold text-foreground text-sm sm:text-base">README Builder</h1>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <TemplatesDialog />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          disabled={blocks.length === 0}
          className="hidden sm:flex"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          disabled={blocks.length === 0}
          className="sm:hidden"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          onClick={handleExport}
          disabled={blocks.length === 0}
          className="hidden sm:flex"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button
          size="icon"
          onClick={handleExport}
          disabled={blocks.length === 0}
          className="sm:hidden"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
