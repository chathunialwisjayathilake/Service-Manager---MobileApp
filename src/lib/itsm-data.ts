export type Priority = "Critical" | "High" | "Medium" | "Low";
export type Status = "New" | "In Progress" | "On Hold" | "Resolved";

export interface Ticket {
  id: string;
  subject: string;
  raisedBy: string;
  priority: Priority;
  status: Status;
  assignee: string | null;
  created: string;
  category: string;
  description: string;
}

export const agents = ["Nimal Perera", "Sarah Chen", "Arjun Mehta", "Lena Fischer", "Tom Okafor"];

export const tickets: Ticket[] = [
  {
    id: "INC-10482",
    subject: "VPN disconnects every 10 minutes",
    raisedBy: "Kavindi Silva",
    priority: "High",
    status: "In Progress",
    assignee: "Sarah Chen",
    created: "2026-10-08 09:12",
    category: "Network",
    description:
      "Since this morning my VPN connection drops roughly every 10 minutes. I'm working remotely from Kandy and need access to the finance share. Restarting the client helps briefly.",
  },
  {
    id: "INC-10481",
    subject: "Email server not responding — Finance floor",
    raisedBy: "Mark Davis",
    priority: "Critical",
    status: "New",
    assignee: null,
    created: "2026-10-08 08:47",
    category: "Email",
    description: "Nobody on floor 4 can send or receive email. Outlook shows 'Disconnected'.",
  },
  {
    id: "INC-10480",
    subject: "Printer jam on 3rd floor",
    raisedBy: "Priya Nair",
    priority: "Low",
    status: "On Hold",
    assignee: "Tom Okafor",
    created: "2026-10-08 08:20",
    category: "Hardware",
    description: "Printer HP-3F-02 jammed, waiting for replacement roller.",
  },
  {
    id: "INC-10479",
    subject: "Cannot access Salesforce",
    raisedBy: "James Wu",
    priority: "Medium",
    status: "In Progress",
    assignee: "Arjun Mehta",
    created: "2026-10-07 17:05",
    category: "Software",
    description: "SSO loop when logging into Salesforce.",
  },
  {
    id: "INC-10478",
    subject: "Laptop battery swelling",
    raisedBy: "Amaya Fernando",
    priority: "High",
    status: "New",
    assignee: null,
    created: "2026-10-07 15:31",
    category: "Hardware",
    description: "Laptop trackpad is lifting, suspect swollen battery.",
  },
  {
    id: "INC-10477",
    subject: "Shared drive permissions reset",
    raisedBy: "Olivia Brown",
    priority: "Medium",
    status: "Resolved",
    assignee: "Lena Fischer",
    created: "2026-10-07 11:02",
    category: "Access",
    description: "Lost write access to Marketing share.",
  },
  {
    id: "INC-10476",
    subject: "Teams calls dropping audio",
    raisedBy: "Ravi Kumar",
    priority: "Medium",
    status: "In Progress",
    assignee: "Nimal Perera",
    created: "2026-10-06 16:44",
    category: "Software",
    description: "Audio cuts out after ~5 minutes in Teams.",
  },
  {
    id: "INC-10475",
    subject: "Payroll app 500 error",
    raisedBy: "Hannah Lee",
    priority: "Critical",
    status: "In Progress",
    assignee: "Arjun Mehta",
    created: "2026-10-06 10:15",
    category: "Software",
    description: "Payroll portal returns 500 on submit.",
  },
  {
    id: "INC-10474",
    subject: "New monitor request not delivered",
    raisedBy: "Dilan Jayasuriya",
    priority: "Low",
    status: "Resolved",
    assignee: "Tom Okafor",
    created: "2026-10-05 13:20",
    category: "Hardware",
    description: "Monitor approved but not delivered.",
  },
];

export const priorityStyle: Record<Priority, string> = {
  Critical: "bg-destructive text-destructive-foreground",
  High: "bg-destructive-soft text-destructive",
  Medium: "bg-warning-soft text-warning",
  Low: "bg-success-soft text-success",
};

export const statusStyle: Record<Status, string> = {
  New: "bg-info-soft text-info",
  "In Progress": "bg-primary-soft text-primary",
  "On Hold": "bg-warning-soft text-warning",
  Resolved: "bg-success-soft text-success",
};
