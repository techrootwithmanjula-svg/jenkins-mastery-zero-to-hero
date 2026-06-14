import { useEffect } from "react";
import Button from "../../components/ui/button/Button";

interface Props {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  confirmingLabel?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationModal({
  isOpen,
  title = "Delete Item",
  description = "Are you sure?",
  confirmLabel = "Delete",
  confirmingLabel = "Deleting...",
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900">
        <h2 id="delete-modal-title" className="text-xl font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h2>

        <p id="delete-modal-description" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button className="w-full" onClick={onConfirm} disabled={loading}>
            {loading ? confirmingLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
