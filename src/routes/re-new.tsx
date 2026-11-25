import { createFileRoute } from "@tanstack/react-router";
import { CategoryLanding } from "@/components/mauka/CategoryLanding";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/re-new")({
  head: () => pageHead("Re-new", "Find imperfect clothes with plenty of life and usable fabric left."),
  component: () => <CategoryLanding collection="restyle" />,
});
