import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-bg-2 border border-white/10 rounded-2xl p-5 md:p-7 w-full max-w-[580px] max-h-[90vh] overflow-y-auto animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-2 hover:text-text px-2 py-1 rounded-lg hover:bg-bg-3 transition-colors text-sm"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-white/5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
