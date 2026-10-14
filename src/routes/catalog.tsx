import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Laptop,
  Monitor,
  Smartphone,
  Keyboard,
  FileCode2,
  Palette,
  Database,
  ShieldCheck,
  KeyRound,
  FolderLock,
  Users,
  CalendarDays,
  BadgeCheck,
  GraduationCap,
  Check,
} from "lucide-react";
import { PageHeader } from "@/components/itsm/Badges";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Service Catalog — Servio ITSM" },
      {
        name: "description",
        content: "Request hardware, software licenses, access and HR services.",
      },
      { property: "og:title", content: "Service Catalog — Servio ITSM" },
      {
        property: "og:description",
        content: "Request hardware, software licenses, access and HR services.",
      },
    ],
  }),
  component: Catalog,
});

const catalog = [
  {
    cat: "Hardware Requests",
    items: [
      {
        icon: Laptop,
        title: "New Laptop",
        desc: "Standard or developer-spec laptop, 3–5 day delivery.",
      },
      { icon: Monitor, title: "External Monitor", desc: '27" 4K display with USB-C hub.' },
      { icon: Smartphone, title: "Mobile Device", desc: "Company phone with MDM enrolment." },
      { icon: Keyboard, title: "Peripherals", desc: "Keyboard, mouse, headset or webcam." },
    ],
  },
  {
    cat: "Software Licenses",
    items: [
      { icon: FileCode2, title: "IDE / Dev Tools", desc: "JetBrains, GitHub Copilot and more." },
      { icon: Palette, title: "Design Suite", desc: "Figma or Adobe Creative Cloud seat." },
      { icon: Database, title: "Database Client", desc: "DataGrip or DBeaver Enterprise." },
    ],
  },
  {
    cat: "Access / Permissions",
    items: [
      {
        icon: KeyRound,
        title: "System Access",
        desc: "Request access to an internal application.",
      },
      { icon: FolderLock, title: "Shared Drive", desc: "Read or write access to a team folder." },
      {
        icon: ShieldCheck,
        title: "Admin Rights",
        desc: "Temporary local admin, manager approval.",
      },
    ],
  },
  {
    cat: "HR Services",
    items: [
      { icon: Users, title: "New Joiner Setup", desc: "Full onboarding bundle for a new hire." },
      { icon: CalendarDays, title: "Leave Request", desc: "Annual, sick or parental leave." },
      {
        icon: BadgeCheck,
        title: "Employment Letter",
        desc: "Official letter for visa or bank use.",
      },
      {
        icon: GraduationCap,
        title: "Training Course",
        desc: "Enrol in an approved learning program.",
      },
    ],
  },
];

function Catalog() {
  const [cat, setCat] = useState("All");
  const [requested, setRequested] = useState<Set<string>>(new Set());
  const shown = catalog.filter((c) => cat === "All" || c.cat === cat);

  return (
    <>
      <PageHeader
        title="Service Catalog"
        subtitle="Everything you can request from IT and HR, in one place."
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {["All", ...catalog.map((c) => c.cat)].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary hover:text-primary"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-10">
        {shown.map((group) => (
          <section key={group.cat}>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {group.cat}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.items.map((it) => {
                const done = requested.has(it.title);
                return (
                  <article
                    key={it.title}
                    className="card-surface group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <it.icon size={20} />
                    </span>
                    <h3 className="mt-4 font-semibold">{it.title}</h3>
                    <p className="mt-1 flex-1 text-sm text-muted-foreground">{it.desc}</p>
                    <button
                      onClick={() => setRequested(new Set(requested).add(it.title))}
                      disabled={done}
                      className={`mt-5 inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${done ? "bg-success-soft text-success" : "border hover:border-primary hover:bg-primary hover:text-primary-foreground"}`}
                    >
                      {done ? (
                        <>
                          <Check size={15} />
                          Requested
                        </>
                      ) : (
                        "Request Now"
                      )}
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
