"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
  DialogBackdrop,
} from "@headlessui/react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

export default function Modal({
  open,
  onClose,
  title = "Untitled",
  description,
  children,
}: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Backdrop có transition riêng */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 duration-300 ease-out data-closed:opacity-0"
      />

      {/* Container canh giữa */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-md rounded bg-modal p-6 shadow-xl duration-300 ease-out
                     data-closed:opacity-0 data-closed:scale-95"
        >
          <DialogTitle className="text-lg font-semibold text-modal-foreground">
            {title}
          </DialogTitle>

          <Description className="mt-1 text-sm text-muted">
            {description}
          </Description>

          <div className="mt-4">{children}</div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 rounded bg-primary text-sm text-primary-foreground"
            >
              Confirm
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
