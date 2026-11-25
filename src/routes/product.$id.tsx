import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Lightbulb, Scissors, AlertTriangle } from "lucide-react";
import { allPhotos, formatINR, relatedProducts } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/mauka/ProductCard";
import { btn, CollectionTag, DemoNote } from "@/components/mauka/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Piece details — Mauka" },
      { name: "description", content: "Photos, seller condition notes and usable parts for a one-off secondhand piece on Mauka." },
      { property: "og:title", content: "A one-off piece on Mauka" },
      { property: "og:description", content: "See the photos, condition notes and price in ₹." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { products, ready, isSold, bag, addToBag } = useStore();
  const p = products.find((x) => x.id === id);
  const [sel, setSel] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  if (!p) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="font-display text-5xl">{ready ? "This piece isn’t here." : "Loading…"}</p>
        {ready && <Link to="/re-sell" className={cn(btn(), "mt-6")}>Back to Re-sell</Link>}
      </div>
    );
  }
  const photos = allPhotos(p);
  const photo = photos[Math.min(sel, photos.length - 1)];
  const sold = isSold(p);
  const inBag = ready && bag.includes(p.id);
  const related = relatedProducts(p, products, isSold);
  const isFlaw = !!p.flawPhoto && photo === p.flawPhoto;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to={p.collection === "wear" ? "/re-sell" : "/re-new"} className="inline-flex items-center gap-2 text-sm font-medium hover:underline"><ArrowLeft className="h-4 w-4" />Back to {p.collection === "wear" ? "Re-sell" : "Re-new"}</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          <div className="flex gap-3 sm:flex-col" role="tablist" aria-label="Photos">
            {photos.map((ph, i) => (
              <button key={i} role="tab" aria-selected={sel === i} aria-label={ph.label} onClick={() => setSel(i)}
                className={cn("press relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition", sel === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100")}>
                <img src={ph.src} alt="" className="h-full w-full object-cover" />
                {ph === p.flawPhoto && <span className="absolute inset-x-0 bottom-0 bg-restyle py-0.5 text-[10px] font-bold text-restyle-foreground">FLAW</span>}
              </button>
            ))}
          </div>
          <figure className="flex-1">
            <div className="relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-3xl bg-secondary"
              onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
              onMouseLeave={() => setZoom(null)}>
              <img key={sel} src={photo?.src} alt={`${p.title} — ${photo?.label}`} className="reveal h-full w-full object-cover transition-transform duration-200"
                style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
              {isFlaw && <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-restyle px-3 py-1.5 text-xs font-bold text-restyle-foreground"><AlertTriangle className="h-3.5 w-3.5" />Flaw close-up</span>}
            </div>
            <figcaption className="mt-2 text-sm text-muted-foreground">{photo?.label}</figcaption>
          </figure>
        </div>

        <div>
          <CollectionTag c={p.collection} />
          <h1 className="mt-3 font-display text-5xl sm:text-6xl">{p.title}</h1>
          <p className="mt-4 text-3xl font-semibold text-primary">{formatINR(p.price)}</p>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-6">
            <div><dt className="text-sm text-muted-foreground">Material</dt><dd className="font-medium">{p.material}</dd></div>
            <div><dt className="text-sm text-muted-foreground">Garment</dt><dd className="font-medium">{p.type}</dd></div>
            <div><dt className="text-sm text-muted-foreground">Listed size</dt><dd><span className="mt-1 inline-block rounded-lg bg-wear px-3 py-1 font-semibold text-wear-foreground">{p.size}</span></dd></div>
          </dl>
          <p className="mt-4 text-sm text-muted-foreground">One-off piece. This is the seller’s listed size; there are no other sizes.</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {sold ? (
              <span className={cn(btn({ size: "lg" }), "pointer-events-none bg-muted text-muted-foreground")} aria-disabled>Sold</span>
            ) : inBag ? (
              <>
                <span className={cn(btn({ variant: "wear", size: "lg" }), "pointer-events-none")} role="status"><Check className="h-5 w-5" />Added to bag</span>
                <Link to="/bag" className={btn({ variant: "outline", size: "lg" })}>View bag</Link>
              </>
            ) : (
              <button onClick={() => addToBag(p.id)} className={btn({ size: "lg" })} disabled={!ready}>Add to bag</button>
            )}
          </div>

          <section className="mt-10">
            <h2 className="text-lg font-semibold">Product description</h2>
            <p className="mt-2 text-muted-foreground">{p.description}</p>
          </section>
          <section className="mt-6 rounded-3xl bg-secondary p-6">
            <h2 className="text-lg font-semibold">Seller’s condition notes</h2>
            <p className="mt-2">{p.condition}</p>
          </section>
          {p.collection === "restyle" && (
            <section className="mt-4 space-y-5 rounded-3xl bg-restyle p-6 text-restyle-foreground">
              {p.flawNote && <div><h2 className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4" />The flaw</h2><p className="mt-1">{p.flawNote}</p></div>}
              {p.usable && <div><h2 className="flex items-center gap-2 font-semibold"><Scissors className="h-4 w-4" />Usable parts</h2><p className="mt-1">{p.usable}</p></div>}
              {p.ideas && <div><h2 className="flex items-center gap-2 font-semibold"><Lightbulb className="h-4 w-4" />Ideas to try</h2><p className="mt-1">{p.ideas}</p><p className="mt-1 text-xs opacity-75">Inspiration from the seller, not a promise of the result.</p></div>}
              <Link to="/tailor-studio" className={cn(btn({ variant: "ink", size: "md" }), "mt-2")}>Contact a tailor <Scissors className="h-4 w-4" /></Link>
            </section>
          )}
          {p.sample && <DemoNote className="mt-4">Sample listing. Photos are illustrative of the garment type.</DemoNote>}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-4xl sm:text-5xl">More finds like this</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {related.map((r) => <ProductCard key={r.id} p={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
