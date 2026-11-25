import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/resell")({
  component: () => <Navigate to="/re-sell" replace />,
});
