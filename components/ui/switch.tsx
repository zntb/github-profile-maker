'use client';

import { Switch as SwitchPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

function Switch({
  className,
  size = 'default',
  checked,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: 'sm' | 'default';
}) {
  const isChecked = Boolean(checked);
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        'peer group/switch relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
        size === 'default' && 'h-6 w-11',
        size === 'sm' && 'h-5 w-9',
        className,
      )}
      style={{ backgroundColor: isChecked ? '#22c55e' : '#d1d5db' }}
      checked={checked}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block rounded-full bg-white shadow-lg ring-0',
          size === 'default' && 'h-5 w-5 translate-x-0',
          size === 'sm' && 'h-4 w-4',
        )}
        style={{
          transform: isChecked
            ? size === 'default'
              ? 'translateX(20px)'
              : 'translateX(16px)'
            : 'translateX(0)',
        }}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
