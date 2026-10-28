"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "./icons";
import styles from "./Modal.module.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  closeLabel: string;
  children: ReactNode;
};

// Native <dialog> opened with showModal(): the rest of the page becomes inert
// (focus stays inside), Esc closes it and focus returns to the opener.
export function Modal({
  open,
  onClose,
  labelledBy,
  closeLabel,
  children,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Lock page scroll while open, like the prototype's _lock().
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.modal}
      aria-labelledby={labelledBy}
      onClose={onClose}
      // The dialog itself has no padding, so a click that targets it directly
      // landed on the backdrop, outside the content box.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.dialog}>
        <button
          type="button"
          className={styles.close}
          aria-label={closeLabel}
          onClick={onClose}
        >
          <CloseIcon />
        </button>
        {children}
      </div>
    </dialog>
  );
}
