import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo, useState } from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { GARMENT_TYPES, MATERIALS, SIZES } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/mauka/ProductCard";
import { btn } from "@/components/mauka/ui";
import { cn } from "@/lib/utils";

const schema = z.object({
  c: fallback(z.string(), "all").default("all"),
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/collection")({
  validateSearch: zodValidator(schema),
  head: () => ({
    meta: [
      { title: "Collection — Mauka secondhand fashion" },
      { name: "description", content: "Browse pre-loved Wear and imperfect Restyle pieces. Filter by garment, size, material and availability." },
      { property: "og:title", content: "The Mauka collection" },
      { property: "og:description", content: "Search secondhand Western and Indian clothing in ₹." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CollectionPage,
});

const SORTS = { newest: "Newest", "price-asc": "Price: low to high", "price-desc": "Price: high to low", name: "Name" } as const;
type SortKey = keyof typeof SORTS;

function CollectionPage() {
  const { c, q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { products, isSold } = useStore();
  const collection = ["wear", "restyle"].includes(c) ? c : "all";
  const [types, setTypes] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [mats, setMats] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("newest");
  const [open, setOpen] = useState(false);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = products.filter((p) =>
      (collection === "all" || p.collection === collection) &&
      (!types.length || types.includes(p.type)) &&
      (!sizes.length || sizes.includes(p.size)) &&
      (!mats.length || mats.includes(p.material)) &&
      (!availableOnly || !isSold(p)) &&
      (!term || [p.title, p.type, p.material, p.description].join(" ").toLowerCase().includes(term)),
    );
    return list.sort((a, b) =>
      sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : sort === "name" ? a.title.localeCompare(b.title) : b.createdAt - a.createdAt);
  }, [products, collection, types, sizes, mats, availableOnly, q, sort, isSold]);

  const activeCount = types.length + sizes.length + mats.length + (availableOnly ? 1 : 0) + (q ? 1 : 0);
  const clear = () => { setTypes([]); setSizes([]); setMats([]); setAvailableOnly(false); navigate({ search: (p) => ({ ...p, q: "" }) }); };

  const Group = ({ title, items, sel, set }: { title: string; items: string[]; sel: string[]; set: (v: string[]) => void }) => (
    <fieldset className="border-b border-border py-5">
      <legend className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">{title}</legend>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <button key={i} type="button" aria-pressed={sel.includes(i)} onClick={() => toggle(sel, set, i)} className={btn({ variant: sel.includes(i) ? "chipOn" : "chip", size: "sm" })}>{i}</button>
        ))}
      </div>
    </fieldset>
  );

  const filters = (
    <div>
      <Group title="Garment" items={GARMENT_TYPES} sel={types} set={setTypes} />
      <Group title="Listed size" items={SIZES} sel={sizes} set={setSizes} />
      <Group title="Material" items={MATERIALS} sel={mats} set={setMats} />
      <label className="flex cursor-pointer items-center justify-between py-5">
        <span className="font-medium">Available only</span>
        <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="h-5 w-5 accent-primary" />
      </label>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-6xl sm:text-7xl">{collection === "wear" ? "Wear" : collection === "restyle" ? "Restyle" : "The collection"}</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        {collection === "restyle" ? "Imperfect pieces with the flaw shown up close and the usable parts spelled out." : collection === "wear" ? "Pre-loved pieces ready to wear as-is." : "Every one-off piece, Wear and Restyle."}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {(["all", "wear", "restyle"] as const).map((k) => (
          <Link key={k} to="/collection" search={(p) => ({ ...p, c: k })}
            className={btn({ variant: collection === k ? (k === "wear" ? "wear" : k === "restyle" ? "restyle" : "chipOn") : "chip", size: "md" })}>
            {k === "all" ? "All" : k === "wear" ? "Wear" : "Restyle"}
          </Link>
        ))}
        <div className="relative ml-auto w-full sm:w-72">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => navigate({ search: (p) => ({ ...p, q: e.target.value }), replace: true })} placeholder="Search pieces" aria-label="Search pieces"
            className="h-11 w-full rounded-full border border-input bg-card pl-10 pr-4 outline-none focus:border-primary" />
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">{filters}</aside>
        <div>
          <div className="flex flex-wrap items-center gap-3 border-b border-border pb-4">
            <button onClick={() => setOpen((v) => !v)} aria-expanded={open} className={cn(btn({ variant: "chip", size: "sm" }), "lg:hidden")}>
              <SlidersHorizontal className="h-4 w-4" /> Filters{activeCount ? ` (${activeCount})` : ""}
            </button>
            <p className="text-sm text-muted-foreground" aria-live="polite"><strong className="text-foreground">{results.length}</strong> {results.length === 1 ? "piece" : "pieces"}</p>
            {activeCount > 0 && <button onClick={clear} className="inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4"><X className="h-3.5 w-3.5" />Clear filters</button>}
            <label className="ml-auto flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="h-9 rounded-full border border-input bg-card px-3 outline-none focus:border-primary">
                {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          </div>
          {open && <div className="reveal lg:hidden">{filters}</div>}
          {results.length ? (
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
              {results.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          ) : (
            <div className="mt-12 rounded-3xl border border-dashed border-border p-12 text-center">
              <p className="font-display text-4xl">Nothing matches… yet.</p>
              <p className="mt-2 text-muted-foreground">Try fewer filters, or switch between Wear and Restyle.</p>
              <button onClick={clear} className={cn(btn(), "mt-6")}>Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
