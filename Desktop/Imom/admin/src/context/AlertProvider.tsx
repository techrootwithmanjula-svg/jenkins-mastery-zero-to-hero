import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Alert from "../components/ui/alert/Alert";
import { registerAlert } from "../services/alertService";
import type { AlertVariant } from "../services/alertService";

interface AlertItem {
  id: string;
  variant: AlertVariant;
  title: string;
  message: string;
}

export default function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    registerAlert((variant, message, title = "Notification", duration = 3000) => {
      const id = crypto.randomUUID();

      setAlerts((prev) => [...prev, { id, variant, title, message }]);

      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
      }, duration);
    });
  }, []);

  return (
    <>
      {children}

      <div className="fixed right-5 top-5 z-[99999] flex w-[350px] flex-col gap-3">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
          />
        ))}
      </div>
    </>
  );
}
