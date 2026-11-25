import { createFileRoute } from "@tanstack/react-router";
import { CategoryLanding } from "@/components/mauka/CategoryLanding";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/re-sell")({
  head: () => pageHead("Re-sell", "Pre-loved pieces ready for their next favourite person."),
  component: () => <CategoryLanding collection="wear" />,
});
