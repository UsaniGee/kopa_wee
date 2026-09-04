"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiShoppingBag,
  FiHome,
  FiUsers,
  FiRefreshCw,
  FiLogOut,
  FiCheck,
  FiClock,
  FiAlertTriangle,
  FiSearch,
  FiLoader
} from "react-icons/fi";

const Shield = FiShield;
const CheckCircle2 = FiCheckCircle;
const XCircle = FiXCircle;
const ShoppingBag = FiShoppingBag;
const Home = FiHome;
const Users = FiUsers;
const RefreshCw = FiRefreshCw;
const LogOut = FiLogOut;
const Check = FiCheck;
const Clock = FiClock;
const AlertTriangle = FiAlertTriangle;
const Search = FiSearch;

interface PendingItem {
  id: string;
  title: string;
  category: string;
  price: string;
  state: string;
  lga: string;
  description: string;
  images: string[];
  status: string;
  createdAt: string;
  seller?: { name: string; email: string; phone: string; stateCode: string };
}

interface PendingLodge {
  id: string;
  title: string;
  price: string;
  state: string;
  lga: string;
  location: string;
  description: string;
  contactPhone: string;
  images: string[];
  status: string;
  createdAt: string;
  owner?: { name: string; email: string; phone: string; stateCode: string };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"marketplace" | "accommodation" | "users">("marketplace");
  const [loading, setLoading] = useState(true);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [pendingLodges, setPendingLodges] = useState<PendingLodge[]>([]);
  const [actionMsg, setActionMsg] = useState("");

  // User status management state
  const [userSearch, setUserSearch] = useState("");
  const [userSearchResult, setUserSearchResult] = useState<any>(null);
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [revertReason, setRevertReason] = useState("");
  const [revertStatus, setRevertStatus] = useState<"PCM" | "SERVING" | "ALUMNI">("PCM");
  const [revertLoading, setRevertLoading] = useState(false);

  // TODO: get real admin userId from auth session
  const adminUserId = typeof window !== "undefined" ? (localStorage.getItem("kopawee_admin_user_id") || "admin_user_id") : "admin_user_id";

