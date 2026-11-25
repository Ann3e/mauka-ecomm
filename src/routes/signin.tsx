import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { pageHead } from "@/lib/head";
import { AuthForm } from "@/components/mauka/AuthForm";

export const Route = createFileRoute("/signin")({
  validateSearch: (search) => z.object({ redirect: z.string().catch("/account").default("/account") }).parse(search),
  head: () => pageHead("Sign in", "Sign in to Mauka to check out, list items and track orders."),
  component: Page,
});

function Page() {
  const { redirect } = Route.useSearch();
  return <AuthForm mode="signin" redirect={redirect} />;
}
