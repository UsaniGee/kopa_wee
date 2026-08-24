"use client";

import React, { useState } from "react";
import { useRole } from "@/shared/context/RoleContext";
import { Users, CheckCircle2, DollarSign, Calendar, MapPin, Download, AlertCircle, Luggage, ShieldCheck } from "lucide-react";

export default function CommunityPage() {
  const { currentRole } = useRole();
  const [duesPaid, setDuesPaid] = useState(true);

  const duesHistory = [
    { month: "August 2026", amount: "₦1,000", status: "Paid", ref: "CDS-AUG-4819" },
    { month: "July 2026", amount: "₦1,000", status: "Paid", ref: "CDS-JUL-3210" },
    { month: "June 2026", amount: "₦1,000", status: "Paid", ref: "CDS-JUN-1092" },
  ];

  // =========================================================================
  // PCM VIEW (NO CDS YET)
  // =========================================================================
  if (currentRole === "pcm") {
    return (
      <div className="space-y-8">
        <div className="p-8 bg-white shadow-sm border-l-4 border-amber-500 space-y-4">
          <div className="flex items-center gap-3 text-amber-900 font-black text-sm uppercase tracking-wider">
            <Luggage className="w-5 h-5 text-amber-600" />
            PCM Stage: CDS Group Locked
          </div>
          <h1 className="text-2xl font-black text-black">Community Development Service (CDS)</h1>
          <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
            Community Development Service (CDS) group assignments occur after orientation camp when you report to your Local Government Inspector (LGI). Features unlock automatically when you transition to <strong>Serving Corps Member</strong>.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CDS EXECUTIVE VIEW
  // =========================================================================
  if (currentRole === "cds_exec") {
    return (
      <div className="space-y-8">
        <div className="p-6 bg-black text-white space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-slate-900 px-3 py-1 inline-block">
            • CDS Executive Hub
          </span>
          <h1 className="text-2xl font-black text-white">Editorial & Publicity CDS Executive Portal</h1>
          <p className="text-xs text-slate-400">Manage 42 registered group members, track dues payments, and output attendance registers.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-500">August Dues Collection</span>
            <div className="text-2xl font-black text-black">₦42,000</div>
            <span className="text-xs text-emerald-700 font-bold">100% Collection Rate</span>
          </div>

          <div className="p-6 bg-white shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-500">Active Projects</span>
            <div className="text-2xl font-black text-black">2 Projects</div>
            <span className="text-xs text-slate-500">Computer Lab & Solar Light</span>
          </div>

          <div className="p-6 bg-white shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-500">LGI Attendance PDF</span>
            <div className="text-2xl font-black text-emerald-600">Ready to Print</div>
            <span className="text-xs text-slate-500">Signed by CDS Sec.</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SERVING CORPS MEMBER VIEW
  // =========================================================================
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 inline-block mb-2">
            • Serving Corper Module
          </span>
          <h1 className="text-2xl font-black text-black">CDS Community Group Manager</h1>
          <p className="text-xs text-slate-500 mt-1">
            Friday CDS group meeting attendance, monthly dues ledger, and community project collaboration.
          </p>
        </div>

        <button
          onClick={() => setDuesPaid(!duesPaid)}
          className={`px-5 py-3 text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
            duesPaid ? "bg-emerald-600 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>{duesPaid ? "August Dues Paid (₦1,000)" : "Pay August CDS Dues"}</span>
        </button>
      </div>

      {/* Group Info Card */}
      <div className="p-6 bg-black text-white shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Assigned CDS Group</span>
            <h2 className="text-xl font-black">Education & ICT CDS Development Group</h2>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Ikeja High School Hall, Oba Akran, Lagos
            </p>
          </div>

          <div className="p-3 bg-slate-900 text-right space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Next Meeting</span>
            <span className="text-sm font-black text-white block">Friday, 08:30 AM</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-900 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">CDS President</span>
            <span className="font-bold text-white block">Corper Temitope B.</span>
          </div>
          <div className="p-4 bg-slate-900 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Group Members</span>
            <span className="font-bold text-emerald-400 block">48 Active Corps Members</span>
          </div>
          <div className="p-4 bg-slate-900 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Community Project</span>
            <span className="font-bold text-white block">Ikeja Library Computer Lab Renovation</span>
          </div>
        </div>
      </div>

      {/* Dues History Ledger */}
      <div className="p-6 bg-white shadow-sm space-y-6">
        <h2 className="text-base font-black text-black">Monthly CDS Dues Payment Receipts</h2>

        <div className="divide-y divide-slate-100">
          {duesHistory.map((d, i) => (
            <div key={i} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-black">{d.month}</span>
                  <span className="text-[10px] text-slate-400 block">Ref: {d.ref}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-black text-black">{d.amount}</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {d.status}
                </span>
                <button className="p-1 text-slate-400 hover:text-black" title="Download Receipt">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
