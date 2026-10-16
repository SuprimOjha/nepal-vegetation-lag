"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, LoaderCircle } from "lucide-react";

type ApiState = "checking" | "connected" | "disconnected";

export default function ApiStatus() {
  const [status, setStatus] = useState<ApiState>("checking");

  useEffect(() => {
    let active = true;

    async function checkApi() {
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
      ).replace(/\/+$/, "");

      try {
        const response = await fetch(
          `${baseUrl}/health`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Health check failed");
        }

        const data = await response.json();

        if (active) {
          setStatus(data.status === "ok" ? "connected" : "disconnected");
        }
      } catch {
        if (active) setStatus("disconnected");
      }
    }

    checkApi();
    const interval = window.setInterval(checkApi, 15000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const config = {
    checking: {
      label: "Checking API",
      icon: LoaderCircle,
      className: "api-checking",
    },
    connected: {
      label: "API connected",
      icon: CheckCircle2,
      className: "api-connected",
    },
    disconnected: {
      label: "API disconnected",
      icon: XCircle,
      className: "api-disconnected",
    },
  }[status];

  const Icon = config.icon;

  return (
    <div
      className={`api-status ${config.className}`}
      role="status"
      aria-live="polite"
    >
      <Icon size={15} />
      <span>{config.label}</span>
    </div>
  );
}