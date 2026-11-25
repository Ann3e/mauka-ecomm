import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/head";
import { btn } from "@/components/mauka/ui";
import jeansTorn from "@/assets/jeans-torn.jpg";

export const Route = createFileRoute("/about")({
  head: () => pageHead("About", "Mauka means chance in Hindi. A secondhand marketplace with two ways to shop: Wear and Restyle."),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="font-deva text-2xl font-extrabold text-primary">मौका = chance</p>
      <h1 className="mt-4 max-w-4xl font-display text-6xl sm:text-7xl">Every garment deserves another <em className="text-primary">mauka</em>.</h1>
      <div className="mt-14 grid gap-10 md:grid-cols-2 md:items-center">
        <img src={jeansTorn} alt="Torn jeans with usable fabric" className="aspect-[4/5] w-full rounded-[2rem] object-cover" />
        <div className="space-y-5 text-lg">
          <p>Mauka is a secondhand fashion marketplace for shoppers in India, with Western and Indian clothing side by side. Sellers list and ship their own pieces.</p>
          <p><strong className="rounded bg-wear px-1.5 text-wear-foreground">Wear</strong> is for pre-loved clothes ready to wear as-is.</p>
          <p><strong className="rounded bg-restyle px-1.5 text-restyle-foreground">Restyle</strong> is for clothes with stains, tears or worn areas that still have usable fabric. Sellers show the flaw, explain what’s intact and can suggest ideas to try — a dedicated place for DIY shoppers, design students, tailors and upcyclers.</p>
          <p className="text-base text-muted-foreground">This is a student prototype: accounts, listings and orders live in your browser, and payment and delivery are simulated.</p>
          <Link to="/collection" search={{ c: "restyle" }} className={btn({ variant: "restyle", size: "lg" })}>Explore Restyle</Link>
        </div>
      </div>
    </div>
  );
}
