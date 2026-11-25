import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Clock3, MapPin, Scissors } from "lucide-react";
import { formatINR } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { pageHead } from "@/lib/head";
import { btn, field } from "@/components/mauka/ui";
import { cn } from "@/lib/utils";
import saree from "@/assets/saree.jpg";
import lehenga from "@/assets/lehenga.jpg";
import kurta from "@/assets/kurta.jpg";
import dress from "@/assets/dress.jpg";
import dupatta from "@/assets/dupatta.jpg";
import blazer from "@/assets/blazer.jpg";
import shirt from "@/assets/shirt.jpg";

export const Route = createFileRoute("/re-source")({
  head: () => pageHead("Re-source", "Transform fabric you already own into an outfit you want to wear."),
  component: ReSource,
});

const transformations = [
  { before: "Old saree", after: "Lehenga", source: saree, result: lehenga, price: 4200, days: 14 },
  { before: "Old silk saree", after: "Anarkali suit", source: saree, result: kurta, price: 5600, days: 18 },
  { before: "Old saree", after: "Contemporary dress", source: saree, result: dress, price: 3800, days: 12 },
  { before: "Old dupatta", after: "Short jacket", source: dupatta, result: blazer, price: 3200, days: 10 },
  { before: "Old fabric", after: "Co-ord set", source: shirt, result: dress, price: 4800, days: 16 },
  { before: "Old silk saree", after: "Festive kurti", source: saree, result: kurta, price: 2900, days: 9 },
];

const studios = [
  { id: "studio-gulmohar", name: "Studio Gulmohar", city: "Bengaluru", specialty: "Saree and festive rework" },
  { id: "unfold-studio", name: "Unfold Studio", city: "Mumbai", specialty: "Contemporary separates and co-ords" },
  { id: "baandhani-studio", name: "Baandhani Atelier", city: "Delhi", specialty: "Traditional textiles and occasion wear" },
];

