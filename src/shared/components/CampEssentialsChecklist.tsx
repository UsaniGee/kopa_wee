"use client";

import { useEffect, useState } from "react";
import { FiCheckSquare, FiSquare, FiAlertTriangle, FiSearch, FiInfo, FiPlus, FiTrash2, FiLoader } from "react-icons/fi";
import { packingItemTemplate } from "@/shared/data/referenceData";

/** A row from /api/packing-items. */
interface PackingItem {
  id: string;
  name: string;
  category: string;
  isCustom: boolean;
  pcmCompleted: boolean;
}

/** The camp packing checklist, stored per user in /api/packing-items (same data as the overview checklist). */
export default function CampEssentialsChecklist() {
  const [items, setItems] = useState<PackingItem[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch("/api/packing-items")
      .then((res) => res.json())
      .then((data) => (data.success && Array.isArray(data.data) ? setItems(data.data) : setLoadError(data.error || "Could not load your checklist.")))
      .catch(() => setLoadError("Could not load your checklist. Check your connection and refresh."));
  }, []);

  const send = (method: "PATCH" | "POST" | "DELETE", body: object) =>
    fetch("/api/packing-items", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then((res) => res.json().then((data) => ({ ok: res.ok && data.success, data })))
      .catch(() => ({ ok: false, data: {} as { error?: string; data?: PackingItem } }));

  // Optimistic tick, undone if the server does not confirm
  const toggleItem = async (item: PackingItem) => {
    const packed = !item.pcmCompleted;
    setActionError("");
    setItems((prev) => prev?.map((i) => (i.id === item.id ? { ...i, pcmCompleted: packed } : i)) ?? prev);
    const { ok } = await send("PATCH", { itemId: item.id, pcmCompleted: packed });
    if (!ok) {
      setItems((prev) => prev?.map((i) => (i.id === item.id ? { ...i, pcmCompleted: !packed } : i)) ?? prev);
      setActionError(`"${item.name}" was not updated. Please try again.`);
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newItemName.trim();
    if (!name || adding) return;
    setAdding(true);
    setActionError("");
    const { ok, data } = await send("POST", { name, category: "custom" });
    if (ok && data.data) {
      setItems((prev) => [...(prev ?? []), data.data!]);
      setNewItemName("");
    } else {
      setActionError(data.error || "The item was not added.");
    }
    setAdding(false);
  };

  const removeItem = async (item: PackingItem) => {
    setActionError("");
    setItems((prev) => prev?.filter((i) => i.id !== item.id) ?? prev);
    const { ok } = await send("DELETE", { itemId: item.id });
    if (!ok) {
      // Put back just this item; other edits made meanwhile stay
      setItems((prev) => (prev && !prev.some((i) => i.id === item.id) ? [...prev, item] : prev));
      setActionError(`"${item.name}" was not removed.`);
    }
  };

  if (loadError) {
    return <p role="alert" className="p-6 border border-red-300 dark:border-red-900 text-xs text-red-700 dark:text-red-400">{loadError}</p>;
  }
  if (!items) {
    return (
      <div className="p-8 flex items-center gap-2 text-xs text-slate-500">
        <FiLoader className="w-4 h-4 animate-spin" /> Loading your checklist...
      </div>
    );
  }

  const categories = ["all", ...new Set(items.map((i) => i.category))];
  const query = searchQuery.toLowerCase();
  const filteredItems = items.filter((item) => {
    const note = packingItemTemplate(item.name)?.note ?? "";
    return (
      (selectedCategory === "all" || item.category === selectedCategory) &&
      (item.name.toLowerCase().includes(query) || note.toLowerCase().includes(query))
    );
  });
  const totalPacked = items.filter((i) => i.pcmCompleted).length;
  const packedPercentage = items.length ? Math.round((totalPacked / items.length) * 100) : 0;

  return (
    <div className="space-y-6 font-sans">

      {/* Header & Progress */}
      <div className="p-6 sm:p-8 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest block">
              ORIENTATION SURVIVAL KIT
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium text-[#121815] dark:text-white font-display mt-1">
              Camp Packing Checklist
            </h2>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold font-display text-emerald-700 dark:text-emerald-400">{packedPercentage}%</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider block">Packed ({totalPacked}/{items.length})</span>
          </div>
        </div>

        <div className="w-full bg-slate-300 dark:bg-slate-800 h-2">
          <div className="bg-emerald-600 h-2 transition-all duration-500" style={{ width: `${packedPercentage}%` }} />
        </div>

        <div className="p-4 bg-[#eaf5ed] dark:bg-[#0a0f0d] border-l-2 border-emerald-600 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
          <FiInfo className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            A common list from past corps members, not an official NYSC list. Always follow your call-up letter and camp officials.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <FiSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, white tees..."
            aria-label="Search the checklist"
            className="w-full pl-10 pr-4 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-xs text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors border ${
                selectedCategory === cat
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-[#dcece1] dark:bg-[#121a16] text-slate-700 dark:text-slate-300 border-slate-300/60 dark:border-slate-800 hover:border-slate-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Add your own */}
      <form onSubmit={addItem} className="flex gap-2">
        <input
          type="text"
          maxLength={200}
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add your own item, e.g. Extra phone charger"
          aria-label="New checklist item"
          className="flex-1 px-4 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-xs text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600"
        />
        <button
          type="submit"
          disabled={!newItemName.trim() || adding}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <FiPlus className="w-4 h-4" /> Add
        </button>
      </form>

      {actionError && <p role="alert" className="text-xs font-semibold text-red-700 dark:text-red-400">{actionError}</p>}

      {/* Items List */}
      <ul className="space-y-3">
        {filteredItems.map((item) => {
          const template = packingItemTemplate(item.name);
          return (
            <li
              key={item.id}
              className={`p-4 border transition-all flex items-start gap-4 ${
                item.pcmCompleted
                  ? "bg-[#dcece1]/60 dark:bg-[#121a16]/60 border-slate-300/40 dark:border-slate-800/80 opacity-75"
                  : "bg-[#dcece1] dark:bg-[#121a16] border-slate-300/60 dark:border-slate-800 hover:border-emerald-600"
              }`}
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={item.pcmCompleted}
                onClick={() => toggleItem(item)}
                className="flex-1 min-w-0 flex items-start gap-4 text-left cursor-pointer"
              >
                <span className="mt-0.5">
                  {item.pcmCompleted ? <FiCheckSquare className="w-5 h-5 text-emerald-600" /> : <FiSquare className="w-5 h-5 text-slate-400" />}
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-sm font-bold font-display ${item.pcmCompleted ? "line-through text-slate-500" : "text-[#121815] dark:text-white"}`}>
                    {item.name}
                  </span>
                  {template?.note && <span className="block text-xs text-slate-600 dark:text-slate-400 mt-1">{template.note}</span>}
                  {template?.disclaimer && (
                    <span className="text-xs text-amber-700 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1.5">
                      <FiAlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{template.disclaimer}</span>
                    </span>
                  )}
                </span>
              </button>
              {item.isCustom && (
                <button
                  type="button"
                  onClick={() => removeItem(item)}
                  aria-label={`Remove ${item.name}`}
                  className="text-slate-400 hover:text-red-600 cursor-pointer"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
            </li>
          );
        })}
      </ul>

    </div>
  );
}
