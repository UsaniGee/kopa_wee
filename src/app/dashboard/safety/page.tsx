"use client";

import React, { useState } from "react";
import ComingSoon from "@/shared/components/ComingSoon";
import { FiAlertOctagon, FiMapPin, FiPhone, FiAlertTriangle, FiCheckCircle, FiRadio, FiUserCheck, FiPackage, FiPlus, FiTrash2, FiLock, FiClock, FiX, FiShield } from "react-icons/fi";

const ShieldAlert = FiAlertOctagon;
const MapPin = FiMapPin;
const Phone = FiPhone;
const AlertTriangle = FiAlertTriangle;
const CheckCircle2 = FiCheckCircle;
const Radio = FiRadio;
const UserCheck = FiUserCheck;
const Luggage = FiPackage;
const Plus = FiPlus;
const Trash2 = FiTrash2;
const Lock = FiLock;
const Clock = FiClock;
const X = FiX;
const ShieldCheck = FiShield;

type SosState =
  | { phase: "idle" | "locating" | "sending" }
  | { phase: "sent"; message: string; at: string; accuracy: number }
  | { phase: "error"; message: string };

export default function SafetyPage() {
  const [sos, setSos] = useState<SosState>({ phase: "idle" });
  const sosBusy = sos.phase === "locating" || sos.phase === "sending";

  const handleTriggerSos = async () => {
    if (sos.phase === "locating" || sos.phase === "sending") return;

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setSos({ phase: "error", message: "This browser can't share your location, so no alert was sent." });
      return;
    }

    setSos({ phase: "locating" });
    let position: GeolocationPosition;
    try {
      position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 })
      );
    } catch (err) {
      const code = (err as GeolocationPositionError)?.code;
      setSos({
        phase: "error",
        message:
          code === 1
            ? "Location permission was denied, so no alert was sent. Allow location for this site in your browser settings and try again."
            : "Your location could not be found, so no alert was sent. Move to an open area or turn on GPS and try again.",
      });
      return;
    }

    setSos({ phase: "sending" });
    try {
      // State and LGA come from your saved profile on the server
      const res = await fetch("/api/safety/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          message: "EMERGENCY SOS: Corper needs immediate assistance!",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setSos({ phase: "error", message: data.error || "The alert could not be saved." });
        return;
      }
      setSos({
        phase: "sent",
        message: data.message,
        at: new Date(data.data.createdAt).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
        accuracy: Math.round(position.coords.accuracy),
      });
    } catch {
      setSos({ phase: "error", message: "Network error: the alert was not sent." });
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="p-8 bg-[#121815] text-white border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-widest font-display">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>TRAVEL & SOS SAFETY TRACKER</span>
          </div>
          <h1 className="text-3xl font-medium text-white tracking-tight font-display">
            Highway Convoys & Emergency Broadcast
          </h1>
          <p className="text-xs text-slate-300">
            SOS records your current location and emails you a copy. Alerts to trusted contacts are not available yet. In danger? Call 112.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={handleTriggerSos}
            disabled={sosBusy}
            className={`px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
              sosBusy ? "bg-red-700 text-white border border-red-500 animate-pulse cursor-wait" : "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>
              {sos.phase === "locating" ? "Getting your location..." : sos.phase === "sending" ? "Sending SOS..." : "Send SOS with my location"}
            </span>
          </button>
          <a
            href="tel:112"
            className="px-6 py-4 border border-slate-600 hover:border-white text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Call 112</span>
          </a>
        </div>
      </div>

      {/* SOS result: only what the server confirmed */}
      <div aria-live="assertive">
        {sos.phase === "sent" && (
          <div className="p-6 bg-red-950/40 border border-red-600/50 text-white space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold font-display text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>SOS LOGGED AT {sos.at}</span>
            </div>
            <p className="text-xs text-slate-300">{sos.message}</p>
            <p className="text-[11px] text-slate-400 font-mono">Location accuracy: about {sos.accuracy} m</p>
          </div>
        )}
        {sos.phase === "error" && (
          <div role="alert" className="p-6 bg-red-950/40 border border-red-600/50 text-white space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold font-display text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>SOS NOT SENT</span>
            </div>
            <p className="text-xs text-slate-300">{sos.message} If you are in danger, call 112 now.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComingSoon
          compact
          icon={MapPin}
          title="Trip check-ins"
          description="Share your route before an interstate trip and check in at each stop."
          planned={["Route and expected arrival", "Check-in reminders on the road"]}
        />
        <ComingSoon
          compact
          icon={Phone}
          title="Trusted contacts"
          description="Choose up to five people who receive your SOS alerts by SMS or email."
          planned={["Family and friends", "Your LGA corps rep"]}
        />
      </div>
    </div>
  );
}
