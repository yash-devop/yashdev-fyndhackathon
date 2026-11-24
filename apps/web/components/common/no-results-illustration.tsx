import {
  IconShoppingCartFilled,
  IconAt,
  IconHanger,
  IconShirtFilled,
} from "@tabler/icons-react";

export function NoResultsIllustration() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-center select-none"
    >
      <div className="flex size-10 items-center justify-center rounded-lg border border-border/70 bg-card shadow-sm sm:size-12 sm:rounded-xl -rotate-12">
        <IconHanger
          className="size-4 text-muted-foreground/70 sm:size-5"
          stroke={1.5}
        />
      </div>
      <div className="relative z-10 -mx-1.5 flex size-14 items-center justify-center rounded-xl border border-border/70 bg-card shadow-lg shadow-black/5 sm:-mx-2 sm:size-16 sm:rounded-2xl dark:shadow-black/30">
        <IconShirtFilled
          className="size-5 text-primary sm:size-6"
          stroke={1.5}
        />
      </div>
      <div className="flex size-10 items-center justify-center rounded-lg border border-border/70 bg-card shadow-sm sm:size-12 sm:rounded-xl rotate-12">
        <IconShoppingCartFilled
          className="size-4 text-muted-foreground/70 sm:size-5"
          stroke={1.5}
        />
      </div>
    </div>
  );
}
