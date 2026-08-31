"use client";

import React, { useState } from "react";
import { useRole } from "@/shared/context/RoleContext";
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

interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export default function SafetyPage() {
  const { currentRole } = useRole();
  const [sosActive, setSosActive] = useState(false);
  const [tripActive, setTripActive] = useState(true);
  
  const [contacts, setContacts] = useState<TrustedContact[]>([
    { id: "1", name: "Mr. & Mrs. Okeke", relationship: "Parents", phone: "+234 803 123 4567" },
    { id: "2", name: "Corper President Ikeja", relationship: "Local Corper Rep", phone: "+234 812 987 6543" },
    { id: "3", name: "NYSC HQ Emergency Response", relationship: "NYSC Official", phone: "0700-CALL-NYSC" },
  ]);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactRel, setNewContactRel] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");

  const [tripModalOpen, setTripModalOpen] = useState(false);
  const [originState, setOriginState] = useState("Lagos State");
  const [destinationState, setDestinationState] = useState("Kaduna NYSC Camp");
  const [pingInterval, setPingInterval] = useState("2 Hours");

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    if (contacts.length >= 5) {
      alert("Maximum 5 trusted safety contacts allowed.");
      return;
    }
    const newEntry: TrustedContact = {
      id: "contact_" + Date.now(),
      name: newContactName.trim(),
      relationship: newContactRel.trim() || "Contact",
      phone: newContactPhone.trim(),
    };
    setContacts(prev => [...prev, newEntry]);
    setNewContactName("");
    setNewContactRel("");
    setNewContactPhone("");
    setAddModalOpen(false);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
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
            Real-time travel check-in and encrypted SOS alerts sent to your designated trusted contacts.
          </p>
        </div>

        <button
          onClick={() => setSosActive(!sosActive)}
          className={`px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 cursor-pointer ${
            sosActive
              ? "bg-red-700 text-white border border-red-500 animate-pulse"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>{sosActive ? "SOS EMERGENCY BROADCASTING" : "TRIGGER SOS BROADCAST"}</span>
        </button>
      </div>

      {/* SOS Active Alert Box */}
      {sosActive && (
        <div className="p-6 bg-red-950/40 border border-red-600/50 text-white space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-bold font-display text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>EMERGENCY SOS ACTIVE</span>
          </div>
          <p className="text-xs text-slate-300">
            GPS Location pinged to {contacts.length} trusted contacts and NYSC Security Desk.
          </p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Highway Travel Monitoring */}
        <div className="p-8 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#121815] dark:text-white uppercase tracking-widest font-display flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" /> Active Highway Convoy Tracker
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-700 text-white uppercase">
              {tripActive ? "Active Trip" : "Idle"}
            </span>
          </div>

          <div className="p-5 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 space-y-2 text-xs">
            <div><strong>Route:</strong> {originState} ➔ {destinationState}</div>
            <div><strong>Check-in Interval:</strong> Every {pingInterval}</div>
            <div className="text-emerald-700 dark:text-emerald-400 font-semibold">Status: Convoy on schedule (Last ping 12m ago)</div>
          </div>

          <button
            onClick={() => setTripModalOpen(true)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Configure Trip & Check-ins ➔
          </button>
        </div>

        {/* Trusted Contacts Vault */}
        <div className="p-8 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#121815] dark:text-white uppercase tracking-widest font-display flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" /> Emergency Trusted Contacts ({contacts.length}/5)
            </h2>

            {contacts.length < 5 && (
              <button
                onClick={() => setAddModalOpen(true)}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider hover:underline"
              >
                + Add Contact
              </button>
            )}
          </div>

          <div className="space-y-2">
            {contacts.map((c) => (
              <div key={c.id} className="p-3.5 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#121815] dark:text-white font-display">{c.name}</div>
                  <div className="text-slate-500">{c.relationship} · {c.phone}</div>
                </div>
                <button
                  onClick={() => handleDeleteContact(c.id)}
                  className="text-slate-400 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
