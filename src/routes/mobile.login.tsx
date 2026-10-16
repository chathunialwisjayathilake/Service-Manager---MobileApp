import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Smartphone,
  Headset,
  Lock,
  User,
  Server,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Download,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile/login")({
  head: () => ({
    meta: [
      { title: "Mobile Sign In (O1-SCR-MOB-01) — Telesonic Mobile" },
      {
        name: "description",
        content: "Sign in to Telesonic Service Manager Android Mobile Application.",
      },
      { property: "og:title", content: "Mobile Sign In — Telesonic Mobile" },
      {
        property: "og:description",
        content: "Sign in to Telesonic Service Manager Android Mobile Application.",
      },
    ],
  }),
  component: MobileLoginPage,
});

function MobileLoginPage() {
  const navigate = useNavigate();
  const [serverUrl, setServerUrl] = useState("https://telesonic.service-manager.com");
  const [techId, setTechId] = useState("TECH-0092");
  const [pinPassword, setPinPassword] = useState("123456");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMobileSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!serverUrl.trim()) {
      setError("Please specify the Service / Server URL.");
      return;
    }
    if (!techId.trim()) {
      setError("Please enter your Technician ID or Username.");
      return;
    }
    if (!pinPassword.trim()) {
      setError("Please enter your Password or Security PIN.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Store temporary demo authentication state
      sessionStorage.setItem("mobile_authenticated", "true");
      sessionStorage.setItem("mobile_tech_id", techId.trim());
      sessionStorage.setItem("mobile_server_url", serverUrl.trim());

      // Navigate to authenticated technician mobile view
      navigate({ to: "/mobile" });
    }, 450);
  };

  const handleFillDemo = () => {
    setServerUrl("https://telesonic.service-manager.com");
    setTechId("TECH-0092");
    setPinPassword("992810");
    setError("");
  };

  return (
    <div className="min-h-screen bg-muted/30 py-6 px-3 flex items-center justify-center">
      {/* Phone container frame for mobile native preview */}
      <div className="w-full max-w-md border bg-card rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Mobile Header Bar */}
        <div className="bg-primary text-primary-foreground px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-foreground/15 text-primary-foreground">
              <Headset size={20} />
            </span>
            <div>
              <h1 className="text-sm font-bold leading-tight">Telesonic Service Manager</h1>
              <p className="text-[11px] opacity-80">Option 01 · Mobile Field Console</p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-primary-foreground/20 px-2 py-0.5 rounded text-primary-foreground font-semibold">
            MOB-01
          </span>
        </div>

        {/* Screen Title & Body */}
        <div className="p-5 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-foreground">Technician Mobile Login</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              O1-SCR-MOB-01 — Sign in to access your assigned work orders and field modules.
            </p>
          </div>

          {/* SIMULATED AUTHENTICATION NOTICE */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 dark:border-blue-900/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[11px] text-blue-800 dark:text-blue-300">
              <Info size={14} className="shrink-0" />
              <span>Frontend Demonstration Validation</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              Input is validated locally for demonstration purposes. No passwords or security
              credentials are sent to real authentication servers or stored permanently.
            </p>
          </div>

          <form onSubmit={handleMobileSignIn} className="space-y-4">
            {/* Server / Service URL */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Server size={13} className="text-muted-foreground" /> Server / Service URL
              </label>
              <input
                type="text"
                className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                placeholder="https://telesonic.service-manager.com"
                value={serverUrl}
                onChange={(e) => {
                  setServerUrl(e.target.value);
                  setError("");
                }}
              />
            </div>

            {/* Technician ID */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <User size={13} className="text-muted-foreground" /> Technician ID / Username
              </label>
              <input
                type="text"
                className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                placeholder="e.g. TECH-0092"
                value={techId}
                onChange={(e) => {
                  setTechId(e.target.value);
                  setError("");
                }}
              />
            </div>

            {/* Password / PIN */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Lock size={13} className="text-muted-foreground" /> Password / Security PIN
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  className="w-full rounded-lg border bg-background pl-3 pr-9 py-2 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                  placeholder="••••••••"
                  value={pinPassword}
                  onChange={(e) => {
                    setPinPassword(e.target.value);
                    setError("");
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  aria-label="Toggle password visibility"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Validation Error Message */}
            {error && (
              <div className="rounded-lg bg-destructive-soft p-2.5 text-xs font-medium text-destructive flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border accent-primary"
                />
                Save offline credentials
              </label>

              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] font-medium text-primary hover:underline"
              >
                Auto-fill Demo
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 text-xs font-bold gap-2 shadow-xs mt-2"
            >
              {isSubmitting ? (
                <>
                  <Smartphone size={16} className="animate-spin" />
                  Authenticating Mobile Session...
                </>
              ) : (
                <>
                  Sign In to Mobile App
                  <ArrowRight size={15} />
                </>
              )}
            </Button>
          </form>

          {/* Quick Flow Navigation Links */}
          <div className="border-t pt-4 space-y-2 text-center text-xs">
            <p className="text-muted-foreground text-[11px]">Looking for simulated app download?</p>
            <div className="flex items-center justify-center gap-3 text-xs font-medium">
              <Link
                to="/mobile-apk-download"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                <Download size={13} />
                Simulated APK Download Page
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link to="/login" className="text-muted-foreground hover:underline">
                Website Login
              </Link>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-muted/50 px-4 py-2.5 border-t text-[10px] text-center text-muted-foreground flex items-center justify-between">
          <span>O1-SCR-MOB-01 Mobile Sign In</span>
          <span className="font-mono">Telesonic v2.4.0</span>
        </div>
      </div>
    </div>
  );
}
