"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRole } from "@/shared/context/RoleContext";
import { FiHome, FiUsers, FiMapPin, FiCheckCircle, FiShield, FiHeart, FiPlus, FiPackage, FiAlertTriangle, FiCompass, FiNavigation, FiFlag, FiX, FiSearch, FiFilter, FiEdit2, FiTrash2, FiLoader } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { FiImage } from "react-icons/fi";
import { downscaleImage } from "@/shared/lib/downscaleImage";
import { telLink, whatsAppLink } from "@/shared/utils/phoneLinks";
import { ExpressInterestButton, IncomingInterests, MyInterests } from "./RoommateInterests";

const MAX_PHOTOS = 3;

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
const Edit = FiEdit2;
const Trash2 = FiTrash2;
const Loader2 = FiLoader;

interface Lodge {
  id: string;
  name: string;
  price: string;
  location: string;
  lga: string;
  split: string;
  image: string;
  contactPhone: string | null;
}

export default function AccommodationPage() {
  const { currentRole } = useRole();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"lodges" | "roommates">("lodges");
  const [lodges, setLodges] = useState<Lodge[]>([]);
  const [states, setStates] = useState<{ id: string; name: string; code: string }[]>([]);
  const [roommateRequests, setRoommateRequests] = useState<any[]>([]);
  const [activeUserRequest, setActiveUserRequest] = useState<any | null>(null);
  const [roommateModalOpen, setRoommateModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<any | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [cancellingRequest, setCancellingRequest] = useState(false);

  // Filters
  const [lgaFilter, setLgaFilter] = useState<string>("all");

  const userId = session?.user?.id || "";

  const [interestsRefresh, setInterestsRefresh] = useState(0);

  const fetchRoommatesData = () => {
    fetch("/api/roommates")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRoommateRequests(data.data || []);
        }
      })
      .catch(() => {});

    fetch("/api/roommates?my=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setActiveUserRequest(data.data || null);
        }
        setInterestsRefresh((n) => n + 1); // reload "My interests" alongside
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetch("/api/states")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStates(data.data || []);
      })
      .catch(() => {});

    fetchRoommatesData();
  }, [userId]);

  const fetchAccommodationData = () => {
    fetch("/api/accommodation")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const apiLodges: Lodge[] = data.data.map((item: any) => ({
            id: item.id,
            name: item.title,
            price: item.price,
            location: item.location,
            lga: item.lga,
            split: item.splitInfo || "",
            image: item.images?.[0] || "",
            contactPhone: item.contactPhone ?? null,
          }));
          setLodges(apiLodges);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchAccommodationData();
  }, []);



  const filteredLodges = lodges.filter(lodge => {
    return lgaFilter === "all" || lodge.lga.toLowerCase() === lgaFilter.toLowerCase();
  });

  const lodgeLgas = [...new Set(lodges.map((l) => l.lga))].sort();

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
          className="px-4 sm:px-6 py-3 sm:py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          title="List Lodge / Post Profile"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">List Lodge / Post Profile</span>
          <span className="sm:hidden">Post Listing</span>
        </button>
      </div>

      {/* Mode Switcher Tabs & Filters */}
      <div className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("lodges")}
              className={`px-4 sm:px-5 py-2.5 text-xs font-semibold transition-all cursor-pointer border ${
                activeTab === "lodges"
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-[#eaf5ed] dark:bg-[#0a0f0d] text-slate-700 dark:text-slate-300 border-slate-300/60 dark:border-slate-800"
              }`}
            >
              Corper Lodges & Stays ({filteredLodges.length})
            </button>

            <button
              onClick={() => setActiveTab("roommates")}
              className={`px-4 sm:px-5 py-2.5 text-xs font-semibold transition-all cursor-pointer border ${
                activeTab === "roommates"
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-[#eaf5ed] dark:bg-[#0a0f0d] text-slate-700 dark:text-slate-300 border-slate-300/60 dark:border-slate-800"
              }`}
            >
              Roommate Matcher
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label htmlFor="lgaFilter" className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-display hidden sm:inline">
              LGA:
            </label>
            <select
              id="lgaFilter"
              value={lgaFilter}
              onChange={(e) => setLgaFilter(e.target.value)}
              className="px-3 py-2 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-xs text-[#121815] dark:text-white"
            >
              <option value="all">All LGAs</option>
              {lodgeLgas.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lodges Grid */}
      {activeTab === "lodges" && (
        filteredLodges.length === 0 ? (
          <div className="p-12 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-center space-y-4">
            <Home className="w-8 h-8 text-emerald-700 dark:text-emerald-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#121815] dark:text-white font-display">
                No Corper Lodges Found
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Be the first corper to list a lodge or housing opportunity in this location!
              </p>
            </div>
            <button
              onClick={() => setAddModalOpen(true)}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">List First Lodge</span>
              <span className="sm:hidden">List Lodge</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredLodges.map((lodge) => (
              <div key={lodge.id} className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
                <div className="relative h-48 border border-slate-300/50 dark:border-slate-800 overflow-hidden">
                  {lodge.image ? (
                    <img src={lodge.image} alt={lodge.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#eaf5ed] dark:bg-[#0a0f0d] text-slate-400 dark:text-slate-600">
                      <FiImage className="w-8 h-8" aria-hidden />
                      <span className="text-[10px] font-mono uppercase tracking-widest">No photo</span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-[#121815] text-white text-[10px] font-mono font-bold px-2.5 py-1">
                    {lodge.lga} LGA
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/40 text-amber-700 dark:text-amber-400 text-[10px] font-mono font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Unverified
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#121815] dark:text-white font-display">{lodge.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{lodge.location}</p>
                  <div className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-400 pt-1">{lodge.price}</div>
                  <p className="text-[10px] text-slate-500 italic">
                    ⚠️ Inspect property & verify advertiser before making payments.
                  </p>
                </div>

                {whatsAppLink(lodge.contactPhone) && (
                  <div className="flex items-center gap-3 text-xs">
                    <a
                      href={whatsAppLink(lodge.contactPhone, `Hi, I saw "${lodge.name}" on KopaWee. Is it still available?`)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                    >
                      WhatsApp Host ➔
                    </a>
                    <a href={telLink(lodge.contactPhone)!} className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
                      Call {lodge.contactPhone}
                    </a>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-300/50 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">{lodge.split || "\u00a0"}</span>
                  <button
                    type="button"
                    disabled
                    title="Reporting listings is coming soon"
                    className="text-slate-400 flex items-center gap-1 font-semibold cursor-not-allowed text-xs"
                  >
                    <Flag className="w-3.5 h-3.5" /> Report · soon
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Roommates Grid (Dynamic API Feed & Single Active Constraint) */}
      {activeTab === "roommates" && (
        <div className="space-y-6">
          {/* Active Request Bar / Create Action */}
          <div className="p-4 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="font-bold text-xs tracking-wider text-[#121815] dark:text-white font-display">
                {activeUserRequest ? (activeUserRequest.status === "MATCHED" ? "Roommate request matched" : "Active roommate request") : "Looking for a roommate?"}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {activeUserRequest
                  ? activeUserRequest.status === "MATCHED"
                    ? `Your request in ${activeUserRequest.lga}, ${activeUserRequest.state} is matched and no longer shown to others.`
                    : `Your request in ${activeUserRequest.lga}, ${activeUserRequest.state} is visible to other corpers.`
                  : "Post your budget & preferred location to match with corpers."}
              </p>
            </div>

            {activeUserRequest ? (
              <div className="flex items-center gap-2">
                {activeUserRequest.status !== "MATCHED" && (
                <button
                  onClick={() => {
                    setEditingRequest(activeUserRequest);
                    setRoommateModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit request</span>
                </button>
                )}
                <button
                  onClick={() => setCancelConfirmOpen(true)}
                  className="px-3.5 py-2 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-semibold tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Cancel request</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setEditingRequest(null);
                  setRoommateModalOpen(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Request a roommate</span>
              </button>
            )}
          </div>

          {activeUserRequest && (
            <div className="p-4 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-xs tracking-wider uppercase text-[#121815] dark:text-white font-display">
                Interest in your request
              </h4>
              <IncomingInterests
                interests={activeUserRequest.interests ?? []}
                context={`${activeUserRequest.lga}, ${activeUserRequest.state}`}
                onChanged={fetchRoommatesData}
              />
            </div>
          )}

          <MyInterests refreshKey={interestsRefresh} />

          {roommateRequests.length === 0 ? (
            <div className="p-12 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-center space-y-3">
              <Users className="w-8 h-8 text-emerald-700 dark:text-emerald-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#121815] dark:text-white font-display">
                  No Roommate Requests Yet
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  When corps members around your preferred location request a roommate, you'll see them here.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roommateRequests.map((rm) => (
                <div key={rm.id} className="p-6 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#121815] dark:text-white font-display">
                        {rm.user?.name ?? "Corps member"}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {[rm.user?.ppaName, `${rm.lga}, ${rm.state}`].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-700 text-white text-[10px] font-mono font-bold uppercase">
                      Budget: {rm.budget}
                    </span>
                  </div>

                  <div className="p-3 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <div><strong>Type:</strong> {rm.accommodationType}</div>
                    {rm.preferences && <div><strong>Preferences:</strong> {rm.preferences}</div>}
                  </div>

                  <ExpressInterestButton requestId={rm.id} status={rm.myInterestStatus} onChanged={fetchRoommatesData} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* Post Lodge Modal */}
      {addModalOpen && (
        <PostLodgeModal
          states={states}
          onClose={() => setAddModalOpen(false)}
          onSuccess={() => {
            setAddModalOpen(false);
            fetchAccommodationData();
          }}
        />
      )}

      {/* Request Roommate Modal */}
      {roommateModalOpen && (
        <RequestRoommateModal
          states={states}
          userId={userId}
          initialData={editingRequest}
          onClose={() => { setRoommateModalOpen(false); setEditingRequest(null); }}
          onSuccess={() => {
            setRoommateModalOpen(false);
            setEditingRequest(null);
            fetchRoommatesData();
          }}
        />
      )}

      {/* Custom Cancel Confirmation Modal */}
      {cancelConfirmOpen && activeUserRequest && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 max-w-md w-full p-6 space-y-4 text-[#121815] dark:text-white font-sans">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold font-display">Cancel roommate request?</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to cancel your active roommate request in <strong className="text-emerald-700 dark:text-emerald-400">{activeUserRequest.lga}, {activeUserRequest.state}</strong>? Other corps members will no longer be able to discover or send roommate interest to your profile.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-300/60 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCancelConfirmOpen(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
              >
                Keep request
              </button>
              <button
                type="button"
                disabled={cancellingRequest}
                onClick={async () => {
                  setCancellingRequest(true);
                  try {
                    const res = await fetch(`/api/roommates?id=${activeUserRequest.id}`, { method: "DELETE" });
                    const data = await res.json();
                    if (data.success) {
                      setActiveUserRequest(null);
                      fetchRoommatesData();
                    }
                  } catch (e) {
                    console.error("Failed to cancel roommate request", e);
                  } finally {
                    setCancellingRequest(false);
                    setCancelConfirmOpen(false);
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                {cancellingRequest && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Yes, cancel request</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function PostLodgeModal({
  states,
  onClose,
  onSuccess,
}: {
  states: { id: string; name: string; code: string; lgas?: string[] }[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [rent, setRent] = useState("");
  const [state, setState] = useState("");
  const [availableLgas, setAvailableLgas] = useState<string[]>([]);
  const [lga, setLga] = useState("");
  const [area, setArea] = useState("");
  const [street, setStreet] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [splitInfo, setSplitInfo] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleStateChange = (stateName: string) => {
    setState(stateName);
    setLga("");
    const matched = states.find((s) => s.name === stateName);
    setAvailableLgas(matched && matched.lgas ? matched.lgas : []);
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const files = Array.from(input.files ?? []);
    input.value = "";
    const room = MAX_PHOTOS - photos.length;
    if (files.length > room) setErrorMsg(`Only the first ${room} photo(s) were added (max ${MAX_PHOTOS}).`);
    for (const file of files.slice(0, Math.max(room, 0))) {
      try {
        const dataUrl = await downscaleImage(file);
        setPhotos((prev) => (prev.length < MAX_PHOTOS ? [...prev, dataUrl] : prev));
      } catch {
        setErrorMsg(`${file.name} could not be read. Use a JPEG, PNG or WebP photo.`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state || !lga) {
      setErrorMsg("Please select both State and LGA");
      return;
    }
    if (!title.trim() || !rent.trim() || !contactPhone.trim() || !description.trim()) {
      setErrorMsg("Please fill in all required lodge details");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/accommodation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          price: `₦${Number(rent.replace(/[^0-9]/g, "")).toLocaleString()}/year`,
          state,
          lga,
          location: [street, area, lga, state].filter(Boolean).join(", "),
          contactPhone,
          description,
          splitInfo: splitInfo.trim() || undefined,
          images: photos, // no stock photo: lodges without photos show a placeholder
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setErrorMsg(data.error || "Failed to submit lodge listing");
      }
    } catch (err) {
      setErrorMsg("Network error posting lodge listing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 max-w-lg w-full p-6 space-y-5 animate-fadeIn text-[#121815] dark:text-white">
        <div className="flex items-center justify-between border-b border-slate-300/60 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold font-display uppercase tracking-wider">List Lodge / Accommodation</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:text-red-500 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
              Lodge Title *
            </label>
            <input
              type="text"
              required
              placeholder="Enter lodge title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                Rent (NGN/yr) *
              </label>
              <input
                type="number"
                required
                placeholder="Enter annual rent..."
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                Contact WhatsApp / Phone *
              </label>
              <input
                type="tel"
                required
                placeholder="Enter phone number..."
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none"
              />
            </div>
          </div>

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
                {states.map((s) => (
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

          <div className="space-y-1">
            <label htmlFor="splitInfo" className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
              Sharing / Split (Optional)
            </label>
            <input
              id="splitInfo"
              type="text"
              maxLength={120}
              placeholder="e.g. 2 rooms, looking for 1 corper to split rent"
              value={splitInfo}
              onChange={(e) => setSplitInfo(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="lodgePhotos" className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
              Photos (Optional, up to {MAX_PHOTOS})
            </label>
            <input
              id="lodgePhotos"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={photos.length >= MAX_PHOTOS}
              onChange={handlePhotoChange}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer disabled:opacity-50"
            />
            {photos.length > 0 && (
              <div className="flex items-center gap-3 overflow-x-auto pt-2">
                {photos.map((src, idx) => (
                  <div key={idx} className="relative w-16 h-16 border border-slate-300 dark:border-slate-700 shrink-0">
                    <img src={src} alt={`Lodge photo ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      aria-label={`Remove photo ${idx + 1}`}
                      onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute -top-1 -right-1 bg-red-600 text-white p-0.5 cursor-pointer"
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
              Lodge Description & Amenities *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Water supply, security, proximity to PPA..."
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
              {submitting ? "SUBMITTING LODGE..." : "POST LODGE FOR REVIEW ➔"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RequestRoommateModal({
  states,
  userId,
  initialData,
  onClose,
  onSuccess,
}: {
  states: { id: string; name: string; code: string; lgas?: string[] }[];
  userId: string;
  initialData?: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEditing = !!initialData;
  const [selectedState, setSelectedState] = useState(initialData?.state || "");
  const [availableLgas, setAvailableLgas] = useState<string[]>([]);
  const [lga, setLga] = useState(initialData?.lga || "");
  const [area, setArea] = useState(initialData?.area || "");
  const [street, setStreet] = useState("");
  const [budget, setBudget] = useState(initialData?.budget?.replace(/[^0-9]/g, "") || "");
  const [accommodationType, setAccommodationType] = useState(initialData?.accommodationType || "");
  const [preferences, setPreferences] = useState(initialData?.preferences || "");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    setLga("");
    const matched = states.find((s) => s.name === stateName);
    setAvailableLgas(matched && matched.lgas ? matched.lgas : []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedState || !lga) {
      setErrorMsg("Please select both State and LGA");
      return;
    }
    if (!budget.trim()) {
      setErrorMsg("Please enter your budget");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const budgetFormatted = budget.trim().startsWith("₦")
        ? budget
        : `₦${Number(budget.replace(/[^0-9]/g, "")).toLocaleString()}/yr`;
      const res = await fetch("/api/roommates", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditing ? {
          id: initialData.id,
          state: selectedState,
          lga,
          area: [area, street].filter(Boolean).join(", ") || undefined,
          budget: budgetFormatted,
          accommodationType: accommodationType || "Shared Apartment",
          preferences,
        } : {
          state: selectedState,
          lga,
          area: [area, street].filter(Boolean).join(", "),
          budget: budgetFormatted,
          accommodationType: accommodationType || "Shared Apartment",
          preferences,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setErrorMsg(data.message || data.error || "Failed to post roommate request");
      }
    } catch (err) {
      setErrorMsg("Network error posting request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 max-w-md w-full p-6 space-y-5 animate-fadeIn text-[#121815] dark:text-white">
        <div className="flex items-center justify-between border-b border-slate-300/60 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold font-display uppercase tracking-wider">{isEditing ? "Edit Roommate Request" : "Request a Roommate"}</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:text-red-500 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                Preferred State *
              </label>
              <select
                required
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none"
              >
                <option value="" disabled>Select State...</option>
                {states.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                Preferred LGA *
              </label>
              <select
                required
                disabled={!selectedState}
                value={lga}
                onChange={(e) => setLga(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none disabled:opacity-50"
              >
                <option value="" disabled>{!selectedState ? "Select State First..." : "Select LGA..."}</option>
                {availableLgas.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                Budget (NGN/yr) *
              </label>
              <input
                type="number"
                required
                placeholder="Enter annual budget..."
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
                Accommodation Type *
              </label>
              <select
                required
                value={accommodationType}
                onChange={(e) => setAccommodationType(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#dcece1] dark:bg-[#121a16] border border-slate-300/60 dark:border-slate-800 text-[#121815] dark:text-white focus:outline-none"
              >
                <option value="" disabled>Select Type...</option>
                <option value="Shared Apartment">Shared Apartment</option>
                <option value="Self Contain">Self Contain</option>
                <option value="2-Bedroom Flatshare">2-Bedroom Flatshare</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300 block">
              Roommate Preferences (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Non-smoker, quiet worker, clean, early riser..."
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
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
              {submitting ? (isEditing ? "SAVING..." : "POSTING REQUEST...") : (isEditing ? "SAVE CHANGES ➔" : "POST ROOMMATE REQUEST ➔")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
