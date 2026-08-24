"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRole } from "@/shared/context/RoleContext";
import { 
  Calendar, 
  ShieldCheck, 
  ShoppingBag, 
  Home, 
  ShieldAlert, 
  Briefcase, 
  Users, 
  ArrowRight,
  Zap,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  FileText,
  Sparkles,
  Bot,
  Luggage,
  Compass,
  CheckSquare,
  AlertCircle,
  Building2,
  UserCheck,
  UserX,
  Plus,
  Send,
  Award
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { currentRole, setRole } = useRole();

  // Local interactive states for mini-actions
  const [clearanceDone, setClearanceDone] = useState(false);
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Call-up Letter (3 colored copies)", checked: true },
    { id: 2, text: "Green Card & Statement of Result", checked: true },
    { id: 3, text: "Medical Fitness Certificate", checked: true },
    { id: 4, text: "White Shorts (3 pairs) & Plain White Tees", checked: false },
    { id: 5, text: "Waist Bag & Rubber Shoes", checked: false },
  ]);
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: "John Okoh", role: "ICT Assistant", reason: "Medical Leave (3 Days)", status: "pending" },
    { id: 2, name: "Amina Bello", role: "Research Associate", reason: "LGA Clearance Exemption", status: "pending" },
  ]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const toggleChecklist = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleLeaveAction = (id: number, status: "approved" | "rejected") => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
  };

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    if (aiPrompt.toLowerCase().includes("relocat")) {
      setAiAnswer("To apply for relocation, submit your medical certificate or marital proof via the NYSC Portal during camp orientation. Approval takes 7–14 days after camp.");
    } else {
      setAiAnswer("NYSC Policy Guide: Always inform your Local Government Inspector (LGI) before traveling outside your state of deployment.");
    }
  };

  /* =========================================================================
     1. PROSPECTIVE CORPS MEMBER (PCM) VIEW
     ========================================================================= */
  if (currentRole === "pcm") {
    const completedItems = checklist.filter(c => c.checked).length;
    return (
      <div className="space-y-8">
        {/* Banner */}
        <div className="p-6 sm:p-8 bg-black text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white font-black text-xs uppercase tracking-wider">
              <Luggage className="w-3.5 h-3.5" />
              Role: Prospective Corps Member (PCM)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Get Ready for Mobilization & Orientation Camp! 🇳🇬
            </h1>
            <p className="text-xs text-slate-300">
              Welcome aboard, Graduate! Your stream's call-up letter release is approaching. Prepare your camp kit and documents below.
            </p>
          </div>

          <button
            onClick={() => setRole("serving")}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer touch-manipulation"
          >
            <span>Update Status ➔ Serving Corper</span>
          </button>
        </div>

        {/* Top Grid: Countdown & Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Camp Countdown */}
          <div className="p-6 bg-white shadow-sm space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-black uppercase tracking-wider">Camp Orientation Countdown</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-black">14 Days Left</div>
            <p className="text-xs text-slate-500">KADUNA NYSC Permanent Camp, Black Gold Way, Mando.</p>
          </div>

          {/* Packing Checklist Summary */}
          <div className="p-6 bg-white shadow-sm space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-black uppercase tracking-wider">Packing Checklist</span>
              <CheckSquare className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-black">{completedItems} of {checklist.length} Ready</div>
            <div className="w-full bg-slate-100 h-2">
              <div 
                className="bg-emerald-500 h-2 transition-all"
                style={{ width: `${(completedItems / checklist.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Travel Route Planner */}
          <div className="p-6 bg-white shadow-sm space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-black uppercase tracking-wider">State & Route Planner</span>
              <Compass className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-base font-black text-black">Lagos ➔ Kaduna State</div>
            <p className="text-xs text-slate-500">Direct corper bus convoys leave Jibowu Park Aug 28, 6:00 AM.</p>
          </div>
        </div>

        {/* Middle Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interactive Packing Checklist */}
          <div className="p-6 bg-white shadow-sm space-y-4">
            <h2 className="text-base font-black text-black uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600" /> Camp Mandatory Document & Gear Checklist
            </h2>
            <div className="space-y-2">
              {checklist.map((item) => (
                <label 
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`flex items-center gap-3 p-3 text-xs font-bold transition-all cursor-pointer ${
                    item.checked ? "bg-emerald-50 text-emerald-900 line-through" : "bg-slate-50 text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={item.checked} 
                    onChange={() => {}} 
                    className="accent-emerald-600 w-4 h-4"
                  />
                  <span>{item.text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* NYSC AI Assistant Mini-Product */}
          <div className="p-6 bg-white shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-wider mb-2">
                <Bot className="w-4 h-4" /> KopaWee AI Assistant
              </div>
              <h2 className="text-base font-black text-black">Have Questions About Mobilization or Relocation?</h2>
              <p className="text-xs text-slate-500 mt-1">
                Ask anything regarding green card errors, camp requirements, marital relocation, or medical fitness.
              </p>
            </div>

            <form onSubmit={handleAskAI} className="space-y-3 mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Can I relocate on medical grounds?"
                  className="flex-1 px-3 py-2 text-xs bg-slate-100 border-none text-black focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button type="submit" className="px-4 py-2 bg-black text-white text-xs font-bold hover:bg-slate-800">
                  Ask AI
                </button>
              </div>

              {aiAnswer && (
                <div className="p-3 bg-emerald-50 text-emerald-900 text-xs leading-relaxed font-medium">
                  <strong>AI Response:</strong> {aiAnswer}
                </div>
              )}
            </form>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2">
              <span className="font-bold">Quick suggestions:</span>
              <button 
                onClick={() => { setAiPrompt("How do I process relocation?"); setAiAnswer("To apply for relocation, submit your medical certificate or marital proof via the NYSC Portal during camp orientation. Approval takes 7–14 days after camp."); }}
                className="underline hover:text-emerald-600"
              >
                Relocation process?
              </button>
            </div>
          </div>
        </div>

        {/* PCM Mini-Products Launchpad */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-black uppercase tracking-wider">
            PCM Dedicated Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/dashboard/companion" className="p-6 bg-white shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="p-3 bg-black text-white w-fit"><Luggage className="w-5 h-5" /></div>
              <h3 className="text-sm font-black text-black">Camp Orientation Guide</h3>
              <p className="text-xs text-slate-500">Platoon activities, morning drill routine, camp market tips, and SAED classes.</p>
              <span className="text-xs font-bold text-emerald-600 block">Open Guide ➔</span>
            </Link>

            <Link href="/dashboard/marketplace" className="p-6 bg-white shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="p-3 bg-black text-white w-fit"><ShoppingBag className="w-5 h-5" /></div>
              <h3 className="text-sm font-black text-black">Pre-Camp Gear Market</h3>
              <p className="text-xs text-slate-500">Buy authentic white boots, waist bags, power banks, and mosquito nets from ex-corpers.</p>
              <span className="text-xs font-bold text-emerald-600 block">Browse Gear ➔</span>
            </Link>

            <Link href="/dashboard/safety" className="p-6 bg-white shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="p-3 bg-black text-white w-fit"><ShieldAlert className="w-5 h-5" /></div>
              <h3 className="text-sm font-black text-black">Camp Journey Safety</h3>
              <p className="text-xs text-slate-500">Highway travel status check-in, verified transport hubs, and emergency SOS contacts.</p>
              <span className="text-xs font-bold text-emerald-600 block">Open Safety Tracker ➔</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     2. SERVING CORPS MEMBER VIEW
     ========================================================================= */
  if (currentRole === "serving") {
    return (
      <div className="space-y-8">
        <div className="p-6 sm:p-8 bg-black text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white font-black text-xs uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Role: Serving Corps Member (Batch A 2024)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, Corper Chidi! 🇳🇬
            </h1>
            <p className="text-xs text-slate-300">
              Monthly LGA Clearance is in <strong className="text-white">4 days</strong>. Ikeja LGA Sub-office, Lagos State.
            </p>
          </div>

          <button
            onClick={() => setClearanceDone(!clearanceDone)}
            className={`px-5 py-3 text-xs font-black transition-all flex items-center gap-2 ${
              clearanceDone ? "bg-emerald-600 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{clearanceDone ? "Biometrics Verified" : "Mark Clearance Done"}</span>
          </button>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-black uppercase tracking-wider">Next Clearance</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-black">4 Days Left</div>
            <div className="text-xs text-slate-500">Aug 25 · Ikeja LGA Hub</div>
          </div>

          <div className="p-5 bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-black uppercase tracking-wider">Allawee Savings</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-black">₦77,000</div>
            <div className="text-xs text-emerald-700 font-bold">Saved via Corper Market</div>
          </div>

          <div className="p-5 bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-black uppercase tracking-wider">CDS Attendance</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-black">92% Rate</div>
            <div className="text-xs text-slate-500">Education CDS Group</div>
          </div>

          <div className="p-5 bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-black uppercase tracking-wider">Safety Status</span>
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600">Active & Safe</div>
            <div className="text-xs text-slate-500">Last trip check-in: 2h ago</div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-black uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" /> Serving Corper Mini-Products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/dashboard/companion" className="group p-6 bg-white shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-black text-white"><Calendar className="w-5 h-5" /></div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800">Clearance</span>
              </div>
              <div>
                <h3 className="text-base font-black text-black group-hover:text-emerald-600">Smart Clearance Assistant</h3>
                <p className="text-xs text-slate-500 mt-1">LGA biometric reminders, document vault, and location sync.</p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 pt-2">
                <span>Open Clearance ➔</span>
              </div>
            </Link>

            <Link href="/dashboard/marketplace" className="group p-6 bg-white shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-black text-white"><ShoppingBag className="w-5 h-5" /></div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-200 text-black">Marketplace</span>
              </div>
              <div>
                <h3 className="text-base font-black text-black group-hover:text-emerald-600">Corper Peer Marketplace</h3>
                <p className="text-xs text-slate-500 mt-1">Buy, sell, or swap mattresses, fans, gas cylinders, and POP items.</p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 pt-2">
                <span>Explore Listings ➔</span>
              </div>
            </Link>

            <Link href="/dashboard/accommodation" className="group p-6 bg-white shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-black text-white"><Home className="w-5 h-5" /></div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-200 text-black">Housing</span>
              </div>
              <div>
                <h3 className="text-base font-black text-black group-hover:text-emerald-600">Lodge & Roommate Matcher</h3>
                <p className="text-xs text-slate-500 mt-1">Find lodges near your PPA and split rent with fellow corpers.</p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 pt-2">
                <span>Find Roommates ➔</span>
              </div>
            </Link>

            <Link href="/dashboard/safety" className="group p-6 bg-white shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-black text-white"><ShieldAlert className="w-5 h-5" /></div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800">SOS</span>
              </div>
              <div>
                <h3 className="text-base font-black text-black group-hover:text-emerald-600">Travel SOS Tracker</h3>
                <p className="text-xs text-slate-500 mt-1">Active highway trip monitoring, location broadcast, and emergency contact ping.</p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 pt-2">
                <span>Open Safety ➔</span>
              </div>
            </Link>

            <Link href="/dashboard/workplace" className="group p-6 bg-white shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-black text-white"><Briefcase className="w-5 h-5" /></div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-200 text-black">Workplace</span>
              </div>
              <div>
                <h3 className="text-base font-black text-black group-hover:text-emerald-600">PPA Logbook</h3>
                <p className="text-xs text-slate-500 mt-1">Log weekly work presence, submit leave applications, and view reviews.</p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 pt-2">
                <span>Open Logbook ➔</span>
              </div>
            </Link>

            <Link href="/dashboard/community" className="group p-6 bg-white shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-black text-white"><Users className="w-5 h-5" /></div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-200 text-black">CDS</span>
              </div>
              <div>
                <h3 className="text-base font-black text-black group-hover:text-emerald-600">CDS Group Manager</h3>
                <p className="text-xs text-slate-500 mt-1">Meeting schedule, attendance register, and community projects.</p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 pt-2">
                <span>View CDS ➔</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     3. PPA REPRESENTATIVE (EMPLOYER) VIEW
     ========================================================================= */
  if (currentRole === "ppa") {
    return (
      <div className="space-y-8">
        <div className="p-6 sm:p-8 bg-black text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white font-black text-xs uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              Role: PPA Representative / Employer Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Grace High School PPA Management Hub 🏫
            </h1>
            <p className="text-xs text-slate-300">
              Managing 8 Corps Members assigned to your organization for the 2024 Service Year.
            </p>
          </div>
          <button className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all flex items-center gap-2 shrink-0">
            <Plus className="w-4 h-4" /> Add New Corper Slot
          </button>
        </div>

        {/* Employer Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-black uppercase">Today's Attendance</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-black">7 / 8 Present</div>
            <div className="text-xs text-emerald-700 font-bold">87.5% PPA Punctuality</div>
          </div>

          <div className="p-5 bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-black uppercase">Pending Leaves</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-black">{leaveRequests.filter(l => l.status === "pending").length} Requests</div>
            <div className="text-xs text-slate-500">Requires your approval</div>
          </div>

          <div className="p-5 bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-black uppercase">LGA Monthly Reports</span>
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-black">August Ready</div>
            <div className="text-xs text-slate-500">Signed & Submitted</div>
          </div>

          <div className="p-5 bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-black uppercase">PPA Rating</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-black">4.9 / 5.0</div>
            <div className="text-xs text-emerald-700 font-bold">Top NYSC Employer</div>
          </div>
        </div>

        {/* Leave Applications Management */}
        <div className="p-6 bg-white shadow-sm space-y-4">
          <h2 className="text-base font-black text-black uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-600" /> Corper Leave Applications
          </h2>

          <div className="space-y-3">
            {leaveRequests.map((req) => (
              <div key={req.id} className="p-4 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-black text-sm text-black flex items-center gap-2">
                    <span>{req.name}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-black font-mono">{req.role}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{req.reason}</p>
                </div>

                {req.status === "pending" ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => handleLeaveAction(req.id, "approved")}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all flex items-center gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button 
                      onClick={() => handleLeaveAction(req.id, "rejected")}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-black transition-all flex items-center gap-1"
                    >
                      <UserX className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                ) : (
                  <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 ${
                    req.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                  }`}>
                    {req.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Link to Detailed Staff Portal */}
        <div className="p-6 bg-black text-white flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black">Manage Corper Logbooks & Clearance Letters</h3>
            <p className="text-xs text-slate-400">Issue monthly clearance letters directly to LGA Inspectors.</p>
          </div>
          <Link href="/dashboard/workplace" className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600">
            Open PPA Workplace Hub ➔
          </Link>
        </div>
      </div>
    );
  }

  /* =========================================================================
     4. CDS EXECUTIVE VIEW
     ========================================================================= */
  if (currentRole === "cds_exec") {
    return (
      <div className="space-y-8">
        <div className="p-6 sm:p-8 bg-black text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white font-black text-xs uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              Role: CDS Executive (President / Secretary)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Editorial & Publicity CDS Hub 📢
            </h1>
            <p className="text-xs text-slate-300">
              Ikeja LGA Branch · 42 Registered Corps Members
            </p>
          </div>
          <Link href="/dashboard/community" className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shrink-0">
            Take Today's Attendance ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-500">Total Dues Collected</span>
            <div className="text-2xl font-black text-black">₦42,000</div>
            <span className="text-xs text-emerald-700 font-bold">₦1,000 / Corper per month</span>
          </div>

          <div className="p-6 bg-white shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-500">Active Community Projects</span>
            <div className="text-2xl font-black text-black">2 Projects</div>
            <span className="text-xs text-slate-500">Solar Library & School Renovation</span>
          </div>

          <div className="p-6 bg-white shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-500">Next Meeting</span>
            <div className="text-2xl font-black text-black">Thursday, 9:00 AM</div>
            <span className="text-xs text-slate-500">Ikeja LGA Secretariat Hall</span>
          </div>
        </div>

        <div className="p-6 bg-white shadow-sm space-y-4">
          <h2 className="text-base font-black text-black uppercase tracking-wider">CDS Executive Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/community" className="p-4 bg-slate-50 hover:bg-slate-100 space-y-2">
              <div className="font-black text-sm text-black">Mark Weekly Attendance Register</div>
              <p className="text-xs text-slate-500">Generate printable attendance PDF for the Local Government Inspector (LGI).</p>
            </Link>
            <Link href="/dashboard/community" className="p-4 bg-slate-50 hover:bg-slate-100 space-y-2">
              <div className="font-black text-sm text-black">Broadcast CDS Announcement</div>
              <p className="text-xs text-slate-500">Send instant push alert to all 42 group members regarding project dues.</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     5. NYSC OFFICIAL / LGA INSPECTOR VIEW
     ========================================================================= */
  if (currentRole === "nysc_official") {
    return (
      <div className="space-y-8">
        <div className="p-6 sm:p-8 bg-black text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white font-black text-xs uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Role: NYSC Local Government Inspector (LGI)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ikeja LGA Official Biometric Command Center 🏛️
            </h1>
            <p className="text-xs text-slate-300">
              Lagos State Directorate · Monitoring 1,600 Active Corps Members
            </p>
          </div>
          <Link href="/dashboard/companion" className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shrink-0">
            Open Biometric Scanner ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-500">August Biometrics Verified</span>
            <div className="text-2xl font-black text-black">1,420 / 1,600</div>
            <span className="text-xs text-emerald-700 font-bold">88.7% Clearance Completion</span>
          </div>

          <div className="p-6 bg-white shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-500">PPA Employer Reports</span>
            <div className="text-2xl font-black text-black">148 Approved</div>
            <span className="text-xs text-slate-500">12 Pending Query</span>
          </div>

          <div className="p-6 bg-white shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-500">Biometric Terminal</span>
            <div className="text-2xl font-black text-emerald-600">Online & Syncing</div>
            <span className="text-xs text-slate-500">HQ Server Ping: 12ms</span>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     6. EX-CORPS MEMBER (ALUMNI) VIEW
     ========================================================================= */
  return (
    <div className="space-y-8">
      <div className="p-6 sm:p-8 bg-black text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white font-black text-xs uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            Role: Ex-Corps Member (POP Alumni)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome to the KopaWee Alumni Launchpad! 🎓
          </h1>
          <p className="text-xs text-slate-300">
            Sell your relocation household items, explore post-service job openings, and connect with fellow alumni.
          </p>
        </div>
        <Link href="/dashboard/marketplace" className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shrink-0">
          Post POP Item for Sale ➔
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/marketplace" className="p-6 bg-white shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="p-3 bg-black text-white w-fit"><ShoppingBag className="w-5 h-5" /></div>
          <h3 className="text-base font-black text-black">POP Household Deals Market</h3>
          <p className="text-xs text-slate-500">Directly hand off mattresses, gas cylinders, and appliances to incoming corpers.</p>
          <span className="text-xs font-bold text-emerald-600 block">Open POP Market ➔</span>
        </Link>

        <Link href="/dashboard/workplace" className="p-6 bg-white shadow-sm hover:shadow-md transition-all space-y-3">
          <div className="p-3 bg-black text-white w-fit"><Briefcase className="w-5 h-5" /></div>
          <h3 className="text-base font-black text-black">Post-NYSC Career & Gigs</h3>
          <p className="text-xs text-slate-500">NiYA Job Bank integration, CV builder, remote tech gigs, and employer referrals.</p>
          <span className="text-xs font-bold text-emerald-600 block">Explore Jobs ➔</span>
        </Link>
      </div>
    </div>
  );
}
