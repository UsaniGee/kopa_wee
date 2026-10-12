import Link from "next/link";
import type { IconType } from "react-icons";
import { FiArrowRight, FiClock } from "react-icons/fi";

interface ComingSoonProps {
  /** Feature name, e.g. "CDS group hub". */
  title: string;
  /** One sentence on what it will do. */
  description: string;
  /** Planned pieces, shown as a short list. */
  planned?: string[];
  /** Something that works today. */
  action?: { href: string; label: string };
  icon?: IconType;
  /** Smaller variant for a card inside a page. */
  compact?: boolean;
}

/** Honest placeholder for a feature that is not built yet. */
export default function ComingSoon({ title, description, planned = [], action, icon: Icon = FiClock, compact = false }: ComingSoonProps) {
  return (
    <section
      aria-label={`${title} (coming soon)`}
      className={`bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4 animate-fadeIn ${compact ? "p-6" : "p-6 sm:p-10"}`}
    >
      <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500">
        <Icon className="w-4 h-4" aria-hidden />
        <span>Coming soon</span>
      </div>

      <div className="space-y-2 max-w-xl">
        <h2 className={`font-medium text-[#121815] dark:text-white font-display tracking-tight ${compact ? "text-lg" : "text-2xl sm:text-3xl"}`}>
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>

      {planned.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl">
          {planned.map((item) => (
            <li key={item} className="text-xs text-slate-600 dark:text-slate-400 p-3 border border-dashed border-slate-400/60 dark:border-slate-700">
              {item}
            </li>
          ))}
        </ul>
      )}

      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 min-h-11 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <span>{action.label}</span>
          <FiArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      )}
    </section>
  );
}
