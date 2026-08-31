"use client";

import React, { useState, useEffect } from "react";
import { useRole } from "@/shared/context/RoleContext";
import { FiHome, FiUsers, FiMapPin, FiCheckCircle, FiShield, FiHeart, FiPlus, FiPackage, FiAlertTriangle, FiCompass, FiNavigation, FiFlag, FiX, FiSearch, FiFilter } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const Home = FiHome;
const Users = FiUsers;
const MapPin = FiMapPin;
const CheckCircle2 = FiCheckCircle;
const ShieldCheck = FiShield;
const Heart = FiHeart;
const Plus = FiPlus;
const Luggage = FiPackage;
const AlertTriangle = FiAlertTriangle;
const Compass = FiCompass;
const Navigation = FiNavigation;
const Flag = FiFlag;
const X = FiX;
const Sparkles = HiSparkles;
const Search = FiSearch;
const Filter = FiFilter;

interface Lodge {
  id: string;
  name: string;
  price: string;
  location: string;
  lga: string;
  distanceKm: number;
  badgeType: "verified" | "unverified" | "corps_member" | "property_owner";
  features: string[];
  split: string;
  image: string;
  forRoles: ("pcm" | "serving" | "alumni")[];
}

interface Roommate {
  id: string;
  name: string;
  gender: string;
  ppa: string;
  lga: string;
  budget: string;
  preference: string;
  distanceKm: number;
  matchScore: number;
}

const SAMPLE_LODGES: Lodge[] = [
  { 
    id: "1", 
    name: "Greenfield Corper Lodge", 
    price: "₦180,000 / year", 
    location: "Ikeja LGA, Lagos (Near Secretariat)", 
    lga: "Ikeja", 
    distanceKm: 2.3, 
    badgeType: "verified", 
    features: ["24/7 Water", "Security Gate", "Fitted Kitchen", "Individual Meters"], 
    split: "2-Person Roommate Split (₦90,000 each)",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
    forRoles: ["pcm", "serving"]
  },
  { 
    id: "2", 
    name: "Transit Corper Haven", 
    price: "₦3,500 / night", 
    location: "Surulere LGA, Lagos", 
    lga: "Surulere", 
    distanceKm: 1.1, 
    badgeType: "corps_member", 
    features: ["Fully Furnished", "Free WiFi", "Power Backup", "Close to Bus Stop"], 
    split: "Nightly Transit Stay",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
    forRoles: ["pcm", "serving"]
  },
  { 
    id: "3", 
    name: "Alumni Relocation Apartment", 
    price: "₦350,000 / year", 
    location: "Lekki Phase 1, Lagos", 
    lga: "Eti-Osa", 
    distanceKm: 4.5, 
    badgeType: "property_owner", 
    features: ["Gated Estate", "Air Conditioned", "Parking Space", "Prepaid Meter"], 
    split: "Post-POP Full Apartment",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80",
    forRoles: ["alumni"]
  },
];

const SAMPLE_ROOMMATES: Roommate[] = [
  { id: "1", name: "Tunde Bakare", gender: "Male", ppa: "Grace High School (Opebi)", lga: "Ikeja", budget: "₦100,000/yr", preference: "Non-smoker, Quiet, Tech worker", distanceKm: 1.5, matchScore: 94 },
  { id: "2", name: "Chioma Nwosu", gender: "Female", ppa: "Lagos State Secretariat", lga: "Ikeja", budget: "₦120,000/yr", preference: "Clean, Early riser", distanceKm: 2.0, matchScore: 88 },
];

