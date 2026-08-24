"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  Plus, 
  FileText, 
  Shirt, 
  Footprints, 
  Bed, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Filter,
  Info
} from "lucide-react";

export interface CampItem {
  id: string;
  name: string;
  category: "documents" | "wear" | "footwear" | "bedding" | "toiletries" | "essentials" | "laundry" | "comfort";
  qty: string;
  recommended: boolean;
  notes?: string;
  disclaimer?: string;
  packed: boolean;
}

const DEFAULT_CAMP_ITEMS: CampItem[] = [
  // Documents
  { id: "doc_1", name: "NYSC Call-Up Letter", category: "documents", qty: "3 colored copies", recommended: true, notes: "Do not laminate original call-up letter.", packed: true },
  { id: "doc_2", name: "Green Card Form", category: "documents", qty: "3 colored copies", recommended: true, notes: "Printed directly from official NYSC portal.", packed: true },
  { id: "doc_3", name: "Medical Fitness Certificate", category: "documents", qty: "Original + 2 copies", recommended: true, notes: "Issued by government or military hospital.", packed: false },
  { id: "doc_4", name: "Degree / HND Certificate or Statement of Result", category: "documents", qty: "Original + 4 copies", recommended: true, notes: "Must be signed by university registrar.", packed: true },
  { id: "doc_5", name: "Passport Photographs", category: "documents", qty: "8 – 12 copies", recommended: true, notes: "White background, recent photo.", packed: false },
  { id: "doc_6", name: "Clear Document File Folder", category: "documents", qty: "1 jacket file", recommended: true, notes: "Keeps documents safe during registration line.", packed: true },

  // White Camp Wear
  { id: "wear_1", name: "Plain White Round-Neck T-Shirts", category: "wear", qty: "2 – 4 extra pairs", recommended: true, notes: "NYSC issues 2, but extra white tees are essential.", packed: false },
  { id: "wear_2", name: "Plain White Shorts", category: "wear", qty: "2 – 4 extra pairs", recommended: true, notes: "No colored logos or pockets permitted on parade ground.", packed: false },
  { id: "wear_3", name: "Plain White Socks", category: "wear", qty: "3 – 6 pairs", recommended: true, notes: "All-white socks without colored stripes.", packed: false },
  { id: "wear_4", name: "Plain White Rubber Shoes / Tennis Shoes", category: "wear", qty: "1 – 2 pairs", recommended: true, notes: "Lightweight and easy to wash after morning drills.", packed: false },
  { id: "wear_5", name: "Waist Pouch", category: "wear", qty: "1 pouch", recommended: true, notes: "Black or dark pouch to hold money, phone, and key.", packed: true },

  // Footwear & Disclaimer
  { 
    id: "foot_1", 
    name: "White Crocs / Rubber Slippers", 
    category: "footwear", 
    qty: "1 pair", 
    recommended: true, 
    notes: "For hostel, bathroom, and casual movement.", 
    disclaimer: "IMPORTANT: Crocs/slippers are useful for hostel & bathroom use, but NOT a replacement for white parade shoes. Follow camp official instructions.", 
    packed: false 
  },
  { id: "foot_2", name: "Bathroom Slippers", category: "footwear", qty: "1 pair", recommended: true, notes: "Essential for bathroom and hostel floors.", packed: false },

  // Bedding
  { id: "bed_1", name: "Bed Sheet & Pillowcase", category: "bedding", qty: "1 – 2 sets", recommended: true, notes: "Standard single mattress size.", packed: false },
  { id: "bed_2", name: "Light Blanket or Wrapper", category: "bedding", qty: "1 item", recommended: true, notes: "For cool camp nights.", packed: false },
  { id: "bed_3", name: "Mosquito Net", category: "bedding", qty: "1 net + rope", recommended: true, notes: "Protect against malaria in hostel.", packed: false },

  // Toiletries & Hygiene
  { id: "toil_1", name: "Toothbrush & Toothpaste", category: "toiletries", qty: "1 set", recommended: true, packed: false },
  { id: "toil_2", name: "Bath Soap, Sponge & Soap Box", category: "toiletries", qty: "1 set", recommended: true, packed: false },
  { id: "toil_3", name: "Towel & Body Lotion", category: "toiletries", qty: "1 set", recommended: true, packed: false },
  { id: "toil_4", name: "Hand Sanitizer & Disinfectant", category: "toiletries", qty: "1 small bottle", recommended: true, packed: false },

  // Security & Essentials
  { id: "sec_1", name: "Small Padlocks & Keys", category: "essentials", qty: "2 padlocks", recommended: true, notes: "Lock your travelling bag and box at all times.", packed: false },
  { id: "sec_2", name: "Power Bank & Phone Charger", category: "essentials", qty: "10,000mAh+", recommended: true, notes: "Charging points can be crowded in camp market.", packed: false },
  { id: "sec_3", name: "Rechargeable Torchlight", category: "essentials", qty: "1 light", recommended: true, notes: "Essential for 4:00 AM morning parade prep.", packed: false },
  { id: "sec_4", name: "Small Accessible Cash (₦500 / ₦1,000 notes)", category: "essentials", qty: "₦10,000 – ₦20,000", recommended: true, notes: "For Mammy market food, laundry, and photo copy.", packed: false },

  // Laundry
  { id: "laun_1", name: "Detergent & Laundry Soap", category: "laundry", qty: "1 pack", recommended: true, packed: false },
  { id: "laun_2", name: "Pegs & Small Clothesline Rope", category: "laundry", qty: "1 pack pegs", recommended: true, packed: false },
];

