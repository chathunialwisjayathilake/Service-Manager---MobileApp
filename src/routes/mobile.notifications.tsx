import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Trash2,
  CheckCheck,
  AlertCircle,
  Briefcase,
  Clock,
  ShieldAlert,
  Info,
} from "lucide-react";
import {
  getMobileNotifications,
  markMobileNotificationAsRead,
  markAllMobileNotificationsAsRead,
  deleteMobileNotification,
  type MobileNotification,
} from "../lib/mobile-data";

export const Route = createFileRoute("/mobile/notifications")({
  component: MobileNotificationsPage,
});

function MobileNotificationsPage() {
  const [notifications, setNotifications] = useState<MobileNotification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "Job Assignment" | "Alert">("all");

  useEffect(() => {
    setNotifications(getMobileNotifications());
  }, []);

  const handleMarkAsRead = (id: string) => {
    const updated = markMobileNotificationAsRead(id);
    setNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = markAllMobileNotificationsAsRead();
    setNotifications(updated);
  };

  const handleDelete = (id: string) => {
    const updated = deleteMobileNotification(id);
    setNotifications(updated);
  };

  const filtered = notifications.filter((item) => {
    if (filter === "unread") return !item.read;
    if (filter === "Job Assignment") return item.type === "Job Assignment";
    if (filter === "Alert") return item.type === "Alert" || item.type === "System";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "Job Assignment":
        return <Briefcase className="w-5 h-5 text-sky-600" />;
      case "Alert":
        return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      case "System":
        return <Info className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <Link
            to="/mobile"
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-sky-600" />
              Notifications
            </h1>
            <p className="text-xs text-slate-500">
              O1-SCR-MOB-14 • {unreadCount} unread alert{unreadCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs bg-sky-50 text-sky-700 hover:bg-sky-100 px-2.5 py-1.5 rounded-md font-medium flex items-center gap-1 border border-sky-200 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            filter === "all"
              ? "bg-sky-700 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            filter === "unread"
              ? "bg-sky-700 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("Job Assignment")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            filter === "Job Assignment"
              ? "bg-sky-700 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Assignments
        </button>
        <button
          onClick={() => setFilter("Alert")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            filter === "Alert"
              ? "bg-sky-700 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Alerts
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-lg border border-slate-200 shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">No Notifications</p>
            <p className="text-xs text-slate-500 mt-1">
              You're all caught up with your updates and job assignments.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-lg border transition-all ${
                !item.read
                  ? "bg-sky-50/60 border-sky-200 shadow-xs"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-white border border-slate-200 shadow-xs shrink-0 mt-0.5">
                    {getNotificationIcon(item.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {item.title}
                      </span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                      </span>
                      {item.jobId && (
                        <Link
                          to="/mobile/jobs/$jobId"
                          params={{ jobId: item.jobId }}
                          className="text-sky-600 font-medium hover:underline flex items-center gap-1"
                        >
                          View Job #{item.jobId} →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!item.read && (
                    <button
                      onClick={() => handleMarkAsRead(item.id)}
                      title="Mark as read"
                      className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-white rounded-md transition-colors"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Delete"
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          Notifications are pushed automatically upon new dispatch, emergency reassignment, or supervisor hold approvals.
        </span>
      </div>
    </div>
  );
}
