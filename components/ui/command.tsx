'use client';

import { Search as SearchIcon } from 'lucide-react';
import * as React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

function Command({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="command"
      className={cn(
        'flex size-full flex-col overflow-hidden rounded-xl bg-popover p-1 text-popover-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CommandDialogProps extends React.ComponentProps<typeof Dialog> {
  title?: string;
  description?: string;
  className?: string;
}

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  ...props
}: CommandDialogProps) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn('top-1/3 translate-y-0 overflow-hidden rounded-xl p-0', className)}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

type CommandInputProps = React.InputHTMLAttributes<HTMLInputElement>;

function CommandInput({ className, placeholder, ...props }: CommandInputProps) {
  return (
    <div data-slot="command-input-wrapper" className="flex items-center border-b px-3 py-2">
      <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <input
        placeholder={placeholder}
        className={cn(
          'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="command-list"
      className={cn(
        'no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CommandEmpty({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="command-empty" className={cn('py-6 text-center text-sm', className)} {...props}>
      {children}
    </div>
  );
}

function CommandGroup({
  className,
  heading,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { heading?: string }) {
  return (
    <div
      data-slot="command-group"
      className={cn('overflow-hidden p-1 text-foreground', className)}
      {...props}
    >
      {heading && (
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{heading}</div>
      )}
      {children}
    </div>
  );
}

function CommandItem({
  className,
  children,
  onSelect,
  ...props
}: React.LiHTMLAttributes<HTMLLIElement> & { onSelect?: () => void }) {
  const handleClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <li
      data-slot="command-item"
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </li>
  );
}

function CommandSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="command-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  );
}

function CommandShortcut({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)} {...props}>
      {children}
    </span>
  );
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
