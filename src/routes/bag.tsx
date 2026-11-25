import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag, X } from "lucide-react";
import { DELIVERY_FEE, formatINR } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { btn, CollectionTag } from "@/components/mauka/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bag")({
  head: () => ({
    meta: [
      { title: "Your bag — Mauka" },
      { name: "description", content: "Review the one-off pieces in your Mauka bag." },
      { property: "og:title", content: "Your bag — Mauka" },
      { property: "og:description", content: "Review your pieces before checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BagPage,
});

function BagPage() {
  const { bag, products, removeFromBag, isSold, ready } = useStore();
  const items = bag.map((id) => products.find((p) => p.id === id)).filter((p) => !!p);
  const subtotal = items.reduce((a, p) => a + p.price, 0);
  if (!ready) return <div className="py-24 text-center text-muted-foreground">Loading…</div>;
  if (!items.length)
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 font-display text-5xl">Your bag is empty</h1>
        <p className="mt-2 text-muted-foreground">Every piece is one of one. Grab it before someone else does.</p>
        <Link to="/collection" className={cn(btn({ size: "lg" }), "mt-8")}>Browse the collection</Link>
      </div>
    );
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-6xl">Your bag</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-border">
          {items.map((p) => (
            <li key={p.id} className="reveal flex gap-4 py-5">
              <Link to="/product/$id" params={{ id: p.id }} className="zoom-img h-28 w-24 shrink-0 overflow-hidden rounded-xl"><img src={p.photos[0]?.src} alt={p.title} className="h-full w-full object-cover" /></Link>
              <div className="min-w-0 flex-1">
                <CollectionTag c={p.collection} />
                <p className="mt-1 font-medium">{p.title}</p>
                <p className="text-sm text-muted-foreground">Size {p.size} · Qty 1 (one-off)</p>
                {isSold(p) && <p className="mt-1 text-sm font-medium text-destructive">This piece has sold. Remove it to check out.</p>}
              </div>
              <div className="flex flex-col items-end justify-between">
                <p className="font-semibold">{formatINR(p.price)}</p>
                <button onClick={() => removeFromBag(p.id)} className="press inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive"><X className="h-4 w-4" />Remove</button>
              </div>
            </li>
          ))}
        </ul>
        <aside className="h-fit rounded-3xl bg-card p-6 shadow-lift">
          <dl className="space-y-3">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatINR(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd>{formatINR(DELIVERY_FEE)}</dd></div>
            <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold"><dt>Total</dt><dd>{formatINR(subtotal + DELIVERY_FEE)}</dd></div>
          </dl>
          <Link to="/checkout" className={cn(btn({ variant: "primary", size: "lg" }), "mt-6 w-full")}>Checkout</Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">Demo checkout. No payment is taken.</p>
        </aside>
      </div>
    </div>
  );
}
