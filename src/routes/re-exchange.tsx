import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Repeat2, X } from "lucide-react";
import { useState } from "react";
import { EXCHANGE_LISTINGS } from "@/lib/exchange-listings";
import { useStore } from "@/lib/store";
import { pageHead } from "@/lib/head";
import { btn } from "@/components/mauka/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/re-exchange")({
  head: () => pageHead("Re-exchange", "Swap clothes directly with other people. No prices, just pieces and preferences."),
  component: ReExchange,
});

function ReExchange() {
  const { exchangeRequests, updateExchangeRequest, user } = useStore();
  const [demoRequestStatus, setDemoRequestStatus] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const myRequests = exchangeRequests.filter((request) => request.requesterEmail === (user?.email ?? "guest"));
  const ownerRequests = exchangeRequests;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-8 rounded-[2rem] bg-hero p-8 sm:p-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary"><Repeat2 className="h-4 w-4" /> Re-exchange</p>
          <h1 className="mt-4 font-display text-6xl sm:text-7xl">Your wardrobe,<br /><em className="text-primary">their next favourite.</em></h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">Swap directly with other people. No prices, no cart — just good clothes finding a new home.</p>
        </div>
        <div className="rounded-3xl border border-border bg-card/85 p-6">
          <p className="font-semibold">How it works</p>
          <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>01 · Choose a piece marked Open to exchange.</li>
            <li>02 · Send the owner your outfit details.</li>
            <li>03 · Agree on the swap after approval.</li>
          </ol>
        </div>
      </div>

      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-5xl">Open to exchange</h2>
            <p className="mt-2 text-muted-foreground">Community pieces available for a direct swap.</p>
          </div>
          <span className="rounded-full bg-wear px-4 py-2 text-xs font-bold tracking-widest text-wear-foreground">SWAP ONLY · NO PRICES</span>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EXCHANGE_LISTINGS.map((listing) => (
            <article key={listing.id} className="overflow-hidden rounded-[2rem] border border-border bg-card">
              <Link to="/exchange-request/$listingId" params={{ listingId: listing.id }} className="zoom-img block aspect-[4/3] overflow-hidden bg-secondary" aria-label={`Exchange for ${listing.title}`}>
                <img src={listing.image} alt={listing.title} className="h-full w-full object-cover" />
              </Link>
              <div className="p-6">
                <span className="inline-flex rounded-full bg-wear px-3 py-1 text-[11px] font-bold tracking-widest text-wear-foreground">OPEN TO EXCHANGE</span>
                <h3 className="mt-4 font-display text-3xl">{listing.title}</h3>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div><dt className="text-muted-foreground">Category</dt><dd className="font-medium">{listing.category}</dd></div>
                  <div><dt className="text-muted-foreground">Size</dt><dd className="font-medium">{listing.size}</dd></div>
                  <div><dt className="text-muted-foreground">Condition</dt><dd className="font-medium">{listing.condition}</dd></div>
                  <div><dt className="text-muted-foreground">Owner</dt><dd className="font-medium">{listing.ownerName}</dd></div>
                </dl>
                <p className="mt-4 text-sm text-muted-foreground"><strong className="text-foreground">Preferences:</strong> {listing.preferences}</p>
                <Link to="/exchange-request/$listingId" params={{ listingId: listing.id }} className={cn(btn({ size: "md" }), "mt-6 w-full")}>
                  EXCHANGE <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-4xl">My exchange requests</h2>
          <div className="mt-5 space-y-4">
            {myRequests.length === 0 && <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">Your submitted requests will appear here with their current status.</p>}
            {myRequests.map((request) => (
              <article key={request.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
                <img src={request.outfitPhoto} alt={request.outfitName} className="h-24 w-20 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                <p className="font-semibold">{request.listingTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">Your offer: {request.outfitName} · {request.category} · {request.size}</p>
                  <span className={cn("mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold", request.status === "Approved" ? "bg-wear text-wear-foreground" : request.status === "Rejected" ? "bg-destructive/10 text-destructive" : "bg-secondary")}>{request.status}</span>
                  {request.status === "Approved" && <p className="mt-3 flex items-center gap-2 text-sm text-primary"><Check className="h-4 w-4" />Next: agree on a safe handover and exchange date with the owner.</p>}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-4xl">Owner request inbox</h2>
          <p className="mt-2 text-sm text-muted-foreground">Demo owner controls let you review incoming requests, then approve or reject before a swap is confirmed.</p>
          <div className="mt-5 space-y-4">
            {ownerRequests.map((request) => (
              <article key={request.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start gap-4">
                  <img src={request.outfitPhoto} alt={request.outfitName} className="h-24 w-20 rounded-xl object-cover" />
                  <div><p className="font-semibold">{request.requesterName} wants to swap for {request.listingTitle}</p><p className="mt-1 text-sm text-muted-foreground">Offering: {request.outfitName} · {request.category} · {request.size} · {request.condition}</p><p className="mt-2 text-sm">{request.description}</p>{request.message && <p className="mt-2 text-sm italic text-muted-foreground">“{request.message}”</p>}</div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">Interested in: {request.interestedIn} · Status: {request.status}</p>
                <div className="mt-4 flex gap-2">
                  {request.status === "Pending" && <>
                    <button type="button" onClick={() => updateExchangeRequest(request.id, "Approved")} className={btn({ size: "sm" })}>Approve</button>
                    <button type="button" onClick={() => updateExchangeRequest(request.id, "Rejected")} className={btn({ variant: "outline", size: "sm" })}>Reject</button>
                  </>}
                </div>
              </article>
            ))}
            <article className="rounded-2xl border border-dashed border-border bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sample request · incoming</p>
              <p className="mt-3 font-semibold">Riya wants to swap for your Indigo block-print kurta</p>
              <p className="mt-1 text-sm text-muted-foreground">Offering: Linen summer dress · M · Very good</p>
              <span className={cn("mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold", demoRequestStatus === "Approved" ? "bg-wear text-wear-foreground" : demoRequestStatus === "Rejected" ? "bg-destructive/10 text-destructive" : "bg-secondary")}>{demoRequestStatus}</span>
              {demoRequestStatus === "Pending" ? (
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => setDemoRequestStatus("Approved")} className={btn({ size: "sm" })}>Approve</button>
                  <button type="button" onClick={() => setDemoRequestStatus("Rejected")} className={btn({ variant: "outline", size: "sm" })}>Reject</button>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">Demo decision saved for this session. {demoRequestStatus === "Approved" ? "Next, agree on the exchange handover." : "The request was declined."}</p>
              )}
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
