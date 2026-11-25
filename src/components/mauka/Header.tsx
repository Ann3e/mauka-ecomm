import { Link, useNavigate } from "@tanstack/react-router";
import { Search, User, ShoppingBag, X, Menu } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Logo } from "./ui";

const nav = [
  { to: "/", label: "Home" },
  { to: "/re-sell", label: "Re-sell" },
  { to: "/re-new", label: "Re-new" },
  { to: "/re-exchange", label: "Re-exchange" },
  { to: "/re-imagine", label: "Re-imagine" },
  { to: "/re-source", label: "Re-source" },
  { to: "/tailor-studio", label: "Tailor Studio" },
] as const;

export function Header() {
  const { bag, ready } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const count = ready ? bag.length : 0;
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6">
        <Link to="/" aria-label="Mauka home"><Logo /></Link>
        <nav className="hidden justify-center gap-3 lg:flex xl:gap-5" aria-label="Main">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="relative whitespace-nowrap py-1 text-xs font-medium after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:after:scale-x-100 data-[status=active]:after:scale-x-100 xl:text-sm">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="col-start-3 flex items-center gap-1">
          <button aria-label="Search" onClick={() => setSearchOpen((v) => !v)} className="press grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"><Search className="h-5 w-5" /></button>
          <Link to="/account" aria-label="Account" className="press grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"><User className="h-5 w-5" /></Link>
          <Link to="/bag" aria-label={`Shopping bag, ${count} items`} className="press relative grid h-10 w-10 place-items-center rounded-full hover:bg-secondary">
            <ShoppingBag className="h-5 w-5" />
            <span key={count} className="reveal absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">{count}</span>
          </Link>
          <button aria-label="Menu" onClick={() => setMenu((v) => !v)} className="press grid h-10 w-10 place-items-center rounded-full hover:bg-secondary lg:hidden">{menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>
      {menu && (
        <nav className="reveal border-t border-border px-4 py-3 lg:hidden" aria-label="Mobile">
          {nav.map((n) => <Link key={n.to} to={n.to} onClick={() => setMenu(false)} className="block py-2 text-lg font-medium">{n.label}</Link>)}
        </nav>
      )}
      {searchOpen && (
        <form className="reveal border-t border-border bg-background px-4 py-3" onSubmit={(e) => { e.preventDefault(); setSearchOpen(false); navigate({ to: "/collection", search: { c: "all", q } }); }}>
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jeans, saree, silk…" aria-label="Search the collection" className="h-11 w-full bg-transparent text-lg outline-none" />
            <button type="submit" className="press rounded-full bg-ink px-5 py-2 text-sm text-ink-foreground">Search</button>
          </div>
        </form>
      )}
    </header>
  );
}
