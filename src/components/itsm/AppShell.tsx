import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  User,
  Headset,
  Grid2X2,
  Palette,
  Check,
  Smartphone,
} from "lucide-react";
import { Avatar } from "./Badges";
import { Button } from "@/components/ui/button";
import { themes, applyTheme, getSavedTheme } from "@/lib/theme";

export function AppShell({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(false);
  const [notif, setNotif] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [theme, setTheme] = useState(getSavedTheme);

  return (
    <div className="min-h-screen">
      <div>
        <header className="sticky top-0 z-20 flex min-h-16 flex-wrap items-center gap-3 border-b bg-card/85 px-4 py-3 backdrop-blur sm:px-6">
          <Link
            to="/"
            aria-label="Servio ITSM home"
            className="flex shrink-0 items-center gap-2.5 sm:mr-4"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Headset size={18} />
            </span>
            <span className="hidden font-bold sm:block">
              Servio<span className="font-medium text-muted-foreground"> ITSM</span>
            </span>
          </Link>
          <Button asChild variant="ghost" size="icon" title="All modules">
            <Link to="/" aria-label="All modules">
              <Grid2X2 size={18} />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center gap-1.5 border-primary/30 text-xs font-semibold text-primary hover:bg-primary/10"
          >
            <Link to="/mobile">
              <Smartphone size={15} />
              Mobile App
            </Link>
          </Button>
          <div className="relative min-w-0 flex-1 max-w-xl">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              placeholder="Search tickets, assets, articles…"
              className="input-field pl-9 bg-muted border-transparent"
            />
            <kbd className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border bg-card px-1.5 font-mono text-[10px] text-muted-foreground sm:block">
              ⌘K
            </kbd>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex sm:hidden items-center gap-1 text-xs font-semibold text-primary border-primary/30"
            >
              <Link to="/mobile">
                <Smartphone size={14} />
                Mobile
              </Link>
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setThemeOpen(!themeOpen);
                  setNotif(false);
                  setProfile(false);
                }}
                className="grid h-9 w-9 place-items-center rounded-lg hover:bg-muted"
                aria-label="Change site color"
              >
                <Palette size={18} />
              </Button>
              {themeOpen && (
                <div className="card-surface rise absolute right-0 mt-2 w-52 p-1.5 text-sm">
                  <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    Site color
                  </p>
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        applyTheme(t.id);
                        setTheme(t.id);
                        setThemeOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 hover:bg-muted"
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-black/10"
                        style={{ background: t.swatch }}
                      />
                      <span className="flex-1 text-left">{t.label}</span>
                      {theme === t.id && <Check size={15} className="text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setNotif(!notif);
                  setProfile(false);
                }}
                className="relative grid h-9 w-9 place-items-center rounded-lg hover:bg-muted"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
              </Button>
              {notif && (
                <div className="card-surface rise absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] p-2">
                  <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    Notifications
                  </p>
                  {[
                    "INC-10481 breached response SLA",
                    "CHG-2201 awaiting your approval",
                    "Sarah Chen commented on INC-10482",
                  ].map((n) => (
                    <div key={n} className="rounded-md px-2 py-2 text-sm hover:bg-muted">
                      {n}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => {
                  setProfile(!profile);
                  setNotif(false);
                }}
                className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-muted"
              >
                <Avatar name="Nimal Perera" className="h-8 w-8" />
                <span className="hidden text-left text-sm leading-tight sm:block">
                  <span className="block font-semibold">Nimal Perera</span>
                  <span className="text-xs text-muted-foreground">Service Manager</span>
                </span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </Button>
              {profile && (
                <div className="card-surface rise absolute right-0 mt-2 w-48 p-1.5 text-sm">
                  {[
                    [User, "My profile"],
                    [Settings, "Settings"],
                  ].map(([I, l]: any) => (
                    <Button
                      variant="ghost"
                      key={l}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 hover:bg-muted"
                    >
                      <I size={15} />
                      {l}
                    </Button>
                  ))}
                  <Link
                    to="/login"
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 hover:bg-muted"
                  >
                    <LogOut size={15} />
                    Sign out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
