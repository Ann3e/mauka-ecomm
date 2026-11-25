import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/head";
import { btn } from "@/components/mauka/ui";

export const Route = createFileRoute("/contact")({
  head: () => pageHead("Contact", "How to get help with Mauka orders and listings."),
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h1 className="font-display text-6xl sm:text-7xl">Say hello</h1>
      <p className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground">
        Mauka is a prototype, so there’s no support inbox yet. For order questions, open your orders page; to sell, list an item.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/orders" className={btn({ size: "lg" })}>Track an order</Link>
        <Link to="/sell" className={btn({ variant: "outline", size: "lg" })}>List an item</Link>
      </div>
    </div>
  );
}
