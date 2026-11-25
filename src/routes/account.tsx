import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { pageHead } from "@/lib/head";
import { ProductCard } from "@/components/mauka/ProductCard";
import { btn } from "@/components/mauka/ui";

export const Route = createFileRoute("/account")({
  head: () => pageHead("Your account", "Your Mauka account, listings and orders."),
  component: Account,
});

function Account() {
  const { ready, user, signOut, listings, orders } = useStore();
  if (!ready) return <div className="py-24 text-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/signin" search={{ redirect: "/account" }} replace />;
  const mine = listings.filter((l) => l.sellerEmail === user.email);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
      <h1 className="font-display text-6xl">Namaste, {user.name.split(" ")[0]}</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/orders" className={btn()}>Your orders ({orders.filter((o) => o.email === user.email).length})</Link>
        <Link to="/sell" className={btn({ variant: "primary" })}>List an item</Link>
        <button onClick={signOut} className={btn({ variant: "outline" })}>Sign out</button>
      </div>
      <h2 className="mt-14 font-display text-4xl">Your listings</h2>
      {mine.length ? <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{mine.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <p className="mt-3 text-muted-foreground">You haven’t listed anything yet.</p>}
    </div>
  );
}
