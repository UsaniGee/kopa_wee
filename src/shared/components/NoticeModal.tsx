"use client";

import { useEffect, useId, useRef } from "react";
import type { IconType } from "react-icons";
import { FiAlertTriangle, FiCheckCircle, FiInfo } from "react-icons/fi";

type Tone = "success" | "info" | "error";

const TONE: Record<Tone, { icon: IconType; iconClass: string; button: string }> = {
  success: { icon: FiCheckCircle, iconClass: "text-emerald-600 dark:text-emerald-400", button: "bg-emerald-600 hover:bg-emerald-700" },
  info: { icon: FiInfo, iconClass: "text-slate-600 dark:text-slate-300", button: "bg-emerald-600 hover:bg-emerald-700" },
  error: { icon: FiAlertTriangle, iconClass: "text-red-600 dark:text-red-400", button: "bg-red-600 hover:bg-red-700" },
};

interface NoticeModalProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  tone?: Tone;
  actionLabel?: string;
}

/** In-app replacement for window.alert(): one message, one button. */
export default function NoticeModal({ open, title, message, onClose, tone = "success", actionLabel = "OK" }: NoticeModalProps) {
  const titleId = useId();
  const messageId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { icon: Icon, iconClass, button } = TONE[tone];

  useEffect(() => {
    if (!open) return;
    buttonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 font-sans"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 p-6 space-y-4 text-[#121815] dark:text-white animate-fadeIn"
      >
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`} aria-hidden />
          <div className="space-y-1.5">
            <h2 id={titleId} className="text-base font-bold font-display">{title}</h2>
            <p id={messageId} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex justify-end pt-2 border-t border-slate-300/60 dark:border-slate-800">
          <button
            ref={buttonRef}
            type="button"
            onClick={onClose}
            className={`min-h-11 px-6 py-2.5 text-white text-xs font-bold uppercase tracking-wider cursor-pointer ${button}`}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
