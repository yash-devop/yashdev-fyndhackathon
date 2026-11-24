import type { ReactNode } from "react";

type StatePanelProps = {
  icon?: ReactNode;
  illustration?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function StatePanel({
  icon,
  illustration,
  title,
  description,
  action,
}: StatePanelProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-14 text-center">
      {illustration ? (
        <div className="mb-3">{illustration}</div>
      ) : icon ? (
        <div className="text-muted-foreground mb-1">{icon}</div>
      ) : null}
      <p className="text-sm font-medium">{title}</p>
      {description ? (
        <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
