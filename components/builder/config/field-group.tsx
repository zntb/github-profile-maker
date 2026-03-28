'use client';

interface FieldGroupProps {
  children: React.ReactNode;
}

export function FieldGroup({ children }: FieldGroupProps) {
  return <div className="space-y-2">{children}</div>;
}
