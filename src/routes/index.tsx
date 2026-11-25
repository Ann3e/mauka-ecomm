import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Scissors, Shirt } from "lucide-react";
import { useState } from "react";
import { heroImage, SEED, formatINR } from "@/lib/catalog";
import jeansWear from "@/assets/jeans-wear.jpg";
import jeansTorn from "@/assets/jeans-torn.jpg";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/mauka/ProductCard";
import { btn } from "@/components/mauka/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mauka — Re-sell and Re-new secondhand fashion" },
      { name: "description", content: "Shop pre-loved Western and Indian clothing through Re-sell, or find imperfect pieces with usable fabric in Re-new." },
      { property: "og:title", content: "Mauka — Make secondhand second nature" },
      { property: "og:description", content: "Pre-loved clothes to Re-sell, imperfect ones to Re-new. Prices in ₹, shipped by sellers across India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ticker = ["Kurtas", "Denim", "Sarees", "Blazers", "Dupattas", "Lehengas", "Tees", "Patchwork", "Appliqué", "Upcycling"];

function Index() {
  const { products } = useStore();
  const latest = [...products].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);
  const [mode, setMode] = useState<"wear" | "restyle">("wear");
  const jacket = SEED[0];

  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="grid overflow-hidden rounded-[2rem] bg-hero lg:grid-cols-[1.15fr_1fr]">
          <div className="flex flex-col justify-center px-6 py-14 sm:px-12 lg:py-24">
            <p className="reveal text-sm font-semibold tracking-wide text-primary">मौका means “chance” · Secondhand fashion · India</p>
            <h1 className="reveal mt-6 font-display text-[clamp(3.5rem,8vw,7.5rem)]" style={{ animationDelay: "80ms" }}>
              Good clothes.<br /><em className="text-primary">Great second acts.</em>
            </h1>
            <p className="reveal mt-6 max-w-md text-lg text-muted-foreground" style={{ animationDelay: "160ms" }}>
              Find pieces worth wearing again, and fabric worth getting creative with. Make secondhand second nature.
            </p>
            <div className="reveal mt-8 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
              <Link to="/re-sell" className={btn({ size: "lg" })}>Explore Re-sell <ArrowRight className="h-5 w-5" /></Link>
              <Link to="/re-new" className={btn({ variant: "outline", size: "lg" })}>Explore Re-new</Link>
            </div>
          </div>
          <div className="zoom-img relative min-h-[420px] overflow-hidden">
            <img src={heroImage} alt="A shopper wearing a pre-loved denim jacket over a block-printed kurta" className="absolute inset-0 h-full w-full object-cover" />
            {jacket && (
              <Link to="/product/$id" params={{ id: "indigo-kurta" }} className="press absolute bottom-5 right-5 flex items-center gap-3 rounded-full bg-card/95 px-5 py-3 text-sm font-medium shadow-lift backdrop-blur">
                Shop the look <span className="font-bold text-primary">from {formatINR(650)}</span><ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mt-10 overflow-hidden border-y border-border py-4" aria-hidden>
        <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-3xl italic">
          {[...ticker, ...ticker].map((t, i) => <span key={i} className="flex items-center gap-10">{t}<span className="text-primary">✺</span></span>)}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-5xl sm:text-6xl">Latest collection</h2>
          <Link to="/collection" className="group inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline">View everything <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {latest.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="font-display text-5xl sm:text-6xl">Two ways to shop</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">Same pair of jeans, two different chances. Flip between them.</p>
          <div role="tablist" className="mx-auto mt-8 inline-flex rounded-full border border-border bg-card p-1">
            {(["wear", "restyle"] as const).map((m) => (
              <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
                className={cn("press flex items-center gap-2 rounded-full px-6 py-2.5 font-medium", mode === m && (m === "wear" ? "bg-wear text-wear-foreground" : "bg-restyle text-restyle-foreground"))}>
                {m === "wear" ? <Shirt className="h-4 w-4" /> : <Scissors className="h-4 w-4" />}{m === "wear" ? "Re-sell" : "Re-new"}
              </button>
            ))}
          </div>
        </div>
        <div className={cn("mt-10 grid overflow-hidden rounded-[2rem] transition-colors duration-500 md:grid-cols-2", mode === "wear" ? "bg-wear" : "bg-restyle")}>
          <div className="relative aspect-square overflow-hidden md:aspect-auto md:min-h-[480px]">
            <img src={jeansWear} alt="Wearable jeans" className={cn("absolute inset-0 h-full w-full object-cover transition-all duration-700", mode === "wear" ? "scale-100 opacity-100" : "scale-110 opacity-0")} />
            <img src={jeansTorn} alt="Jeans with torn knees" className={cn("absolute inset-0 h-full w-full object-cover transition-all duration-700", mode === "restyle" ? "scale-100 opacity-100" : "scale-110 opacity-0")} />
          </div>
          <div key={mode} className={cn("reveal flex flex-col justify-center p-8 sm:p-14", mode === "wear" ? "text-wear-foreground" : "text-restyle-foreground")}>
            <p className="text-sm font-semibold uppercase tracking-widest">{mode === "wear" ? "Ready to wear" : "Our differentiator"}</p>
            <h3 className="mt-3 font-display text-5xl">{mode === "wear" ? "Pre-loved, ready as-is." : "Flawed, still full of fabric."}</h3>
            <p className="mt-5 max-w-md text-lg">
              {mode === "wear"
                ? "Clothes in good shape with honest condition notes from the seller. Wash, wear, repeat."
                : "Stains, tears or worn patches, shown up close. Sellers say which parts are intact and add ideas to try, for DIY shoppers, tailors and upcyclers."}
            </p>
            {mode === "restyle" && <p className="mt-4 max-w-md rounded-2xl bg-card/60 p-4 text-sm">“Both knees are torn. The back panels and pockets are intact.” → patchwork pouch, pocket appliqués.</p>}
            <Link to="/product/$id" params={{ id: mode === "wear" ? "straight-jeans" : "torn-knee-jeans" }} className={cn(btn({ variant: "ink" }), "mt-8 self-start")}>
              See these jeans <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 rounded-[2rem] border border-border bg-card p-8 sm:p-12 md:grid-cols-[1.5fr_1fr] md:items-center">
          <h2 className="font-display text-4xl sm:text-5xl">Got something sitting in the cupboard? Give it its <em className="text-primary">mauka</em>.</h2>
          <Link to="/sell" className={cn(btn({ variant: "primary", size: "lg" }), "md:justify-self-end")}>List an item <ArrowRight className="h-5 w-5" /></Link>
        </div>
      </section>
    </div>
  );
}