export default function CampEssentialsChecklist() {
  const [items, setItems] = useState<CampItem[]>(DEFAULT_CAMP_ITEMS);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<CampItem["category"]>("essentials");

  useEffect(() => {
    const saved = localStorage.getItem("kopawee_camp_checklist");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const togglePacked = (id: string) => {
    const updated = items.map(item => item.id === id ? { ...item, packed: !item.packed } : item);
    setItems(updated);
    localStorage.setItem("kopawee_camp_checklist", JSON.stringify(updated));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const newItem: CampItem = {
      id: `custom_${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      qty: "1 item",
      recommended: false,
      packed: false,
    };
    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem("kopawee_camp_checklist", JSON.stringify(updated));
    setNewItemName("");
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const packedCount = items.filter(i => i.packed).length;
  const progressPct = Math.round((packedCount / items.length) * 100);

  return (
    <div className="space-y-6 bg-white p-6 shadow-sm border-t-4 border-emerald-500">
      {/* Header & Progress */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5">
              Interactive Checklist
            </span>
            <span className="text-xs text-slate-500 font-bold">2026 Official Camp Recommendations</span>
          </div>
          <h2 className="text-xl font-black text-black mt-1">NYSC Orientation Camp Essentials Guide</h2>
        </div>

        {/* Progress Bar */}
        <div className="w-full md:w-64 bg-slate-50 p-3 space-y-1.5 border border-slate-200">
          <div className="flex items-center justify-between text-xs font-bold text-black">
            <span>Packing Progress</span>
            <span className="text-emerald-700">{packedCount} / {items.length} ({progressPct}%)</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5">
            <div className="bg-emerald-500 h-2.5 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Official NYSC Document Notice */}
      <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-900 text-xs space-y-1">
        <div className="font-bold flex items-center gap-1.5 text-amber-950">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Official NYSC Document Verification Requirement</span>
        </div>
        <p className="leading-relaxed text-[11px]">
          Always verify your exact document requirements on the official NYSC portal (<a href="https://www.nysc.gov.ng" target="_blank" rel="noreferrer" className="underline font-bold">nysc.gov.ng</a>) prior to departure. Foreign-trained graduates and medical professionals require specific additional licensing documentation.
        </p>
      </div>

      {/* Controls: Search & Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1">
          {[
            { id: "all", label: "All Items" },
            { id: "documents", label: "Documents" },
            { id: "wear", label: "White Wear" },
            { id: "footwear", label: "Footwear" },
            { id: "bedding", label: "Bedding" },
            { id: "toiletries", label: "Toiletries" },
            { id: "essentials", label: "Essentials" },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id ? "bg-black text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter checklist..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 text-black border border-slate-200 focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="divide-y divide-slate-100 space-y-1">
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            className={`p-3 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
              item.packed ? "bg-emerald-50/60 text-slate-600" : "bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <button 
                type="button"
                onClick={() => togglePacked(item.id)}
                className="mt-0.5 text-black hover:text-emerald-600 shrink-0"
              >
                {item.packed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>

              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs font-bold ${item.packed ? "line-through text-slate-500" : "text-black"}`}>
                    {item.name}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-600 font-mono">
                    {item.qty}
                  </span>
                  {item.recommended && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold">
                      Recommended
                    </span>
                  )}
                </div>

                {item.notes && (
                  <p className="text-[11px] text-slate-500 leading-tight">{item.notes}</p>
                )}

                {/* Important Footwear / Crocs Disclaimer */}
                {item.disclaimer && (
                  <div className="mt-1 p-2 bg-amber-50 text-amber-900 text-[10px] font-medium border-l-2 border-amber-500 flex items-start gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{item.disclaimer}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => togglePacked(item.id)}
              className={`px-3 py-1 text-[10px] font-bold shrink-0 ${
                item.packed ? "bg-emerald-200 text-emerald-900" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
              }`}
            >
              {item.packed ? "Packed ✓" : "Mark Packed"}
            </button>
          </div>
        ))}
      </div>

      {/* Add Custom Personal Item */}
      <form onSubmit={handleAddItem} className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add your own custom personal item..."
          className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-black focus:outline-none focus:border-black"
        />
        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value as any)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-black focus:outline-none"
        >
          <option value="essentials">Essentials</option>
          <option value="documents">Documents</option>
          <option value="wear">White Wear</option>
          <option value="toiletries">Toiletries</option>
          <option value="bedding">Bedding</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-black hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add Item
        </button>
      </form>
    </div>
  );
}
