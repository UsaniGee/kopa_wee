"use client";

import React, { useState } from "react";
import { useRole } from "@/shared/context/RoleContext";
import { FiShoppingBag, FiPlus, FiFilter, FiMapPin, FiTag, FiMessageSquare, FiCheckCircle, FiX, FiPackage, FiAward, FiCompass, FiNavigation, FiAlertTriangle, FiFlag } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const ShoppingBag = FiShoppingBag;
const Plus = FiPlus;
const Filter = FiFilter;
const MapPin = FiMapPin;
const Tag = FiTag;
const MessageSquare = FiMessageSquare;
const CheckCircle2 = FiCheckCircle;
const X = FiX;
const Luggage = FiPackage;
const Award = FiAward;
const Compass = FiCompass;
const Navigation = FiNavigation;
const Sparkles = HiSparkles;
const AlertTriangle = FiAlertTriangle;
const Flag = FiFlag;
const Wand2 = HiSparkles;

interface Listing {
  id: string;
  title: string;
  price: number;
  state: string;
  location: string;
  distanceKm: number;
  seller: string;
  roleBadge: string;
  badgeType: "verified" | "unverified" | "corps_member" | "business";
  category: string;
  condition: string;
  imageBg: string;
  imageUrl: string;
  forRoles: ("pcm" | "serving" | "alumni")[];
}

const SAMPLE_LISTINGS: Listing[] = [
  { id: "pcm_1", title: "Plain White Rubber Shoes (Size 42 - Camp Approved)", price: 4500, state: "Lagos", location: "Ikeja LGA, Lagos", distanceKm: 1.2, seller: "Corper Blessing", roleBadge: "Camp Essential", badgeType: "verified", category: "Pre-Camp Gear", condition: "Brand New", imageBg: "bg-emerald-700", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85", forRoles: ["pcm"] },
  { id: "pcm_2", title: "Original Anker 20,000mAh Power Bank", price: 16000, state: "Lagos", location: "Yaba, Lagos", distanceKm: 3.5, seller: "Ex-Corper Victor", roleBadge: "Camp Essential", badgeType: "unverified", category: "Electronics", condition: "Like New", imageBg: "bg-slate-800", imageUrl: "https://images.unsplash.com/photo-1609592424522-5c5c1a1f2d5d?auto=format&fit=crop&w=900&q=85", forRoles: ["pcm", "serving"] },
  { id: "pcm_3", title: "Black Leather Waist Pouch + Padlocks", price: 3500, state: "Lagos", location: "Surulere, Lagos", distanceKm: 5.1, seller: "Corper Grace", roleBadge: "Camp Kit", badgeType: "corps_member", category: "Pre-Camp Gear", condition: "New", imageBg: "bg-black", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85", forRoles: ["pcm"] },
  { id: "srv_1", title: "Mouka Foam High-Density Mattress 4.5ft", price: 25000, state: "Lagos", location: "Ikeja LGA, Lagos", distanceKm: 2.0, seller: "Corper Tunde (POP)", roleBadge: "POP Sale", badgeType: "verified", category: "Furniture", condition: "Like New", imageBg: "bg-emerald-800", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85", forRoles: ["serving"] },
  { id: "srv_2", title: "OX 18-inch Standing Fan (3 Speeds)", price: 12000, state: "Lagos", location: "Yaba LGA, Lagos", distanceKm: 4.2, seller: "Corper Grace", roleBadge: "Serving Corper", badgeType: "corps_member", category: "Electronics", condition: "Good", imageBg: "bg-slate-800", imageUrl: "https://images.unsplash.com/photo-1618944913480-50d1c4f0e1f4?auto=format&fit=crop&w=900&q=85", forRoles: ["serving"] },
  { id: "srv_3", title: "6kg Gas Cylinder + Double Burner Stove", price: 18500, state: "Lagos", location: "Surulere LGA, Lagos", distanceKm: 6.0, seller: "Corper Amaka (POP)", roleBadge: "POP Sale", badgeType: "unverified", category: "Kitchenware", condition: "Excellent", imageBg: "bg-black", imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=85", forRoles: ["serving"] },
  { id: "alm_1", title: "Full Lodge Household Setup (Bed, Fan, Desk, Gas)", price: 65000, state: "Lagos", location: "Ikeja GRA, Lagos", distanceKm: 1.8, seller: "Corper Kunle (POP)", roleBadge: "POP Bundle", badgeType: "verified", category: "Full House", condition: "Complete Setup", imageBg: "bg-emerald-950", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85", forRoles: ["alumni", "serving"] },
];

const NIGERIAN_STATES = ["All States", "Lagos", "Kaduna", "FCT - Abuja", "Oyo", "Rivers", "Kano"];

export default function MarketplacePage() {
  const { currentRole } = useRole();
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [contactedListing, setContactedListing] = useState<string | null>(null);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportedListingTitle, setReportedListingTitle] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const filteredListings = SAMPLE_LISTINGS.filter((item) => {
    const matchesState = selectedState === "All States" || item.state === selectedState;
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    return matchesState && matchesCat;
  });

  const handleFlagListing = (title: string) => {
    setReportedListingTitle(title);
    setReportReason("");
    setReportSubmitted(false);
    setReportModalOpen(true);
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="p-8 bg-[#121815] text-white border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>P2P CORPER MARKETPLACE</span>
          </div>
          <h1 className="text-3xl font-medium text-white tracking-tight font-display">
            Corper Household & Gear Marketplace
          </h1>
          <p className="text-xs text-slate-300">
            Buy, sell, or swap camp kits, mattresses, gas cylinders, and POP household items.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post Item for Sale</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {["All", "Pre-Camp Gear", "Furniture", "Electronics", "Kitchenware", "Full House"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors border ${
                selectedCategory === cat
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-[#eaf5ed] dark:bg-[#0a0f0d] text-slate-700 dark:text-slate-300 border-slate-300/60 dark:border-slate-800 hover:border-slate-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="px-4 py-2 text-xs font-bold bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white uppercase tracking-wider focus:outline-none"
        >
          {NIGERIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((item) => (
          <div key={item.id} className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
            <div className="relative h-48 border border-slate-300/50 dark:border-slate-800 overflow-hidden">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-[#121815] text-white text-[10px] font-mono font-bold uppercase px-2.5 py-1">
                {item.roleBadge}
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-[#121815] dark:text-white font-display line-clamp-1">{item.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">{item.location} · {item.distanceKm}km away</p>
              <div className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-400 pt-1">
                ₦{item.price.toLocaleString()}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-300/50 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => setContactedListing(item.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {contactedListing === item.id ? "WhatsApp Opened" : "Contact Seller ➔"}
              </button>

              <button
                onClick={() => handleFlagListing(item.title)}
                className="text-slate-500 hover:text-red-600 text-xs font-semibold cursor-pointer"
              >
                Report
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
