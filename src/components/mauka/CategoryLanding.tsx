import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Collection } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/mauka/ProductCard";
import { btn } from "@/components/mauka/ui";
import { cn } from "@/lib/utils";

export function CategoryLanding({ collection }: { collection: Collection }) {
  const { products, isSold } = useStore();
  const renewing = collection === "restyle";
  const pieces = products.filter((product) => product.collection === collection && !isSold(product));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <section className={cn("grid gap-8 overflow-hidden rounded-[2rem] p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end", renewing ? "bg-restyle text-restyle-foreground" : "bg-wear text-wear-foreground")}>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em]">{renewing ? "Re-new" : "Re-sell"}</p>
          <h1 className="mt-4 max-w-3xl font-display text-6xl sm:text-7xl">{renewing ? "Worn, marked, still full of possibility." : "Your once-loved pieces, ready for their next favourite person."}</h1>
          <p className="mt-5 max-w-xl text-lg opacity-80">{renewing ? "Imperfect clothes with usable fabric, honestly shown and priced for their next chapter." : "Find pre-loved pieces in great shape, or give your own wardrobe a fresh start."}</p>
          <Link to="/sell" className={cn(btn({ variant: "ink", size: "lg" }), "mt-7")}>{renewing ? "List fabric for Re-new" : "List a piece to re-sell"} <ArrowRight className="h-5 w-5" /></Link>
        </div>
        <div className="rounded-3xl bg-card/70 p-6">
          <p className="flex items-center gap-2 font-semibold"><Sparkles className="h-4 w-4" /> {renewing ? "A little wear. A lot of potential." : "Good clothes deserve another life."}</p>
          <p className="mt-3 text-sm opacity-80">{renewing ? "Browse at lower prices, see flaws up close, and choose a piece to remake or mend." : "One-off finds from closets across the community. No two wardrobes are the same."}</p>
        </div>
      </section>
      <div className="mt-14 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl sm:text-5xl">{renewing ? "Pieces to renew" : "Latest pieces to re-sell"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{pieces.length} available {pieces.length === 1 ? "piece" : "pieces"}</p>
        </div>
        <Link to="/collection" search={{ c: collection, q: "" }} className="font-medium underline underline-offset-4">Filters and search</Link>
      </div>
      {pieces.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {pieces.map((product) => <ProductCard key={product.id} p={product} />)}
        </div>
      ) : (
        <p className="mt-8 rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">No available pieces here just yet.</p>
      )}
    </div>
  );
}
