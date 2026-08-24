"use client";

import React, { useState, useEffect } from "react";
import { useRole } from "@/shared/context/RoleContext";
import { 
  ShoppingBag, 
  Plus, 
  Filter, 
  MapPin, 
  Tag, 
  MessageSquare, 
  CheckCircle2,
  X,
  Luggage,
  Award,
  Compass,
  Navigation
} from "lucide-react";

interface Listing {
  id: string;
  title: string;
  price: number;
  state: string;
  location: string;
  seller: string;
  roleBadge: string;
  category: string;
  condition: string;
  imageBg: string;
  forRoles: ("pcm" | "serving" | "alumni")[];
}

const SAMPLE_LISTINGS: Listing[] = [
  // Lagos State PCM & Corper Listings
  { id: "pcm_1", title: "Plain White Rubber Shoes (Size 42 - Camp Approved)", price: 4500, state: "Lagos", location: "Ikeja LGA, Lagos", seller: "Corper Blessing", roleBadge: "Camp Essential", category: "Pre-Camp Gear", condition: "Brand New", imageBg: "bg-emerald-700", forRoles: ["pcm"] },
  { id: "pcm_2", title: "Original Anker 20,000mAh Power Bank", price: 16000, state: "Lagos", location: "Yaba, Lagos", seller: "Ex-Corper Victor", roleBadge: "Camp Essential", category: "Electronics", condition: "Like New", imageBg: "bg-slate-800", forRoles: ["pcm", "serving"] },
  { id: "pcm_3", title: "Black Leather Waist Pouch + Combination Padlocks", price: 3500, state: "Lagos", location: "Surulere, Lagos", seller: "Corper Grace", roleBadge: "Camp Kit", category: "Pre-Camp Gear", condition: "New", imageBg: "bg-black", forRoles: ["pcm"] },
  
  // Kaduna State PCM Listings
  { id: "pcm_kad_1", title: "White Canvas Boots (Size 43) + Plain White Tees", price: 6000, state: "Kaduna", location: "Mando NYSC Camp Area, Kaduna", seller: "Corper Aisha (POP)", roleBadge: "Camp Kit", category: "Pre-Camp Gear", condition: "Brand New", imageBg: "bg-emerald-900", forRoles: ["pcm"] },
  { id: "pcm_kad_2", title: "Heavy Cardigan & Thermal Socks Set (For Kaduna Camp Nights)", price: 4000, state: "Kaduna", location: "Sabon Tasha, Kaduna", seller: "Corper Ibrahim", roleBadge: "Weather Kit", category: "Pre-Camp Gear", condition: "Like New", imageBg: "bg-slate-900", forRoles: ["pcm"] },

  // Abuja FCT Listings
  { id: "pcm_abj_1", title: "Mosquito Net + Rechargeable Torchlight", price: 5500, state: "FCT - Abuja", location: "Kubwa Camp Road, Abuja", seller: "Corper Usman", roleBadge: "Camp Kit", category: "Pre-Camp Gear", condition: "New", imageBg: "bg-emerald-800", forRoles: ["pcm"] },

  // Serving Corper Gear
  { id: "srv_1", title: "Mouka Foam High-Density Mattress 4.5ft", price: 25000, state: "Lagos", location: "Ikeja LGA, Lagos", seller: "Corper Tunde (POP)", roleBadge: "POP Sale", category: "Furniture", condition: "Like New", imageBg: "bg-emerald-800", forRoles: ["serving"] },
  { id: "srv_2", title: "OX 18-inch Standing Fan (3 Speeds)", price: 12000, state: "Lagos", location: "Yaba LGA, Lagos", seller: "Corper Grace", roleBadge: "Serving Corper", category: "Electronics", condition: "Good", imageBg: "bg-slate-800", forRoles: ["serving"] },
  { id: "srv_3", title: "6kg Gas Cylinder + Double Burner Stove", price: 18500, state: "Lagos", location: "Surulere LGA, Lagos", seller: "Corper Amaka (POP)", roleBadge: "POP Sale", category: "Kitchenware", condition: "Excellent", imageBg: "bg-black", forRoles: ["serving"] },

  // Alumni / POP Gear
  { id: "alm_1", title: "Full Lodge Household Setup (Bed, Fan, Desk, Gas)", price: 65000, state: "Lagos", location: "Ikeja GRA, Lagos", seller: "Corper Kunle (POP)", roleBadge: "POP Bundle", category: "Full House", condition: "Complete Setup", imageBg: "bg-emerald-950", forRoles: ["alumni", "serving"] },
];

