"use client";

import * as React from "react";
import { cn } from "cn";

type RecordTableColumn = {
  key: string;
  header: React.ReactNode;
  className?: string;
};

const RecordTableGridContext = React.createContext<string>("");

function RecordTable({
  columns,
  grid,
  className,
  children,
}: {
  columns: RecordTableColumn[];
  grid: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <RecordTableGridContext.Provider value={grid}>
      <div
        role="table"
        className={cn(
          "rounded-[calc(var(--radius-xl)+var(--spacing))] border border-border/60 bg-muted/30 p-1 shadow-sm",
          className,
        )}
      >
        <div
          role="row"
          className={cn(
            "hidden items-center gap-4 px-4 py-3.5 text-sm text-muted-foreground md:grid",
            grid,
          )}
        >
          {columns.map((column) => (
            <span
              key={column.key}
              role="columnheader"
              className={cn("text-xs", column.className)}
            >
              {column.header}
            </span>
          ))}
        </div>
        <div
          role="rowgroup"
          className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs"
        >
          {children}
        </div>
      </div>
    </RecordTableGridContext.Provider>
  );
}

function RecordTableRow({ className, ...props }: React.ComponentProps<"div">) {
  const grid = React.useContext(RecordTableGridContext);

  return (
    <div
      role="row"
      className={cn(
        "group relative flex flex-col gap-3 border-b border-border/60 px-4 py-4 transition-colors last:border-b-0 hover:bg-muted/30 md:grid md:items-center md:gap-4",
        grid,
        className,
      )}
      {...props}
    />
  );
}

export { RecordTable, RecordTableRow, type RecordTableColumn };