function ReSource() {
  const { sourceRequests, updateSourceRequest, user } = useStore();
  const [sampleSelected, setSampleSelected] = useState(false);
  const [quoteValues, setQuoteValues] = useState<Record<string, { price: string; days: string }>>({});
  const ownRequests = sourceRequests.filter((request) => request.email === (user?.email ?? "guest"));

  const propose = (id: string) => {
    const quote = quoteValues[id] ?? { price: "3200", days: "12" };
    updateSourceRequest(id, {
      status: "Proposal Received",
      tailorId: "studio-gulmohar",
      tailorName: "Studio Gulmohar",
      proposedPrice: Number(quote.price),
      estimatedDays: Number(quote.days),
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="grid gap-8 rounded-[2rem] bg-hero p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary"><Scissors className="h-4 w-4" /> Re-source</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl sm:text-7xl">Your fabric.<br /><em className="text-primary">Your next favourite outfit.</em></h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">Keep the saree, dupatta or fabric you already own. Connect with a tailor to make something completely new from it.</p>
        </div>
        <Link to="/re-source-request" className={btn({ size: "lg" })}>CREATE MY DESIGN REQUEST <ArrowRight className="h-5 w-5" /></Link>
      </header>

      <section className="mt-14">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Transformation inspiration</p>
          <h2 className="mt-3 font-display text-5xl">Before, meet after</h2>
          <p className="mt-3 text-muted-foreground">Indicative examples only. A tailor will confirm final construction, price and timing with you.</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {transformations.map((example) => (
            <article key={`${example.before}-${example.after}`} className="overflow-hidden rounded-[2rem] border border-border bg-card">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 p-3">
                <figure><img src={example.source} alt={`Before: ${example.before}`} className="aspect-[4/5] w-full rounded-2xl object-cover" /><figcaption className="mt-2 text-center text-xs font-semibold">BEFORE · {example.before}</figcaption></figure>
                <ArrowRight className="h-5 w-5 text-primary" />
                <figure><img src={example.result} alt={`After: ${example.after}`} className="aspect-[4/5] w-full rounded-2xl object-cover" /><figcaption className="mt-2 text-center text-xs font-semibold">AFTER · {example.after}</figcaption></figure>
              </div>
              <div className="px-5 pb-5">
                <h3 className="font-display text-2xl">{example.before} → {example.after}</h3>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground"><span className="inline-flex items-center gap-1"><Scissors className="h-4 w-4" /> From {formatINR(example.price)}</span><span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" /> About {example.days} days</span></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="font-display text-4xl">Independent tailor studios</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sample profiles for the design-request demo.</p>
          <div className="mt-5 space-y-3">
            {studios.map((studio) => <article key={studio.id} className="rounded-2xl border border-border bg-card p-4"><h3 className="font-semibold">{studio.name}</h3><p className="mt-1 text-sm text-muted-foreground">{studio.specialty}</p><p className="mt-2 flex items-center gap-1 text-xs"><MapPin className="h-3 w-3" />{studio.city}</p></article>)}
          </div>
        </div>
        <div>
          <h2 className="font-display text-4xl">My design requests</h2>
          <div className="mt-5 space-y-4">
            {ownRequests.length === 0 && <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">Create a request to track tailor acceptance, proposals and your selected studio here.</p>}
            {ownRequests.map((request) => (
              <article key={request.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="flex shrink-0 gap-2"><img src={request.sourcePhoto} alt="Your fabric" className="h-20 w-16 rounded-xl object-cover" /><img src={request.inspirationPhoto} alt="Design inspiration" className="h-20 w-16 rounded-xl object-cover" /></div>
                    <div><h3 className="font-semibold">{request.material}</h3><p className="mt-1 text-sm text-muted-foreground">{request.description}</p></div>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">{request.status}</span>
                </div>
                {request.status === "Pending" && <button type="button" onClick={() => updateSourceRequest(request.id, { status: "Accepted", tailorId: "studio-gulmohar", tailorName: "Studio Gulmohar" })} className={cn(btn({ variant: "outline", size: "sm" }), "mt-4")}>Tailor demo: accept request</button>}
                {request.status === "Accepted" && (
                  <div className="mt-4 flex flex-wrap items-end gap-3">
                    <label className="text-xs">Proposed ₹<input value={(quoteValues[request.id] ?? { price: "3200", days: "12" }).price} onChange={(event) => setQuoteValues((values) => ({ ...values, [request.id]: { ...(values[request.id] ?? { price: "3200", days: "12" }), price: event.target.value } }))} className={cn(field, "mt-1 h-10 w-28 px-3")} inputMode="numeric" /></label>
                    <label className="text-xs">Days<input value={(quoteValues[request.id] ?? { price: "3200", days: "12" }).days} onChange={(event) => setQuoteValues((values) => ({ ...values, [request.id]: { ...(values[request.id] ?? { price: "3200", days: "12" }), days: event.target.value } }))} className={cn(field, "mt-1 h-10 w-20 px-3")} inputMode="numeric" /></label>
                    <button type="button" onClick={() => propose(request.id)} className={btn({ size: "sm" })}>Send tailor proposal</button>
                  </div>
                )}
                {request.status === "Proposal Received" && <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm">{request.tailorName}: <strong>{formatINR(request.proposedPrice ?? 0)}</strong> · {request.estimatedDays} days</p><button type="button" onClick={() => updateSourceRequest(request.id, { status: "Tailor Selected" })} className={btn({ size: "sm" })}>Select this tailor</button></div>}
                {request.status === "Tailor Selected" && <p className="mt-4 flex items-center gap-2 text-sm text-primary"><Check className="h-4 w-4" />You selected {request.tailorName} · {formatINR(request.proposedPrice ?? 0)} · {request.estimatedDays} days</p>}
              </article>
            ))}
            <article className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="text-xs font-bold uppercase tracking-widest text-primary">Sample tailor proposal</p><h3 className="mt-2 font-semibold">Studio Gulmohar · Old silk saree → festive kurti</h3></div>
                <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold">{sampleSelected ? "Tailor Selected" : "Proposal Received"}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Proposed {formatINR(2800)} · Estimated 10 days</p>
              {!sampleSelected && <button type="button" onClick={() => setSampleSelected(true)} className={cn(btn({ size: "sm" }), "mt-4")}>Select sample tailor <Check className="h-4 w-4" /></button>}
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
