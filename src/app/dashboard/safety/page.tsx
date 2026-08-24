"use client";

import React, { useState } from "react";
import { useRole } from "@/shared/context/RoleContext";
import { ShieldAlert, MapPin, PhoneCall, AlertTriangle, CheckCircle2, Radio, UserCheck, Luggage } from "lucide-react";

export default function SafetyPage() {
  const { currentRole } = useRole();
  const [sosActive, setSosActive] = useState(false);
  const [tripActive, setTripActive] = useState(true);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 inline-block mb-2">
            • {currentRole === "pcm" ? "PCM Travel Safety" : "Emergency Safety Module"}
          </span>
          <h1 className="text-2xl font-black text-black">
            {currentRole === "pcm" ? "Camp Highway Journey & Route Safety" : "Emergency & Highway Travel SOS Safety"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentRole === "pcm" 
              ? "Proactive travel safety check-ins for PCMs journeying to orientation camp."
              : "Proactive status check-ins during long-distance highway trips between home state, camp, & PPA."}
          </p>
        </div>

        <button
          onClick={() => setSosActive(!sosActive)}
          className={`px-6 py-3.5 text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
            sosActive ? "bg-red-600 text-white animate-pulse" : "bg-red-600 hover:bg-red-700 text-white shadow-lg"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{sosActive ? "SOS Alert Broadcasting..." : "Emergency SOS Trigger"}</span>
        </button>
      </div>

      {/* SOS Active Banner */}
      {sosActive && (
        <div className="p-6 bg-red-50 text-red-900 border-2 border-red-600 space-y-3">
          <div className="flex items-center gap-2 font-black text-lg text-red-700">
            <Radio className="w-5 h-5 animate-spin" /> Live Emergency Broadcast Initiated
          </div>
          <p className="text-xs">
            Your live GPS location (<strong className="font-bold">Lagos-Ibadan Expressway, Km 42</strong>) has been broadcast to your emergency contacts and local NYSC representatives.
          </p>
          <button
            onClick={() => setSosActive(false)}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold"
          >
            Cancel False Alarm
          </button>
        </div>
      )}

      {/* Active Trip Tracker Card */}
      <div className="p-6 bg-black text-white space-y-6 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <div>
              <h2 className="text-base font-black">
                {currentRole === "pcm" ? "PCM Orientation Camp Journey Tracker" : "Active Trip Monitor"}
              </h2>
              <span className="text-xs text-slate-400">Interstate Highway Journey Status</span>
            </div>
          </div>

          <button
            onClick={() => setTripActive(!tripActive)}
            className="px-3 py-1.5 bg-slate-800 text-xs font-bold text-emerald-400 hover:bg-slate-700"
          >
            {tripActive ? "End Trip Monitor" : "Start New Trip"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-slate-900 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Route</span>
            <span className="text-sm font-black text-white block">
              {currentRole === "pcm" ? "Lagos (Home) → Kaduna NYSC Camp" : "Abuja (FCT) → Lagos (Ikeja)"}
            </span>
          </div>
          <div className="p-4 bg-slate-900 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Last Check-In</span>
            <span className="text-sm font-black text-emerald-400 block">Lokoja Junction (1h 40m ago)</span>
          </div>
          <div className="p-4 bg-slate-900 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Est. Arrival</span>
            <span className="text-sm font-black text-white block">Today, 5:30 PM</span>
          </div>
          <div className="p-4 bg-slate-900 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Auto ping Interval</span>
            <span className="text-sm font-black text-white block">Every 2 Hours</span>
          </div>
        </div>
      </div>

      {/* Designated Emergency Responders */}
      <div className="p-6 bg-white shadow-sm space-y-6">
        <h2 className="text-base font-black text-black flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-600" /> Designated Emergency Responders
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 space-y-2">
            <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5">Primary Contact</span>
            <h3 className="text-sm font-bold text-black">Mr. & Mrs. Okeke (Parents)</h3>
            <p className="text-xs text-slate-500">+234 803 123 4567</p>
          </div>
          <div className="p-4 bg-slate-50 space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-700 bg-slate-200 px-2 py-0.5">
              {currentRole === "pcm" ? "Camp Security Desk" : "LGA Corper Rep"}
            </span>
            <h3 className="text-sm font-bold text-black">
              {currentRole === "pcm" ? "Kaduna Camp Security Officer" : "Corper President (Ikeja LGA)"}
            </h3>
            <p className="text-xs text-slate-500">+234 812 987 6543</p>
          </div>
          <div className="p-4 bg-slate-50 space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-700 bg-slate-200 px-2 py-0.5">NYSC Distress Helpline</span>
            <h3 className="text-sm font-bold text-black">NYSC HQ Emergency Response</h3>
            <p className="text-xs text-slate-500">0700-CALL-NYSC</p>
          </div>
        </div>
      </div>
    </div>
  );
}
