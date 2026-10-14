import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { ModulePlaceholder } from "@/components/itsm/ModulePlaceholder";

export const Route = createFileRoute("/incentive")({
  head: () => ({
    meta: [
      { title: "Incentive — Servio ITSM" },
      { name: "description", content: "Manage agent incentive schemes, targets and payouts." },
      { property: "og:title", content: "Incentive — Servio ITSM" },
      {
        property: "og:description",
        content: "Manage agent incentive schemes, targets and payouts.",
      },
    ],
  }),
  component: () => (
    <ModulePlaceholder
      title="Incentive"
      subtitle="Manage agent incentive schemes, targets and payouts."
      icon={Trophy}
      stats={[
        ["Active schemes", "12"],
        ["Payouts this month", "LKR 1.2M"],
        ["Top performer", "Sarah Chen"],
      ]}
    />
  ),
});