const NIGERIAN_STATES = ["All States", "Lagos", "Kaduna", "FCT - Abuja", "Oyo", "Rivers", "Kano"];

export default function MarketplacePage() {
  const { currentRole } = useRole();
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [contactedListing, setContactedListing] = useState<string | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Auto-load state from user profile if available
  useEffect(() => {
    const profile = localStorage.getItem("kopawee_user_profile");
    if (profile) {
      try {
        const parsed = JSON.parse(profile);
        if (parsed.deploymentState) setSelectedState(parsed.deploymentState);
        else if (parsed.serviceState) setSelectedState(parsed.serviceState);
      } catch (e) {}
    }
  }, []);

  const handleDetectLocation = () => {
    setDetectingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDetectingLocation(false);
          // Default detected state simulation to Lagos / Kaduna
          setSelectedState("Lagos");
        },
        (err) => {
          setDetectingLocation(false);
          setSelectedState("Lagos");
        }
      );
    } else {
      setDetectingLocation(false);
    }
  };

  // Filter listings based on active role & selected location state
  const roleListings = SAMPLE_LISTINGS.filter(l => {
    const roleMatches = currentRole === "pcm" ? l.forRoles.includes("pcm") : 
                        currentRole === "alumni" ? l.forRoles.includes("alumni") : l.forRoles.includes("serving");
    const stateMatches = selectedState === "All States" || l.state === selectedState;
    return roleMatches && stateMatches;
  });

  const categories = ["All", ...Array.from(new Set(roleListings.map(l => l.category)))];

  const filtered = selectedCategory === "All"
    ? roleListings
    : roleListings.filter(l => l.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-200 px-3 py-1 inline-block mb-2">
            • {currentRole === "pcm" ? "Pre-Camp Gear Market" : currentRole === "alumni" ? "POP Deals Market" : "Corper P2P Marketplace"}
          </span>
          <h1 className="text-2xl font-black text-black">
            {currentRole === "pcm" ? "PCM Orientation Gear Marketplace" : currentRole === "alumni" ? "POP Household Hand-Off Deals" : "Peer-to-Peer Corper Marketplace"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentRole === "pcm" 
              ? "Buy authentic camp-approved white shoes, waist pouches, and power banks in your deployed state."
              : "Buy, sell, or swap relocation items directly with incoming & passing-out corps members."}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all flex items-center gap-2 shrink-0 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{currentRole === "alumni" ? "Post POP Deal" : "Post Item Listing"}</span>
        </button>
      </div>

      {/* Location Filter & GPS Bar */}
      <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">State Location Filter:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-1 bg-slate-800 text-emerald-400 font-black text-xs focus:outline-none"
          >
            {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <button
          onClick={handleDetectLocation}
          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center gap-1 shrink-0"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{detectingLocation ? "Detecting GPS..." : "Detect My State"}</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-black text-white"
                : "bg-white text-slate-700 hover:bg-slate-100 shadow-sm"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="p-5 bg-white shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className={`h-36 ${item.imageBg} text-white p-4 flex flex-col justify-between`}>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-black/70 w-fit">
                    {item.roleBadge} · {item.state}
                  </span>
                  <div className="text-xl font-black">₦{item.price.toLocaleString()}</div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5">
                    {item.category} · {item.condition}
                  </span>
                  <h3 className="text-sm font-black text-black mt-2 leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.location}
                  </p>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600">{item.seller}</span>
                <button
                  onClick={() => setContactedListing(item.id)}
                  className={`px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1 ${
                    contactedListing === item.id
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-black hover:bg-black hover:text-white"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{contactedListing === item.id ? "Chat Active" : "Chat Corper"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 bg-white text-center space-y-3 shadow-sm">
          <p className="text-sm font-bold text-slate-700">No listings found in {selectedState} for this category.</p>
          <button
            onClick={() => setSelectedState("All States")}
            className="px-4 py-2 bg-black text-white text-xs font-bold"
          >
            Show All States Listings
          </button>
        </div>
      )}

      {/* Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-black p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-black">Post Item / POP Setup</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Item Title</label>
                <input type="text" placeholder="e.g. Mouka Mattress 4.5ft + Pillow" className="w-full p-2.5 bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Asking Price (₦)</label>
                  <input type="number" placeholder="25000" className="w-full p-2.5 bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Category</label>
                  <select className="w-full p-2.5 bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Furniture</option>
                    <option>Electronics</option>
                    <option>Kitchenware</option>
                    <option>Pre-Camp Gear</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">State & LGA Location</label>
                <input type="text" placeholder="Ikeja LGA, Lagos" className="w-full p-2.5 bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm transition-all"
            >
              Publish Listing Free
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