  const fetchPendingData = async () => {
    setLoading(true);
    try {
      const [itemsRes, lodgesRes] = await Promise.all([
        fetch("/api/marketplace?status=PENDING_APPROVAL"),
        fetch("/api/accommodation?status=PENDING_APPROVAL"),
      ]);

      const itemsData = await itemsRes.json();
      const lodgesData = await lodgesRes.json();

      if (itemsData.success) setPendingItems(itemsData.data || []);
      if (lodgesData.success) setPendingLodges(lodgesData.data || []);
    } catch (err) {
      console.error("Failed to load admin pending listings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const adminToken = localStorage.getItem("kopawee_admin_token");
    if (!adminToken) {
      router.push("/admin/login");
      return;
    }
    fetchPendingData();
  }, [router]);

  const handleApproveItem = async (id: string, type: "marketplace" | "accommodation") => {
    try {
      const url = type === "marketplace" ? "/api/marketplace" : "/api/accommodation";
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "ACTIVE" }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`✅ Listing ${id} APPROVED and published live!`);
        fetchPendingData();
      }
    } catch (err) {
      setActionMsg("❌ Failed to approve listing");
    }
  };

  const handleRejectItem = async (id: string, type: "marketplace" | "accommodation") => {
    try {
      const url = type === "marketplace" ? "/api/marketplace" : "/api/accommodation";
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "REJECTED" }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`🚫 Listing ${id} REJECTED.`);
        fetchPendingData();
      }
    } catch (err) {
      setActionMsg("❌ Failed to reject listing");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("kopawee_admin_token");
    router.push("/admin/login");
  };

  const searchUserById = async () => {
    if (!userSearch.trim()) return;
    setUserSearchLoading(true);
    setUserSearchResult(null);
    setUserHistory([]);
    try {
      const res = await fetch(`/api/admin/users/${userSearch.trim()}/history?adminUserId=${adminUserId}`);
      const data = await res.json();
      if (data.success) {
        setUserSearchResult(data.data.user);
        setUserHistory(data.data.statusHistory);
      } else {
        setActionMsg(`❌ ${data.error}`);
      }
    } catch (err) {
      setActionMsg("❌ Failed to search user");
    } finally {
      setUserSearchLoading(false);
    }
  };

  const handleRevertStatus = async () => {
    if (!userSearchResult || !revertReason.trim()) return;
    setRevertLoading(true);
    try {
      const res = await fetch("/api/admin/users/revert-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminUserId,
          targetUserId: userSearchResult.id,
          newStatus: revertStatus,
          reason: revertReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`✅ ${data.message}`);
        setUserSearchResult({ ...userSearchResult, nyscStatus: revertStatus });
        setRevertReason("");
        // Refresh history
        searchUserById();
      } else {
        setActionMsg(`❌ ${data.error || data.message}`);
      }
    } catch (err) {
      setActionMsg("❌ Failed to revert status");
    } finally {
      setRevertLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-white font-sans">
      {/* Admin Top Navbar */}
      <nav className="bg-[#121815] border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="font-bold text-base font-display uppercase tracking-wider text-white">
              KopaWee Platform Owner Control Center
            </h1>
            <p className="text-[10px] text-emerald-400 font-mono">CLASSIFIED AD MODERATION & APPROVAL PORTAL</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchPendingData}
            className="p-2 bg-slate-900 border border-slate-800 hover:border-emerald-500 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Feed</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 bg-red-950/60 border border-red-800/80 hover:bg-red-900 text-red-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Admin</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {actionMsg && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fadeIn">
            <span>{actionMsg}</span>
            <button onClick={() => setActionMsg("")} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-[#121a16] border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>PENDING MARKETPLACE ADS</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-amber-400">{pendingItems.length}</div>
            <p className="text-[11px] text-slate-500">Requires Product Owner review before live publishing</p>
          </div>

          <div className="p-5 bg-[#121a16] border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>PENDING LODGE LISTINGS</span>
              <Home className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-emerald-400">{pendingLodges.length}</div>
            <p className="text-[11px] text-slate-500">Corper accommodation & roommate split listings</p>
          </div>

          <div className="p-5 bg-[#121a16] border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>TOTAL UNDER REVIEW</span>
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-white">
              {pendingItems.length + pendingLodges.length}
            </div>
            <p className="text-[11px] text-slate-500">All classified items pending approval</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("marketplace")}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === "marketplace"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pending Marketplace Items ({pendingItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("accommodation")}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === "accommodation"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Pending Lodges ({pendingLodges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === "users"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Status Management</span>
          </button>
        </div>

        {/* Listings Moderation List */}
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-slate-400 space-y-2">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Fetching pending listings for review...</p>
          </div>
        ) : activeTab === "marketplace" ? (
          pendingItems.length === 0 ? (
            <div className="p-12 bg-[#121a16] border border-slate-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold font-display text-white">No Pending Marketplace Items!</h3>
              <p className="text-xs text-slate-400">All submitted items have been reviewed by Product Owner admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingItems.map((item) => (
                <div key={item.id} className="p-6 bg-[#121a16] border border-slate-800 space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={item.images?.[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"}
                      alt={item.title}
                      className="w-24 h-24 object-cover border border-slate-700 shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase">
                        PENDING APPROVAL
                      </span>
                      <h3 className="text-base font-bold font-display text-white">{item.title}</h3>
                      <div className="text-emerald-400 font-mono font-bold text-sm">{item.price}</div>
                      <p className="text-xs text-slate-400">{item.lga}, {item.state} · Category: {item.category}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-900/60 p-3 border border-slate-800 leading-relaxed">
                    "{item.description}"
                  </p>

                  {item.seller && (
                    <div className="text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-2 flex items-center justify-between">
                      <span>Seller: {item.seller.name} ({item.seller.email})</span>
                      <span>Phone: {item.seller.phone}</span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => handleApproveItem(item.id, "marketplace")}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve Ad & Publish Live</span>
                    </button>
                    <button
                      onClick={() => handleRejectItem(item.id, "marketplace")}
                      className="px-4 py-2.5 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : pendingLodges.length === 0 ? (
          <div className="p-12 bg-[#121a16] border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold font-display text-white">No Pending Lodge Listings!</h3>
            <p className="text-xs text-slate-400">All submitted accommodation listings have been reviewed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingLodges.map((lodge) => (
              <div key={lodge.id} className="p-6 bg-[#121a16] border border-slate-800 space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={lodge.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=85"}
                    alt={lodge.title}
                    className="w-24 h-24 object-cover border border-slate-700 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase">
                      PENDING APPROVAL
                    </span>
                    <h3 className="text-base font-bold font-display text-white">{lodge.title}</h3>
                    <div className="text-emerald-400 font-mono font-bold text-sm">{lodge.price}</div>
                    <p className="text-xs text-slate-400">{lodge.location}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-900/60 p-3 border border-slate-800 leading-relaxed">
                  "{lodge.description}"
                </p>

                <div className="text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-2 flex items-center justify-between">
                  <span>WhatsApp Contact: {lodge.contactPhone}</span>
                  <span>Owner: {lodge.owner?.name || "Corper User"}</span>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => handleApproveItem(lodge.id, "accommodation")}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Lodge & Publish Live</span>
                  </button>
                  <button
                    onClick={() => handleRejectItem(lodge.id, "accommodation")}
                    className="px-4 py-2.5 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* User Status Management Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Search User */}
            <div className="p-6 bg-[#121a16] border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-widest">Search User by ID</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchUserById()}
                  placeholder="Enter User ID..."
                  className="flex-1 px-4 py-3 text-xs bg-[#0a0f0d] border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={searchUserById}
                  disabled={userSearchLoading}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                >
                  {userSearchLoading ? <FiLoader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* User Result */}
            {userSearchResult && (
              <div className="space-y-4">
                {/* User Profile Summary */}
                <div className="p-6 bg-[#121a16] border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-display">User Profile</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">Name</p>
                      <p className="text-sm font-bold text-white">{userSearchResult.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">Email</p>
                      <p className="text-xs text-slate-300 font-mono">{userSearchResult.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">NYSC Status</p>
                      <p className={`text-sm font-bold ${
                        userSearchResult.nyscStatus === "SERVING" ? "text-emerald-400" :
                        userSearchResult.nyscStatus === "ALUMNI" ? "text-blue-400" : "text-amber-400"
                      }`}>{userSearchResult.nyscStatus}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">App Role</p>
                      <p className="text-xs font-bold text-white">{userSearchResult.applicationRole}</p>
                    </div>
                  </div>
                </div>

                {/* Status History */}
                {userHistory.length > 0 && (
                  <div className="p-6 bg-[#121a16] border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-display">Status History</h3>
                    <div className="space-y-2">
                      {userHistory.map((h) => (
                        <div key={h.id} className="flex items-center gap-4 py-2 border-b border-slate-800/60 text-xs font-mono">
                          <span className="text-slate-500">{new Date(h.createdAt).toLocaleDateString()}</span>
                          <span className="text-red-400">{h.previousStatus}</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-emerald-400">{h.newStatus}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                            h.changeType === "ADMIN_REVERSAL" ? "bg-red-900/30 text-red-400 border border-red-800" :
                            h.changeType === "AUTOMATIC" ? "bg-blue-900/30 text-blue-400 border border-blue-800" :
                            "bg-slate-900 text-slate-400 border border-slate-700"
                          }`}>{h.changeType}</span>
                          <span className="text-slate-500 flex-1 truncate">{h.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Revert Status */}
                <div className="p-6 bg-[#1a0f0f] border border-red-900/60 space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-red-400 font-display">Admin Status Reversal</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Use this only to correct errors. All reversals are recorded in the audit log and the user will be notified.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">New Status</label>
                      <select
                        value={revertStatus}
                        onChange={(e) => setRevertStatus(e.target.value as any)}
                        className="w-full px-3 py-3 text-xs bg-[#0a0f0d] border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="PCM">PCM</option>
                        <option value="SERVING">SERVING</option>
                        <option value="ALUMNI">ALUMNI</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Reason (required)</label>
                      <input
                        type="text"
                        value={revertReason}
                        onChange={(e) => setRevertReason(e.target.value)}
                        placeholder="Reason for status change..."
                        className="w-full px-3 py-3 text-xs bg-[#0a0f0d] border border-slate-700 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleRevertStatus}
                    disabled={revertLoading || !revertReason.trim()}
                    className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {revertLoading ? <FiLoader className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                    <span>Apply Status Change</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
