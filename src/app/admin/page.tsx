"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  FiShield,
  FiMail,
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

interface AdminInvite {
  id: string;
  email: string;
  role: string;
  invitedBy: string;
  status: string;
  createdAt: string;
  expiresAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"marketplace" | "accommodation" | "users" | "invites">("marketplace");
  const [loading, setLoading] = useState(true);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [pendingLodges, setPendingLodges] = useState<PendingLodge[]>([]);
  const [actionMsg, setActionMsg] = useState("");

  // Invite state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "USER">("USER");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [pendingInvites, setPendingInvites] = useState<AdminInvite[]>([]);

  // User status management state
  const [userSearch, setUserSearch] = useState("");
  const [userSearchResult, setUserSearchResult] = useState<any>(null);
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [revertReason, setRevertReason] = useState("");
  const [revertStatus, setRevertStatus] = useState<"PCM" | "SERVING" | "ALUMNI">("PCM");
  const [revertLoading, setRevertLoading] = useState(false);

  // TODO: get real admin userId from auth session
  const adminUserId = session?.user?.id;

  const fetchPendingData = async () => {
    setLoading(true);
    try {
      const [itemsRes, lodgesRes, invitesRes] = await Promise.all([
        fetch("/api/marketplace?status=PENDING_APPROVAL"),
        fetch("/api/accommodation?status=PENDING_APPROVAL"),
        fetch("/api/admin/invite"),
      ]);

      const itemsData = await itemsRes.json();
      const lodgesData = await lodgesRes.json();
      const invitesData = await invitesRes.json();

      if (itemsData.success) setPendingItems(itemsData.data || []);
      if (lodgesData.success) setPendingLodges(lodgesData.data || []);
      if (invitesData.success) setPendingInvites(invitesData.data || []);
    } catch (err) {
      console.error("Failed to load admin pending listings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || (session && (session.user as any)?.applicationRole !== "ADMIN")) {
      router.push("/admin/login");
      return;
    }
    fetchPendingData();
  }, [router, status, session]);

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

