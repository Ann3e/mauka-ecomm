import { Link } from "@tanstack/react-router";
import { Logo } from "./ui";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo className="text-5xl" />
          <p className="mt-4 max-w-xs font-display text-3xl">Make secondhand second nature.</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="mb-3 font-semibold uppercase tracking-widest opacity-60">Shop</p>
          <Link to="/re-sell" className="block hover:underline">Re-sell</Link>
          <Link to="/re-new" className="block hover:underline">Re-new</Link>
          <Link to="/re-exchange" className="block hover:underline">Re-exchange</Link>
          <Link to="/re-imagine" className="block hover:underline">Re-imagine</Link>
          <Link to="/re-source" className="block hover:underline">Re-source</Link>
          <Link to="/tailor-studio" className="block hover:underline">Tailor Studio</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="mb-3 font-semibold uppercase tracking-widest opacity-60">Help & orders</p>
          <Link to="/sell" className="block hover:underline">List an item</Link>
          <Link to="/orders" className="block hover:underline">Track your orders</Link>
          <Link to="/about" className="block hover:underline">About Mauka</Link>
        </div>
      </div>
    </footer>
  );
}
