import { createFileRoute } from "@tanstack/react-router";
import { Bug } from "lucide-react";
import { ModulePlaceholder } from "@/components/itsm/ModulePlaceholder";

export const Route = createFileRoute("/problems")({
  head: () => ({
    meta: [
      { title: "Problem Management — Servio ITSM" },
      { name: "description", content: "Find and eliminate root causes of recurring incidents." },
      { property: "og:title", content: "Problem Management — Servio ITSM" },
      {
        property: "og:description",
        content: "Find and eliminate root causes of recurring incidents.",
      },
    ],
  }),
  component: () => (
    <ModulePlaceholder
      title="Problem Management"
      subtitle="Find and eliminate root causes of recurring incidents."
      icon={Bug}
      stats={[
        ["Open problems", "12"],
        ["Known errors", "34"],
        ["Root causes found", "8"],
      ]}
    />
  ),
});
