import type { Priority } from "./itsm-data";

export type JobStatus = "To Do" | "In Progress" | "On Hold" | "Completed";

export interface Job {
  id: string;
  title: string;
  description: string;
  technician: string | null;
  team: string;
  priority: Priority;
  due: string;
  status: JobStatus;
  incident: string | null;
  tools: string[];
}

export const jobColumns: JobStatus[] = ["To Do", "In Progress", "On Hold", "Completed"];

export const teams = ["Field Services", "Network Ops", "Desktop Support", "Infrastructure"];

export const initialJobs: Job[] = [
  {
    id: "JOB-3012",
    title: "Replace swollen battery — Amaya's laptop",
    description: "Swap battery unit on HP EliteBook 840, run diagnostics after replacement.",
    technician: "Tom Okafor",
    team: "Desktop Support",
    priority: "High",
    due: "2026-10-09 14:00",
    status: "To Do",
    incident: "INC-10478",
    tools: ["Battery kit", "ESD strap"],
  },
  {
    id: "JOB-3011",
    title: "Investigate VPN gateway drops",
    description: "Check gateway logs for session resets affecting remote users.",
    technician: null,
    team: "Network Ops",
    priority: "High",
    due: "2026-10-08 17:00",
    status: "To Do",
    incident: "INC-10482",
    tools: ["VPN console access"],
  },
  {
    id: "JOB-3010",
    title: "Restore email flow on floor 4",
    description: "Restart transport service on EXCH-02 and verify queues.",
    technician: "Arjun Mehta",
    team: "Infrastructure",
    priority: "Critical",
    due: "2026-10-08 12:00",
    status: "In Progress",
    incident: "INC-10481",
    tools: ["Exchange admin", "Test mailbox"],
  },
  {
    id: "JOB-3009",
    title: "Patch payroll app hotfix",
    description: "Deploy hotfix 2.4.1 to payroll portal and verify submit flow.",
    technician: "Sarah Chen",
    team: "Infrastructure",
    priority: "Critical",
    due: "2026-10-08 18:00",
    status: "In Progress",
    incident: "INC-10475",
    tools: ["Deploy pipeline"],
  },
  {
    id: "JOB-3008",
    title: "Replace printer roller HP-3F-02",
    description: "Install replacement roller kit once the part arrives.",
    technician: "Tom Okafor",
    team: "Field Services",
    priority: "Low",
    due: "2026-10-12 10:00",
    status: "On Hold",
    incident: "INC-10480",
    tools: ["Roller kit"],
  },
  {
    id: "JOB-3007",
    title: "Re-apply Marketing share ACLs",
    description: "Restore write permissions for the Marketing group.",
    technician: "Lena Fischer",
    team: "Infrastructure",
    priority: "Medium",
    due: "2026-10-07 16:00",
    status: "Completed",
    incident: "INC-10477",
    tools: ["AD console"],
  },
  {
    id: "JOB-3006",
    title: "Deliver monitor to Dilan",
    description: 'Collect approved 27" monitor from stores and install at desk 5-14.',
    technician: "Tom Okafor",
    team: "Field Services",
    priority: "Low",
    due: "2026-10-06 11:00",
    status: "Completed",
    incident: "INC-10474",
    tools: ["Monitor", "DisplayPort cable"],
  },
  {
    id: "JOB-3005",
    title: "Firmware update — meeting room hubs",
    description: "Update Teams room hubs on floors 2–4 to latest firmware.",
    technician: "Nimal Perera",
    team: "Desktop Support",
    priority: "Medium",
    due: "2026-10-10 09:00",
    status: "To Do",
    incident: null,
    tools: ["Firmware package", "Admin laptop"],
  },
];

export const jobStatusStyle: Record<JobStatus, string> = {
  "To Do": "bg-info-soft text-info",
  "In Progress": "bg-primary-soft text-primary",
  "On Hold": "bg-warning-soft text-warning",
  Completed: "bg-success-soft text-success",
};
