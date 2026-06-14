export type AlertVariant = "success" | "error" | "warning" | "info";

type ShowAlertFunction = (
  variant: AlertVariant,
  message: string,
  title?: string,
  duration?: number
) => void;

let showAlertFunction: ShowAlertFunction | null = null;

export const registerAlert = (fn: ShowAlertFunction): void => {
  showAlertFunction = fn;
};

export const showAlert = (
  variant: AlertVariant,
  message: string,
  title = "Notification",
  duration = 3000
): void => {
  if (showAlertFunction) {
    showAlertFunction(variant, message, title, duration);
  }
};
