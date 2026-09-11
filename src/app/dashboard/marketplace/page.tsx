"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const [listings, setListings] = useState<Listing[]>([]);
  const [states, setStates] = useState<{ id: string; name: string; code: string }[]>([]);
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [contactedListing, setContactedListing] = useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/states")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStates(data.data || []);
        }
      })
      .catch(() => {});
  }, []);

  // Modal Form State
  const [itemTitle, setItemTitle] = useState("");
  const [itemCategory, setItemCategory] = useState("Pre-Camp Gear");
  const [itemPrice, setItemPrice] = useState("");
  const [itemLocation, setItemLocation] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [posting, setPosting] = useState(false);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportedListingTitle, setReportedListingTitle] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  React.useEffect(() => {
    fetch("/api/marketplace")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const apiListings: Listing[] = data.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            price: parseInt(item.price.replace(/[^0-9]/g, ""), 10) || 5000,
            state: item.state || "Lagos",
            location: `${item.lga} LGA, ${item.state}`,
            distanceKm: 1.5,
            seller: item.seller?.name || "Verified Corper",
            roleBadge: "Direct Sale",
            badgeType: "verified",
            category: item.category,
            condition: "Good Condition",
            imageBg: "bg-emerald-800",
            imageUrl: item.images[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
            forRoles: ["pcm", "serving", "alumni"],
          }));
          setListings(apiListings);
        }
      })
      .catch(() => {});
  }, []);

  const handlePostItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle || !itemPrice) return;

    setPosting(true);
    const userId = session?.user?.id || "";

    try {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: userId,
          title: itemTitle,
          category: itemCategory,
          price: `₦${itemPrice}`,
          description: itemDescription || "Corper Item for sale",
          state: selectedState === "All States" ? "Lagos" : selectedState,
          lga: "Ikeja",
          images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"],
        }),
      });

      const data = await res.json();
      if (data.success) {
        const newItem: Listing = {
          id: data.data.id,
          title: itemTitle,
          price: parseInt(itemPrice, 10) || 5000,
          state: selectedState === "All States" ? "Lagos" : selectedState,
          location: itemLocation || "Ikeja LGA, Lagos",
          distanceKm: 1.0,
          seller: "You",
          roleBadge: "Fresh Listing",
          badgeType: "verified",
          category: itemCategory,
          condition: "Listed Just Now",
          imageBg: "bg-emerald-700",
          imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
          forRoles: ["pcm", "serving", "alumni"],
        };
        setListings((prev) => [newItem, ...prev]);
        setShowModal(false);
        setItemTitle("");
        setItemPrice("");
        setItemDescription("");
      }
    } catch (err) {
      console.error("Failed to post item", err);
    } finally {
      setPosting(false);
    }
  };

  const filteredListings = listings.filter((item) => {
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
          <option value="All States">ALL STATES</option>
          {states.map((s) => (
            <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* Marketplace Grid */}
      {filteredListings.length === 0 ? (
        <div className="p-12 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-center space-y-4">
          <ShoppingBag className="w-8 h-8 text-emerald-700 dark:text-emerald-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#121815] dark:text-white font-display">
              No Items Listed in {selectedCategory} Yet
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Have camp gear, electronics, or household items to sell or swap? Post them now!
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post First Item for Sale</span>
          </button>
        </div>
      ) : (
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
      )}

      {/* POST ITEM CLASSIFIED MODAL */}
      {showModal && (
        <PostItemModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            alert("🎉 Ad submitted! Your item is currently under review by Platform Moderation. Once approved, it will go live for all corpers.");
          }}
        />
      )}

    </div>
  );
}

function PostItemModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const { data: session } = useSession();
  const [postingMode, setPostingMode] = useState<"manual" | "ai">("manual");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [state, setState] = useState("");
  const [availableLgas, setAvailableLgas] = useState<string[]>([]);
  const [lga, setLga] = useState("");
  const [area, setArea] = useState("");
  const [street, setStreet] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [statesList, setStatesList] = useState<{ id: string; name: string; lgas: string[] }[]>([]);

  useEffect(() => {
    fetch("/api/states")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStatesList(data.data || []);
      })
      .catch(() => {});
  }, []);

  const handleStateChange = (selectedStateName: string) => {
    setState(selectedStateName);
    setLga("");
    const matched = statesList.find((s) => s.name === selectedStateName);
    setAvailableLgas(matched ? matched.lgas : []);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPreviews: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Image files must be under 5MB each");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreviews((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImagePreview = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRunAiAnalysis = async () => {
    if (!aiPrompt.trim() && imagePreviews.length === 0) {
      setErrorMsg("Please upload at least 1 image or type a short item description for AI analysis");
      return;
    }

    setAnalyzingAi(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/ai/listing/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: imagePreviews,
          description: aiPrompt,
          type: "marketplace",
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const draft = data.data;
        if (draft.title) setTitle(draft.title);
        if (draft.categoryOrType) setCategory(draft.categoryOrType);
        if (draft.price) setPrice(draft.price.toString());
        if (draft.state) setState(draft.state);
        if (draft.lga) setLga(draft.lga);
        if (draft.description) setDescription(draft.description);
        setPostingMode("manual"); // Switch to manual edit & confirm mode
      } else {
        setErrorMsg(data.error || "AI analysis failed");
      }
    } catch (err) {
      setErrorMsg("Error communicating with AI service");
    } finally {
      setAnalyzingAi(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price.trim() || !description.trim()) {
      setErrorMsg("Please fill in all required item details");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    const userId = session?.user?.id || "";

    try {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: userId,
          title,
          category,
          price: `₦${Number(price.toString().replace(/[^0-9]/g, "")).toLocaleString()}`,
          state,
          lga,
          description,
          images: imagePreviews.length > 0 ? imagePreviews : ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"],
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setErrorMsg(data.error || data.message || "Failed to submit item");
      }
    } catch (err) {
      setErrorMsg("Network error posting item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 max-w-lg w-full p-6 space-y-5 animate-fadeIn text-[#121815] dark:text-white">
        <div className="flex items-center justify-between border-b border-slate-300/60 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold font-display uppercase tracking-wider">Post Item for Sale</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:text-red-500 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Posting Method Mode Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setPostingMode("manual")}
            className={`py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              postingMode === "manual"
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-white"
            }`}
          >
            Manual Posting
          </button>

          <button
            type="button"
            onClick={() => setPostingMode("ai")}
            className={`py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              postingMode === "ai"
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-emerald-700 dark:text-emerald-400 font-extrabold hover:text-emerald-300"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create with AI ✨</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {postingMode === "ai" ? (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-emerald-600/10 border border-emerald-600/30 text-emerald-800 dark:text-emerald-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold font-display uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Smart AI Listing Draft Generator</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Upload photos of your item and type a quick description (e.g. "Standing fan, good condition, 12k"). AI will auto-fill your draft for your final review!
              </p>
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                Short Description / Key Specs
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Binatone standing fan, 3 speeds, used for 5 months during camp in Ikeja. Selling for 15,000."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none"
              />
            </div>

            {/* Local Storage Photo Picker */}
            <div className="space-y-2">
              <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                Upload Photos from Device
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageFileChange}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
              />

              {imagePreviews.length > 0 && (
                <div className="flex items-center gap-3 overflow-x-auto pt-2">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative w-16 h-16 border border-slate-300 dark:border-slate-700 shrink-0">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImagePreview(idx)}
                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={analyzingAi}
              onClick={handleRunAiAnalysis}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {analyzingAi ? (
                <span>ANALYZING IMAGES & TEXT...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>GENERATE STRUCTURED DRAFT FOR REVIEW ➔</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                Item Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Plain White Rubber Shoes (Size 42)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                  Category *
                </label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none"
                >
                  <option value="" disabled>Select Category...</option>
                  {["Pre-Camp Gear", "Furniture", "Electronics", "Kitchenware", "Full House"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                  Price (NGN) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="Enter selling price..."
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

            {/* Cascading State & LGA Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                  State Location *
                </label>
                <select
                  required
                  value={state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none"
                >
                  <option value="" disabled>Select State...</option>
                  {statesList.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                  LGA *
                </label>
                <select
                  required
                  disabled={!state}
                  value={lga}
                  onChange={(e) => setLga(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none disabled:opacity-50"
                >
                  <option value="" disabled>{!state ? "Select State First..." : "Select LGA..."}</option>
                  {availableLgas.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Specific Area & Street / Landmark inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                  Area / Neighborhood
                </label>
                <input
                  type="text"
                  placeholder="Enter area / neighborhood..."
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                  Street / Landmark
                </label>
                <input
                  type="text"
                  placeholder="Enter street / landmark..."
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Device Local Photo Picker */}
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                Item Photos (Device Storage)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageFileChange}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
              />

              {imagePreviews.length > 0 && (
                <div className="flex items-center gap-3 overflow-x-auto pt-2">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative w-16 h-16 border border-slate-300 dark:border-slate-700 shrink-0">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImagePreview(idx)}
                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                Description & Condition *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe condition, size, reason for selling..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-300/60 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-400 dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? "SUBMITTING AD..." : "POST AD FOR REVIEW ➔"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
