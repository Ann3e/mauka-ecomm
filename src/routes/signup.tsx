import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { pageHead } from "@/lib/head";
import { AuthForm } from "@/components/mauka/AuthForm";

export const Route = createFileRoute("/signup")({
  validateSearch: zodValidator(z.object({ redirect: fallback(z.string(), "/account").default("/account") })),
  head: () => pageHead("Sign up", "Sign up to Mauka to check out, list items and track orders."),
  component: Page,
});

function Page() {
  const { redirect } = Route.useSearch();
  return <AuthForm mode="signup" redirect={redirect} />;
}
