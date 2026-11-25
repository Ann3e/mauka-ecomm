import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/exchange")({
  component: () => <Navigate to="/re-exchange" replace />,
});