  const handleSendInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviteLoading(true);
    setInviteError("");
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`✅ Invite sent to ${inviteEmail}`);
        setInviteEmail("");
        setInviteError("");
        fetchPendingData();
      } else {
        setInviteError(data.error || "Failed to send invite.");
      }
    } catch {
      setInviteError("Network error. Please try again.");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/admin/login" });
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
    <div className="min-h-screen bg-[#eaf5ed] dark:bg-[#0a0f0d] text-[#121815] dark:text-white font-sans transition-colors duration-300">
      {/* Admin Top Navbar */}
      <nav className="bg-[#121815] border-b border-slate-800 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0" />
          <div>
            <h1 className="font-bold text-xs sm:text-base font-display text-white dark:text-white">
              KopaWee Control Center
            </h1>
            <p className="text-[9px] sm:text-[10px] text-emerald-400 font-mono">Moderation & approval portal</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={fetchPendingData}
            title="Refresh Feed"
            aria-label="Refresh Feed"
            className="px-2.5 sm:px-3 py-2 bg-white/10 dark:bg-slate-900 border border-slate-600 dark:border-slate-800 hover:border-emerald-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Refresh Feed</span>
          </button>

          <button
            onClick={handleLogout}
            title="Logout Admin"
            aria-label="Logout Admin"
            className="px-2.5 sm:px-3.5 py-2 bg-red-950/60 border border-red-800/80 hover:bg-red-900 text-red-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Logout Admin</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {actionMsg && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <span>{actionMsg}</span>
            <button onClick={() => setActionMsg("")} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>Pending Marketplace Ads</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-amber-400">{pendingItems.length}</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-500">Requires Product Owner review before live publishing</p>
          </div>

          <div className="p-5 bg-white dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>Pending Lodge Listings</span>
              <Home className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-emerald-400">{pendingLodges.length}</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-500">Corper accommodation &amp; roommate split listings</p>
          </div>

          <div className="p-5 bg-white dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>Total Under Review</span>
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-white">
              {pendingItems.length + pendingLodges.length}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-500">All classified items pending approval</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-300/60 dark:border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("marketplace")}
            className={`px-4 sm:px-5 py-3 text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === "marketplace"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-[#eaf5ed] dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300/60 dark:border-slate-800 hover:border-emerald-600 hover:text-[#121815] dark:hover:text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Pending Marketplace Items</span>
            <span className="sm:hidden">Marketplace</span>
            <span>({pendingItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("accommodation")}
            className={`px-4 sm:px-5 py-3 text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === "accommodation"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-[#eaf5ed] dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300/60 dark:border-slate-800 hover:border-emerald-600 hover:text-[#121815] dark:hover:text-white"
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Pending Lodges</span>
            <span className="sm:hidden">Lodges</span>
            <span>({pendingLodges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 sm:px-5 py-3 text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === "users"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-[#eaf5ed] dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300/60 dark:border-slate-800 hover:border-emerald-600 hover:text-[#121815] dark:hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">User Status Management</span>
            <span className="sm:hidden">Users</span>
          </button>

          <button
            onClick={() => setActiveTab("invites")}
            className={`px-4 sm:px-5 py-3 text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === "invites"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-[#eaf5ed] dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300/60 dark:border-slate-800 hover:border-emerald-600 hover:text-[#121815] dark:hover:text-white"
            }`}
          >
            <FiMail className="w-4 h-4" />
            <span className="hidden sm:inline">Admin Invites</span>
            <span className="sm:hidden">Invites</span>
            <span>({pendingInvites.length})</span>
          </button>
        </div>


        {/* Listings Moderation List */}
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-slate-400 space-y-2">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-500 dark:text-slate-400">Fetching pending listings for review...</p>
          </div>
        ) : activeTab === "marketplace" ? (
          pendingItems.length === 0 ? (
            <div className="p-12 bg-white dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold font-display text-[#121815] dark:text-white">No Pending Marketplace Items!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">All submitted items have been reviewed by Product Owner admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingItems.map((item) => (
                <div key={item.id} className="p-6 bg-white dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={item.images?.[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"}
                      alt={item.title}
                      className="w-24 h-24 object-cover border border-slate-300/60 dark:border-slate-700 shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-semibold">
                        Pending approval
                      </span>
                      <h3 className="text-base font-bold font-display text-[#121815] dark:text-white">{item.title}</h3>
                      <div className="text-emerald-400 font-mono font-bold text-sm">{item.price}</div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.lga}, {item.state} · Category: {item.category}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-900/60 p-3 border border-slate-200 dark:border-slate-800 leading-relaxed">
                    &quot;{item.description}&quot;
                  </p>

                  {item.seller && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono border-t border-slate-200/80 dark:border-slate-800/80 pt-2 flex items-center justify-between">
                      <span>Seller: {item.seller.name} ({item.seller.email})</span>
                      <span>Phone: {item.seller.phone}</span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => handleApproveItem(item.id, "marketplace")}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                      title="Approve Ad & Publish Live"
                    >
                      <Check className="w-4 h-4" />
                      <span className="hidden sm:inline">Approve ad & publish live</span>
                      <span className="sm:hidden">Approve</span>
                    </button>
                    <button
                      onClick={() => handleRejectItem(item.id, "marketplace")}
                      className="px-4 py-2.5 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Reject Ad"
                    >
                      <XCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : pendingLodges.length === 0 ? (
          <div className="p-12 bg-white dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold font-display text-[#121815] dark:text-white">No Pending Lodge Listings!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">All submitted accommodation listings have been reviewed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingLodges.map((lodge) => (
              <div key={lodge.id} className="p-6 bg-white dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={lodge.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=85"}
                    alt={lodge.title}
                    className="w-24 h-24 object-cover border border-slate-300/60 dark:border-slate-700 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-semibold">
                      Pending approval
                    </span>
                    <h3 className="text-base font-bold font-display text-[#121815] dark:text-white">{lodge.title}</h3>
                    <div className="text-emerald-400 font-mono font-bold text-sm">{lodge.price}</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{lodge.location}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-900/60 p-3 border border-slate-200 dark:border-slate-800 leading-relaxed">
                  &quot;{lodge.description}&quot;
                </p>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono border-t border-slate-200/80 dark:border-slate-800/80 pt-2 flex items-center justify-between">
                  <span>WhatsApp Contact: {lodge.contactPhone}</span>
                  <span>Owner: {lodge.owner?.name || "Corper User"}</span>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => handleApproveItem(lodge.id, "accommodation")}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                    title="Approve Lodge & Publish Live"
                  >
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Approve lodge & publish live</span>
                    <span className="sm:hidden">Approve</span>
                  </button>
                  <button
                    onClick={() => handleRejectItem(lodge.id, "accommodation")}
                    className="px-4 py-2.5 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Reject Lodge"
                  >
                    <XCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Reject</span>
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
            <div className="p-6 bg-white dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold font-display text-[#121815] dark:text-white uppercase tracking-widest">Search User by ID</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchUserById()}
                  placeholder="Enter User ID..."
                  className="flex-1 px-4 py-3 text-xs bg-[#dcece1] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-700 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600 transition-colors"
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
                <div className="p-6 bg-white dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 font-display">User Profile</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display">Name</p>
                      <p className="text-sm font-bold text-[#121815] dark:text-white">{userSearchResult.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display">Email</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">{userSearchResult.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display">NYSC Status</p>
                      <p className={`text-sm font-bold ${
                        userSearchResult.nyscStatus === "SERVING" ? "text-emerald-400" :
                        userSearchResult.nyscStatus === "ALUMNI" ? "text-blue-400" : "text-amber-400"
                      }`}>{userSearchResult.nyscStatus}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display">App Role</p>
                      <p className="text-xs font-bold text-[#121815] dark:text-white">{userSearchResult.applicationRole}</p>
                    </div>
                  </div>
                </div>

                {/* Status History */}
                {userHistory.length > 0 && (
                  <div className="p-6 bg-white dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 font-display">Status History</h3>
                    <div className="space-y-2">
                      {userHistory.map((h) => (
                        <div key={h.id} className="flex items-center gap-4 py-2 border-b border-slate-200 dark:border-slate-800/60 text-xs font-mono">
                          <span className="text-slate-400 dark:text-slate-500">{new Date(h.createdAt).toLocaleDateString()}</span>
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
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-display">New Status</label>
                      <select
                        value={revertStatus}
                        onChange={(e) => setRevertStatus(e.target.value as "PCM" | "SERVING" | "ALUMNI")}
                        className="w-full px-3 py-3 text-xs bg-[#dcece1] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-700 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600 transition-colors"
                      >
                        <option value="PCM">PCM</option>
                        <option value="SERVING">SERVING</option>
                        <option value="ALUMNI">ALUMNI</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-display">Reason (required)</label>
                      <input
                        type="text"
                        value={revertReason}
                        onChange={(e) => setRevertReason(e.target.value)}
                        placeholder="Reason for status change..."
                        className="w-full px-3 py-3 text-xs bg-[#dcece1] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-700 text-[#121815] dark:text-white focus:outline-none focus:border-red-500 transition-colors"
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

        {/* Admin Invites Tab */}
        {activeTab === "invites" && (
          <div className="space-y-6">
            {/* Send Invite */}
            <div className="p-6 bg-white dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-5">
              <div>
                <h3 className="text-sm font-bold font-display text-[#121815] dark:text-white uppercase tracking-widest">
                  Send Admin Invite
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Invite someone to set up an admin or moderator account. They will receive an email with a secure setup link valid for 48 hours.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative sm:col-span-2">
                  <FiMail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendInvite()}
                    placeholder="Email address to invite..."
                    className="w-full pl-10 pr-4 py-3 text-xs bg-[#dcece1] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-700 text-[#121815] dark:text-white focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as "ADMIN" | "USER")}
                  className="px-4 py-3 text-xs bg-[#dcece1] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-700 text-[#121815] dark:text-white focus:outline-none focus:border-red-600 transition-colors"
                >
                  <option value="USER">Moderator (USER)</option>
                  <option value="ADMIN">Administrator (ADMIN)</option>
                </select>
              </div>
              <button
                onClick={handleSendInvite}
                disabled={inviteLoading || !inviteEmail.trim()}
                className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {inviteLoading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>SENDING...</span></>
                ) : (
                  <><FiMail className="w-4 h-4" /><span>SEND INVITE EMAIL</span></>
                )}
              </button>
              {inviteError && (
                <p className="text-xs text-red-500 font-mono mt-1 flex items-center gap-1.5">
                  <FiAlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  {inviteError}
                </p>
              )}
            </div>

            {/* Pending Invites */}
            <div className="p-6 bg-white dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold font-display text-[#121815] dark:text-white uppercase tracking-widest">
                Pending Invites ({pendingInvites.length})
              </h3>
              {pendingInvites.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400 font-mono">
                  No pending invites. Send an invite above to get started.
                </div>
              ) : (
                <div className="space-y-0 divide-y divide-slate-200 dark:divide-slate-800">
                  {pendingInvites.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between py-3 text-xs">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-[#121815] dark:text-white font-mono">{inv.email}</p>
                        <p className="text-slate-500 dark:text-slate-400">
                          Invited as{" "}
                          <span className={`font-bold ${inv.role === "ADMIN" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                            {inv.role}
                          </span>
                        </p>
                      </div>
                      <div className="text-right space-y-0.5">
                        <p className="text-slate-400 dark:text-slate-500 font-mono text-[10px] uppercase tracking-wider">Expires</p>
                        <p className="text-slate-600 dark:text-slate-300 font-mono">
                          {new Date(inv.expiresAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
