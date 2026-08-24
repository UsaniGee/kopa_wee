"use client";

import React, { useState } from "react";
import { useRole } from "@/shared/context/RoleContext";
import { Home, Users, MapPin, CheckCircle2, ShieldCheck, Heart, Plus, Luggage } from "lucide-react";

export default function AccommodationPage() {
  const { currentRole } = useRole();
  const [activeTab, setActiveTab] = useState<"lodges" | "roommates">("lodges");
  const [matchedId, setMatchedId] = useState<string | null>(null);

  const lodges = [
    { id: "1", name: "Greenfield Corper Lodge", price: "₦180,000 / year", location: "5 mins to Ikeja LGA Secretariat", features: ["24/7 Water", "Security Gate", "Fitted Kitchen", "Individual Meters"], split: "₦90,000 each (2 Roommates)" },
    { id: "2", name: "Corper Haven Apartments", price: "₦240,000 / year", location: "Near Maryland Bus Stop, Lagos", features: ["Prepaid Meter", "Corper Only Compound", "POP Handover Ready"], split: "₦120,000 each (2 Roommates)" },
    { id: "3", name: "Unity Lodge Yaba", price: "₦150,000 / year", location: "Close to Yaba Tech & PPA hub", features: ["Borehole Water", "Fenced Compound", "Furnished Parlour"], split: "₦75,000 each (2 Roommates)" },
  ];

  const pcmLodges = [
    { id: "p1", name: "Kaduna NYSC Transit Lodge (Pre-Camp)", price: "₦2,000 / night", location: "10 mins from Mando Camp, Kaduna", features: ["Bed & Pillow", "Security Guard", "Corper Bus Pick-up"], split: "Short-stay Transit" },
    { id: "p2", name: "Lagos Corper Transit Hub", price: "₦2,500 / night", location: "Near Iyana Ipaja Camp, Lagos", features: ["Power Supply", "Document Printing", "Waist Pouch Store"], split: "Short-stay Transit" },
  ];

  const roommates = [
    { id: "r1", name: "Corper Segun", gender: "Male", ppa: "Lagos State Secretariat", budget: "₦100k - ₦120k", preference: "Quiet, non-smoker, works 9-5" },
    { id: "r2", name: "Corper Chioma", gender: "Female", ppa: "Federal High Court", budget: "₦80k - ₦100k", preference: "Clean, loves cooking, friendly" },
    { id: "r3", name: "Corper Ibrahim", gender: "Male", ppa: "First Bank Ikeja Branch", budget: "₦120k - ₦150k", preference: "Organized, early riser" },
  ];

  const activeLodges = currentRole === "pcm" ? pcmLodges : lodges;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-200 px-3 py-1 inline-block mb-2">
            • {currentRole === "pcm" ? "PCM Transit Housing" : "Accommodation Module"}
          </span>
          <h1 className="text-2xl font-black text-black">
            {currentRole === "pcm" ? "Pre-Camp & Transit Housing Finder" : "Accommodation & Roommate Matcher"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentRole === "pcm" 
              ? "Find temporary transit lodges near your orientation camp location before camp opens."
              : "Find corper-friendly lodges near your PPA & pair with verified corps members to split rent."}
          </p>
        </div>

        {currentRole !== "pcm" && (
          <div className="flex items-center gap-2 bg-slate-100 p-1">
            <button
              onClick={() => setActiveTab("lodges")}
              className={`px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "lodges" ? "bg-black text-white" : "text-slate-700 hover:text-black"
              }`}
            >
              Lodge Directory
            </button>
            <button
              onClick={() => setActiveTab("roommates")}
              className={`px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "roommates" ? "bg-black text-white" : "text-slate-700 hover:text-black"
              }`}
            >
              Roommate Matcher
            </button>
          </div>
        )}
      </div>

      {activeTab === "lodges" || currentRole === "pcm" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeLodges.map((lodge) => (
            <div key={lodge.id} className="p-6 bg-white shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5">
                    {currentRole === "pcm" ? "Transit Lodge" : "Verified Corper Lodge"}
                  </span>
                  <Home className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className="text-base font-black text-black">{lodge.name}</h3>
                <div className="text-lg font-black text-emerald-600">{lodge.price}</div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {lodge.location}
                </p>

                <div className="pt-2 space-y-1.5">
                  {lodge.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 bg-slate-50 p-3 text-center space-y-2">
                <span className="text-[10px] font-bold text-slate-500 block">Status</span>
                <span className="text-xs font-black text-black block">{lodge.split}</span>
                <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all">
                  {currentRole === "pcm" ? "Book Transit Stay" : "Request Landlord Tour"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roommates.map((rm) => (
            <div key={rm.id} className="p-6 bg-white shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5">
                    {rm.gender} · {rm.budget}
                  </span>
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>

                <h3 className="text-base font-black text-black">{rm.name}</h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 block w-fit">
                  PPA: {rm.ppa}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3">
                  &ldquo;{rm.preference}&rdquo;
                </p>
              </div>

              <button
                onClick={() => setMatchedId(rm.id)}
                className={`w-full py-2.5 text-xs font-bold transition-all ${
                  matchedId === rm.id
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-black hover:bg-black hover:text-white"
                }`}
              >
                {matchedId === rm.id ? "Match Request Sent!" : "Connect & Match"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
