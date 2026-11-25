import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DELIVERY_FEE, formatINR, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { isValidPin } from "@/lib/validation";
import { pageHead } from "@/lib/head";
import { btn, DemoNote, field, FieldError, label } from "@/components/mauka/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => pageHead("Checkout", "Enter your delivery details for your Mauka order."),
  component: Checkout,
});

function Checkout() {
  const { ready, user, bag, products, placeOrder } = useStore();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", address: "", city: "", pin: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [soldItems, setSoldItems] = useState<Product[]>([]);
  if (!ready) return <div className="py-24 text-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/signin" search={{ redirect: "/checkout" }} replace />;
  const items = bag.map((id) => products.find((p) => p.id === id)).filter((p) => !!p);
  if (!items.length) return <div className="mx-auto max-w-lg py-24 text-center"><p className="font-display text-4xl">Nothing to check out.</p><Link to="/collection" className={cn(btn(), "mt-6")}>Browse</Link></div>;
  const subtotal = items.reduce((a, p) => a + p.price, 0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.name.trim()) er["name"] = "Enter the recipient’s name.";
    if (!f.address.trim()) er["address"] = "Enter the delivery address.";
    if (!f.city.trim()) er["city"] = "Enter the city.";
    if (!isValidPin(f.pin)) er["pin"] = "Enter a valid 6-digit Indian PIN code (e.g. 560001).";
    setErr(er);
    if (Object.keys(er).length) return;
    const r = placeOrder({ ...f, pin: f.pin.trim() });
    if (r.soldItems) { setSoldItems(r.soldItems); return; }
    if (r.order) navigate({ to: "/orders", search: { placed: r.order.id } });
  };
  const input = (k: keyof typeof f, l: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={k} className={label}>{l}</label>
      <input id={k} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!err[k]} className={cn(field, err[k] && "border-destructive")} {...props} />
      <FieldError msg={err[k]} />
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-6xl">Checkout</h1>
      <p className="mt-2 text-muted-foreground">Signed in as {user.email}</p>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <form onSubmit={submit} noValidate className="space-y-5">
          {soldItems.length > 0 && (
            <div role="alert" className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
              <p className="font-semibold">Sorry, {soldItems.length === 1 ? "a piece" : "some pieces"} sold while you were checking out:</p>
              <ul className="mt-1 list-disc pl-5">{soldItems.map((p) => <li key={p.id}>{p.title} — remove it from <Link to="/bag" className="underline">your bag</Link> to continue.</li>)}</ul>
            </div>
          )}
          {input("name", "Full name", { autoComplete: "name" })}
          {input("address", "Address", { autoComplete: "street-address" })}
          <div className="grid gap-5 sm:grid-cols-2">
            {input("city", "City", { autoComplete: "address-level2" })}
            {input("pin", "PIN code", { inputMode: "numeric", maxLength: 6, autoComplete: "postal-code" })}
          </div>
          <DemoNote>Demo checkout: no payment is collected. Your order is saved in this browser only.</DemoNote>
          <button type="submit" className={cn(btn({ variant: "primary", size: "lg" }), "w-full")}>Place order · {formatINR(subtotal + DELIVERY_FEE)}</button>
        </form>
        <aside className="h-fit rounded-3xl bg-card p-6 shadow-lift">
          <ul className="space-y-3">{items.map((p) => <li key={p.id} className="flex items-center gap-3"><img src={p.photos[0]?.src} alt="" className="h-14 w-12 rounded-lg object-cover" /><span className="flex-1 text-sm">{p.title}</span><span className="text-sm font-medium">{formatINR(p.price)}</span></li>)}</ul>
          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatINR(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd>{formatINR(DELIVERY_FEE)}</dd></div>
            <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd>{formatINR(subtotal + DELIVERY_FEE)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
