import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { Collection } from "@/lib/catalog";

export const btn = cva(
  "press inline-flex items-center justify-center gap-2 rounded-full font-medium disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        ink: "bg-ink text-ink-foreground hover:bg-primary",
        primary: "bg-primary text-primary-foreground hover:bg-ink",
        outline: "border border-foreground/80 hover:bg-foreground hover:text-background",
        wear: "bg-wear text-wear-foreground hover:bg-primary hover:text-primary-foreground",
        restyle: "bg-restyle text-restyle-foreground hover:bg-restyle-foreground hover:text-restyle",
        ghost: "hover:bg-secondary",
        chip: "border border-border bg-card hover:border-foreground",
        chipOn: "border border-ink bg-ink text-ink-foreground",
      },
      size: { sm: "h-9 px-4 text-sm", md: "h-11 px-6", lg: "h-14 px-8 text-lg", icon: "h-10 w-10" },
    },
    defaultVariants: { variant: "ink", size: "md" },
  },
);

export function CollectionTag({ c, className }: { c: Collection; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", c === "wear" ? "bg-wear text-wear-foreground" : "bg-restyle text-restyle-foreground", className)}>
      {c === "wear" ? "Re-sell" : "Re-new"}
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-deva text-3xl font-extrabold leading-none tracking-tight", className)} aria-label="Mauka">
      मौका<span className="text-primary">.</span>
    </span>
  );
}

export const field = "w-full rounded-xl border border-input bg-card px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
export const label = "mb-1.5 block text-sm font-medium";
export function FieldError({ msg }: { msg?: string | undefined }) {
  return msg ? <p role="alert" className="mt-1.5 text-sm text-destructive">{msg}</p> : null;
}
export function DemoNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("rounded-xl border border-dashed border-primary/40 bg-accent/50 px-4 py-2 text-xs text-accent-foreground", className)}>{children}</p>;
}
