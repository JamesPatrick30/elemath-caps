import PixelModal from "./PixelModal";
import PixelButton from "./PixelButton";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <PixelModal title={title} onClose={onClose} accent="ember">
      <p className="font-body text-sm text-parchment-100 mb-4">{message}</p>
      <div className="flex justify-end gap-2">
        <PixelButton type="button" variant="ghost" onClick={onClose}>
          Cancel
        </PixelButton>
        <PixelButton
          type="button"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Working…" : confirmLabel}
        </PixelButton>
      </div>
    </PixelModal>
  );
}