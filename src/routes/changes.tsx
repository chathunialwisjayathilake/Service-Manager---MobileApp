import { createFileRoute } from "@tanstack/react-router";
import { GitPullRequestArrow } from "lucide-react";
import { ModulePlaceholder } from "@/components/itsm/ModulePlaceholder";

export const Route = createFileRoute("/changes")({
  head: () => ({
    meta: [
      { title: "Change Management — Servio ITSM" },
      { name: "description", content: "Plan, approve and schedule changes safely." },
      { property: "og:title", content: "Change Management — Servio ITSM" },
      { property: "og:description", content: "Plan, approve and schedule changes safely." },
    ],
  }),
  component: () => (
    <ModulePlaceholder
      title="Change Management"
      subtitle="Plan, approve and schedule changes safely."
      icon={GitPullRequestArrow}
      stats={[
        ["Pending approval", "6"],
        ["Scheduled", "14"],
        ["Success rate", "97%"],
      ]}
    />
  ),
});
