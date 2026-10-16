import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Headset, Mail, Lock, Eye, EyeOff, ArrowRight, Smartphone } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Servio ITSM" },
      { name: "description", content: "Sign in to the Servio ITSM service desk." },
      { property: "og:title", content: "Sign in — Servio ITSM" },
      { property: "og:description", content: "Sign in to the Servio ITSM service desk." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password to continue.");
      return;
    }
    sessionStorage.setItem("servio_login_mode", "normal");
    navigate({ to: "/" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Headset size={18} />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Servio<span className="font-medium text-sidebar-muted"> ITSM</span>
          </span>
        </div>
        <div>
          <h2 className="max-w-md text-3xl font-bold leading-tight tracking-tight">
            Every ticket, job and asset — one service desk.
          </h2>
          <p className="mt-3 max-w-md text-sm text-sidebar-muted">
            Track incidents, dispatch field jobs, manage changes and keep SLAs green from a single
            workspace.
          </p>
          <div className="mt-8 grid max-w-md grid-cols-3 gap-3 text-center">
            {[
              ["99.9%", "Uptime"],
              ["24/7", "Support"],
              ["92%", "SLA health"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-sidebar-accent p-4">
                <p className="text-xl font-bold">{v}</p>
                <p className="mt-0.5 text-xs text-sidebar-muted">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-sidebar-muted">© 2026 Servio ITSM</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Headset size={18} />
            </span>
            <span className="text-lg font-bold tracking-tight">Servio ITSM</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your service desk account.
          </p>

          <form onSubmit={(e) => handleLogin(e)} className="mt-8 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold">Work email</label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="email"
                  className="input-field pl-9"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-semibold">Password</label>
                <button type="button" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type={showPw ? "text" : "password"}
                  className="input-field pl-9 pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {error && (
              <p className="rounded-lg bg-destructive-soft px-3 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            )}
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="h-4 w-4 rounded border accent-primary" /> Keep me
              signed in
            </label>
            <div className="space-y-2.5">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Sign in <ArrowRight size={15} />
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/mobile-apk-download" })}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-card py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <Smartphone size={15} /> Mobile Login
              </button>
            </div>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or continue with
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-lg border py-2.5 text-sm font-medium hover:bg-muted">
              Google
            </button>
            <button className="rounded-lg border py-2.5 text-sm font-medium hover:bg-muted">
              Microsoft SSO
            </button>
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Need an account? Contact your service desk administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
