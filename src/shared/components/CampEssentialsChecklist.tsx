"use client";

import React, { useState, useEffect } from "react";
import { FiCheckSquare, FiSquare, FiAlertTriangle, FiPlus, FiFileText, FiTag, FiMapPin, FiBox, FiShield, FiSearch, FiFilter, FiInfo } from "react-icons/fi";

const CheckSquare = FiCheckSquare;
const Square = FiSquare;
const AlertTriangle = FiAlertTriangle;
const Plus = FiPlus;
const FileText = FiFileText;
const Shirt = FiTag;
const Footprints = FiMapPin;
const Bed = FiBox;
const ShieldCheck = FiShield;
const Search = FiSearch;
const Filter = FiFilter;
const Info = FiInfo;

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

  // Bedding & Comfort
  { id: "bed_1", name: "Bedsheet & Pillowcase", category: "bedding", qty: "1 – 2 sets", recommended: true, notes: "Single bed size for camp bunk mattress.", packed: false },
  { id: "bed_2", name: "Mosquito Net & Strings", category: "bedding", qty: "1 net + rope", recommended: true, notes: "Mandatory protection against mosquitoes in hostel.", packed: false },
  { id: "bed_3", name: "Light Blanket or Fleece", category: "bedding", qty: "1 blanket", recommended: true, notes: "For chilly early morning drills and cool nights.", packed: false },

  // Essentials
  { id: "ess_1", name: "High-Capacity Power Bank", category: "essentials", qty: "10,000 – 30,000 mAh", recommended: true, notes: "Limited charging points in camp hostels.", packed: true },
  { id: "ess_2", name: "Rechargeable Mini Fan / Torchlight", category: "essentials", qty: "1 piece", recommended: true, notes: "For night lights and warm hostel rooms.", packed: false },
  { id: "ess_3", name: "Small Padlock & Keys", category: "essentials", qty: "2 padlocks", recommended: true, notes: "For your travelling bag and hostel locker.", packed: true },
];

export default function CampEssentialsChecklist() {
  const [items, setItems] = useState<CampItem[]>(DEFAULT_CAMP_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<CampItem["category"]>("essentials");

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const newItem: CampItem = {
      id: "custom_" + Date.now(),
      name: newItemName.trim(),
      category: newItemCategory,
      qty: "1 item",
      recommended: false,
      packed: false
    };
    setItems(prev => [newItem, ...prev]);
    setNewItemName("");
  };

  const filteredItems = items.filter(item => {
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const totalPacked = items.filter(i => i.packed).length;
  const packedPercentage = Math.round((totalPacked / items.length) * 100);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header & Progress */}
      <div className="p-8 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest block">
              ORIENTATION SURVIVAL KIT
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium text-[#121815] dark:text-white font-display mt-1">
              Camp Mandatory Packing Checklist
            </h2>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold font-display text-emerald-700 dark:text-emerald-400">{packedPercentage}%</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider block">Packed ({totalPacked}/{items.length})</span>
          </div>
        </div>

        <div className="w-full bg-slate-300 dark:bg-slate-800 h-2">
          <div 
            className="bg-emerald-600 h-2 transition-all duration-500" 
            style={{ width: `${packedPercentage}%` }} 
          />
        </div>

        {/* Disclaimer Warning */}
        <div className="p-4 bg-[#eaf5ed] dark:bg-[#0a0f0d] border-l-2 border-emerald-600 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Official Disclaimer:</strong> White Crocs and slippers are permitted for hostel and bathroom use only. Parade grounds strictly require plain white tennis or rubber parade shoes without colored stripes.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, white tees..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-xs text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {["all", "documents", "wear", "footwear", "bedding", "essentials"].map(cat => (
            <button
              key={cat}
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

      {/* Items List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-4 border transition-all cursor-pointer flex items-start gap-4 ${
              item.packed
                ? "bg-[#dcece1]/60 dark:bg-[#121a16]/60 border-slate-300/40 dark:border-slate-800/80 opacity-75"
                : "bg-[#dcece1] dark:bg-[#121a16] border-slate-300/60 dark:border-slate-800 hover:border-emerald-600"
            }`}
          >
            <div className="mt-0.5">
              {item.packed ? (
                <CheckSquare className="w-5 h-5 text-emerald-600" />
              ) : (
                <Square className="w-5 h-5 text-slate-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm font-bold font-display ${item.packed ? "line-through text-slate-500" : "text-[#121815] dark:text-white"}`}>
                  {item.name}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                  {item.qty}
                </span>
              </div>

              {item.notes && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{item.notes}</p>
              )}

              {item.disclaimer && (
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.disclaimer}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
