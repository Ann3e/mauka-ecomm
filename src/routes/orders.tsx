import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { z } from "zod";
import { Check, PartyPopper } from "lucide-react";
import { formatINR } from "@/lib/catalog";
import { ORDER_STEPS, useStore } from "@/lib/store";
import { pageHead } from "@/lib/head";
import { btn } from "@/components/mauka/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  validateSearch: (search) => z.object({ placed: z.string().catch("").default("") }).parse(search),
  head: () => pageHead("Your orders", "Track your Mauka orders from Placed to Delivered."),
  component: Orders,
});

function Orders() {
  const { placed } = Route.useSearch();
  const { ready, user, orders, advanceOrder } = useStore();
  if (!ready) return <div className="py-24 text-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/signin" search={{ redirect: "/orders" }} replace />;
  const mine = orders.filter((o) => o.email === user.email);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {placed && mine.some((o) => o.id === placed) && (
        <div className="reveal mb-10 rounded-3xl bg-wear p-8 text-wear-foreground">
          <PartyPopper className="h-8 w-8" />
          <h1 className="mt-3 font-display text-5xl">Order placed. Thank you!</h1>
          <p className="mt-2">Order {placed} is with the seller. They hold the piece and dispatch it to you.</p>
        </div>
      )}
      <h2 className="font-display text-5xl">Your orders</h2>
      {!mine.length && <div className="mt-10 text-center"><p className="text-muted-foreground">No orders yet.</p><Link to="/collection" className={cn(btn(), "mt-4")}>Start shopping</Link></div>}
      <div className="mt-8 space-y-6">
        {mine.map((o) => (
          <article key={o.id} className={cn("rounded-3xl border bg-card p-6", o.id === placed ? "border-primary shadow-lift" : "border-border")}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold">Order {o.id}</p>
              <p className="text-sm text-muted-foreground">{new Date(o.placedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
            </div>
            <ol className="mt-6 grid grid-cols-4" aria-label="Order status">
              {ORDER_STEPS.map((s, i) => (
                <li key={s} className="relative flex flex-col items-center text-center">
                  {i > 0 && <span className={cn("absolute right-1/2 top-4 h-0.5 w-full transition-colors duration-700", i <= o.step ? "bg-primary" : "bg-border")} />}
                  <span className={cn("relative z-10 grid h-8 w-8 place-items-center rounded-full border-2 transition-all duration-500", i <= o.step ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}>{i <= o.step ? <Check className="h-4 w-4" /> : i + 1}</span>
                  <span className={cn("mt-2 text-xs sm:text-sm", i === o.step ? "font-semibold" : "text-muted-foreground")}>{s}</span>
                  {o.history[i] && <span className="text-[11px] text-muted-foreground">{new Date(o.history[i]!).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>}
                </li>
              ))}
            </ol>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <ul className="space-y-2">{o.items.map((i) => <li key={i.id} className="flex items-center gap-3"><img src={i.photo} alt="" className="h-12 w-10 rounded-lg object-cover" /><span className="flex-1 text-sm">{i.title}</span><span className="text-sm">{formatINR(i.price)}</span></li>)}</ul>
              <div className="text-sm">
                <p className="font-medium">Delivering to</p>
                <p className="text-muted-foreground">{o.address.name}<br />{o.address.address}, {o.address.city} {o.address.pin}</p>
                <p className="mt-3">Subtotal {formatINR(o.subtotal)} · Delivery {formatINR(o.delivery)}</p>
                <p className="font-semibold">Total {formatINR(o.total)}</p>
              </div>
            </div>
            {o.step < 3 && <button onClick={() => advanceOrder(o.id)} className={cn(btn({ variant: "outline", size: "sm" }), "mt-6")}>Advance status (demo) → {ORDER_STEPS[o.step + 1]}</button>}
          </article>
        ))}
      </div>
    </div>
  );
}
