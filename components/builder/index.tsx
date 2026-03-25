"use client";

import { useState } from "react";
import { BuilderHeader } from "./header";
import { BlockSidebar } from "./block-sidebar";
import { Canvas } from "./canvas";
import { ConfigPanel } from "./config-panel";
import { OutputPanel } from "./output-panel";
import { useBuilderStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Eye, Code, PanelLeft, Settings2, Blocks } from "lucide-react";

export function Builder() {
  const { selectedBlockId } = useBuilderStore();
  const [mobileTab, setMobileTab] = useState<"blocks" | "canvas" | "preview">("canvas");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background">
      <BuilderHeader />
      
      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1">
        {/* Left Sidebar - Block Library */}
        <BlockSidebar />

        {/* Center - Canvas */}
        <div className="flex-1 flex flex-col min-w-0">
          <Canvas />
        </div>

        {/* Right Panel - Config or Preview */}
        <div className="w-80 xl:w-96 border-l border-border bg-card flex flex-col h-full">
          {selectedBlockId ? (
            <ConfigPanel />
          ) : (
            <Tabs defaultValue="preview" className="flex-1 flex flex-col">
              <div className="border-b border-border p-2">
                <TabsList className="w-full">
                  <TabsTrigger value="preview" className="flex-1 gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="markdown" className="flex-1 gap-2">
                    <Code className="w-4 h-4" />
                    Markdown
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
                <OutputPanel mode="preview" />
              </TabsContent>
              <TabsContent value="markdown" className="flex-1 m-0 overflow-hidden">
                <OutputPanel mode="markdown" />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      {/* Tablet Layout (md-lg) */}
      <div className="hidden md:flex lg:hidden flex-1">
        {/* Left Sidebar - Block Library (collapsible) */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-2 top-16 z-10 md:flex hidden lg:hidden"
            >
              <Blocks className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <BlockSidebar />
          </SheetContent>
        </Sheet>

        {/* Center - Canvas */}
        <div className="flex-1 flex flex-col min-w-0 pl-12">
          <Canvas />
        </div>

        {/* Right Panel - Config or Preview (collapsible) */}
        <Sheet open={configOpen} onOpenChange={setConfigOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-16 z-10 md:flex hidden lg:hidden"
            >
              {selectedBlockId ? <Settings2 className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0">
            {selectedBlockId ? (
              <ConfigPanel />
            ) : (
              <Tabs defaultValue="preview" className="flex-1 flex flex-col h-full">
                <div className="border-b border-border p-2">
                  <TabsList className="w-full">
                    <TabsTrigger value="preview" className="flex-1 gap-2">
                      <Eye className="w-4 h-4" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="markdown" className="flex-1 gap-2">
                      <Code className="w-4 h-4" />
                      Markdown
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
                  <OutputPanel mode="preview" />
                </TabsContent>
                <TabsContent value="markdown" className="flex-1 m-0 overflow-hidden">
                  <OutputPanel mode="markdown" />
                </TabsContent>
              </Tabs>
            )}
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden flex-1 flex-col">
        {/* Mobile Tab Content */}
        <div className="flex-1 overflow-hidden">
          {mobileTab === "blocks" && (
            <div className="h-full">
              <BlockSidebar />
            </div>
          )}
          {mobileTab === "canvas" && (
            <div className="h-full flex flex-col">
              <Canvas />
              {selectedBlockId && (
                <Sheet open={configOpen} onOpenChange={setConfigOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="absolute bottom-20 right-4 z-10 shadow-lg"
                    >
                      <Settings2 className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[70vh] p-0">
                    <ConfigPanel />
                  </SheetContent>
                </Sheet>
              )}
            </div>
          )}
          {mobileTab === "preview" && (
            <Tabs defaultValue="preview" className="flex-1 flex flex-col h-full">
              <div className="border-b border-border p-2">
                <TabsList className="w-full">
                  <TabsTrigger value="preview" className="flex-1 gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="markdown" className="flex-1 gap-2">
                    <Code className="w-4 h-4" />
                    Markdown
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
                <OutputPanel mode="preview" />
              </TabsContent>
              <TabsContent value="markdown" className="flex-1 m-0 overflow-hidden">
                <OutputPanel mode="markdown" />
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="border-t border-border bg-card p-2 safe-area-inset-bottom">
          <div className="flex items-center justify-around">
            <Button
              variant={mobileTab === "blocks" ? "secondary" : "ghost"}
              size="sm"
              className="flex-1 flex-col h-auto py-2 gap-1"
              onClick={() => setMobileTab("blocks")}
            >
              <Blocks className="w-5 h-5" />
              <span className="text-xs">Blocks</span>
            </Button>
            <Button
              variant={mobileTab === "canvas" ? "secondary" : "ghost"}
              size="sm"
              className="flex-1 flex-col h-auto py-2 gap-1"
              onClick={() => setMobileTab("canvas")}
            >
              <PanelLeft className="w-5 h-5" />
              <span className="text-xs">Canvas</span>
            </Button>
            <Button
              variant={mobileTab === "preview" ? "secondary" : "ghost"}
              size="sm"
              className="flex-1 flex-col h-auto py-2 gap-1"
              onClick={() => setMobileTab("preview")}
            >
              <Eye className="w-5 h-5" />
              <span className="text-xs">Preview</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