export default function AccommodationPage() {
  const { currentRole } = useRole();
  const [activeTab, setActiveTab] = useState<"lodges" | "roommates">("lodges");
  const [distanceKmFilter, setDistanceKmFilter] = useState<number>(10);
  const [selectedLGA, setSelectedLGA] = useState<string>("all");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportedItemName, setReportedItemName] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const filteredLodges = SAMPLE_LODGES.filter(lodge => {
    const matchesDistance = lodge.distanceKm <= distanceKmFilter;
    const matchesLGA = selectedLGA === "all" || lodge.lga.toLowerCase() === selectedLGA.toLowerCase();
    return matchesDistance && matchesLGA;
  });

  const handleFlagItem = (itemName: string) => {
    setReportedItemName(itemName);
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
            <Home className="w-3.5 h-3.5" />
            <span>HOUSING & ROOMMATE FINDER</span>
          </div>
          <h1 className="text-3xl font-medium text-white tracking-tight font-display">
            Corper Lodges & Compatibility Finder
          </h1>
          <p className="text-xs text-slate-300">
            Find verified lodges near your PPA and match with compatible roommates to split rent.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>List Lodge / Post Profile</span>
        </button>
      </div>

      {/* Mode Switcher Tabs & Filters */}
      <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("lodges")}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                activeTab === "lodges"
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-[#eaf5ed] dark:bg-[#0a0f0d] text-slate-700 dark:text-slate-300 border-slate-300/60 dark:border-slate-800"
              }`}
            >
              Corper Lodges & Stays ({filteredLodges.length})
            </button>

            <button
              onClick={() => setActiveTab("roommates")}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                activeTab === "roommates"
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-[#eaf5ed] dark:bg-[#0a0f0d] text-slate-700 dark:text-slate-300 border-slate-300/60 dark:border-slate-800"
              }`}
            >
              Roommate Compatibility Matcher
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-display hidden sm:inline">
              Max Distance:
            </span>
            <input
              type="range"
              min="1"
              max="20"
              value={distanceKmFilter}
              onChange={(e) => setDistanceKmFilter(Number(e.target.value))}
              className="accent-emerald-600 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-[#121815] dark:text-white">{distanceKmFilter}km</span>
          </div>
        </div>
      </div>

      {/* Lodges Grid */}
      {activeTab === "lodges" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredLodges.map((lodge) => (
            <div key={lodge.id} className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
              <div className="relative h-48 border border-slate-300/50 dark:border-slate-800 overflow-hidden">
                <img src={lodge.image} alt={lodge.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#121815] text-white text-[10px] font-mono font-bold uppercase px-2.5 py-1">
                  {lodge.lga} LGA · {lodge.distanceKm}km from PPA
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#121815] dark:text-white font-display">{lodge.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{lodge.location}</p>
                <div className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-400 pt-1">{lodge.price}</div>
              </div>

              <div className="pt-3 border-t border-slate-300/50 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">{lodge.split}</span>
                <button 
                  onClick={() => handleFlagItem(lodge.name)}
                  className="text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5" /> Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Roommates Grid */}
      {activeTab === "roommates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_ROOMMATES.map((rm) => (
            <div key={rm.id} className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#121815] dark:text-white font-display">{rm.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{rm.ppa}</p>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-700 text-white">
                  {rm.matchScore}% Match
                </span>
              </div>

              <div className="p-3 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/50 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <div><strong>Budget:</strong> {rm.budget}</div>
                <div><strong>Preference:</strong> {rm.preference}</div>
              </div>

              <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
                Connect Roommate on WhatsApp ➔
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0a0f0d]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121815] text-white p-8 max-w-md w-full border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400 font-bold font-display">
                <Flag className="w-5 h-5" />
                <span>Report Listing Incident</span>
              </div>
              <button onClick={() => setReportModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!reportSubmitted ? (
              <form onSubmit={handleSendReport} className="space-y-4">
                <p className="text-xs text-slate-300">
                  Reporting: <strong>{reportedItemName}</strong>
                </p>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-display">Reason for Report</label>
                  <select
                    required
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-3 text-xs bg-[#1a231f] border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Select Reason --</option>
                    <option value="scam_request">Demanding advance money prior to inspection</option>
                    <option value="fake_photos">Fake or duplicate photos</option>
                    <option value="invalid_phone">Phone number invalid</option>
                    <option value="already_taken">Property no longer available</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Submit Incident Report
                </button>
              </form>
            ) : (
              <div className="p-4 bg-emerald-950/40 border border-emerald-600/50 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm font-display text-white">Report Submitted</h4>
                <p className="text-xs text-emerald-300">Our safety moderation team will investigate this listing immediately.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
