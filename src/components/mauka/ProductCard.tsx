import { Link } from "@tanstack/react-router";
import { formatINR, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { CollectionTag } from "./ui";

export function ProductCard({ p }: { p: Product }) {
  const { isSold } = useStore();
  const sold = isSold(p);
  return (
    <Link to="/product/$id" params={{ id: p.id }} className="group block">
      <div className="zoom-img lift relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
        <img src={p.photos[0]?.src} alt={p.title} loading="lazy" className={sold ? "h-full w-full object-cover grayscale-[60%] opacity-70" : "h-full w-full object-cover"} />
        {sold && <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-foreground">Sold</span>}
        {p.flawPhoto && !sold && (
          <span className="absolute inset-x-3 bottom-3 translate-y-3 rounded-full bg-card/95 px-3 py-2 text-center text-xs font-medium opacity-0 backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100">
            Flaw shown · see usable parts
          </span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <CollectionTag c={p.collection} />
          <h3 className="mt-1.5 truncate font-medium">{p.title}</h3>
          <p className="font-semibold">{formatINR(p.price)}</p>
        </div>
        {p.size && <span className="shrink-0 pt-7 text-sm text-muted-foreground">{p.size}</span>}
      </div>
    </Link>
  );
}
