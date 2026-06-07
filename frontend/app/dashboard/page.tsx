"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MemberCard from "@/components/MemberCard";
import API from "@/lib/api";
import { Loader2, Upload, ExternalLink, LogOut, User, Menu, X } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { member, logout, loading } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [currentMember, setCurrentMember] = useState(member);
  const [uploadMsg, setUploadMsg] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    if (!loading && !member) router.push("/connexion");
    else setCurrentMember(member);
  }, [loading, member, router]);

  if (loading || !currentMember) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center bg-[#fefcf9]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-[#0f5132] animate-spin" />
          <p className="text-[13px] text-[#999]">Chargement…</p>
        </div>
      </div>
    );
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await API.post("/membres/moi/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCurrentMember((m) => m ? { ...m, photo_url: res.data.photo_url } : m);
      setUploadMsg("Photo mise à jour !");
    } catch {
      setUploadMsg("Erreur lors de l'envoi.");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-[100svh] bg-[#fefcf9]">

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-[#f0ebe3] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0f5132] to-[#1a7a4c] flex items-center justify-center flex-shrink-0">
              <span className="text-[7px] font-bold text-white tracking-wide">AAES</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-[#1a1a2e] leading-none">Anciens Élèves</span>
              <span className="text-[9px] font-medium text-[#999] tracking-wider uppercase">Siguiri · 2012</span>
            </div>
          </Link>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#f0f7f2] rounded-lg px-3 py-1.5">
              <User className="w-3.5 h-3.5 text-[#0f5132]" />
              <span className="text-[12px] font-medium text-[#0f5132]">{currentMember.first_name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-[13px] text-[#999] hover:text-red-600 transition-colors btn-touch py-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Déconnexion
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden btn-touch flex items-center justify-center p-2"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Menu"
          >
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenu && (
          <div className="sm:hidden border-t border-[#f0ebe3] bg-white px-4 py-3 space-y-2 animate-fade-in-up">
            <div className="flex items-center gap-2 bg-[#f0f7f2] rounded-lg px-3 py-2.5">
              <User className="w-4 h-4 text-[#0f5132]" />
              <span className="text-[13px] font-medium text-[#0f5132]">{currentMember.first_name} {currentMember.last_name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-[13px] text-red-600 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors btn-touch"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </button>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-14">

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-[#0f5132] to-[#1a7a4c] rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 mb-6 sm:mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-[#d4a843]/10 blur-3xl" />
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#d4a843]/50 to-transparent" />
          <div className="relative">
            <p className="text-[11px] sm:text-[12px] font-medium text-[#d4a843] mb-1">Mon espace membre</p>
            <h1 className="font-display text-[1.25rem] sm:text-[1.5rem] lg:text-[1.75rem] text-white leading-tight">
              Bienvenue, {currentMember.first_name}
            </h1>
            <p className="text-white/40 text-[13px] sm:text-[14px] mt-1.5 sm:mt-2">Gérez votre profil et votre carte</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-8 lg:gap-10">

          {/* Carte */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-1.5 h-5 rounded-full bg-[#0f5132]" />
              <h2 className="text-[13px] font-bold tracking-[0.1em] uppercase text-[#1a1a2e]">Ma carte</h2>
            </div>
            <MemberCard member={currentMember} />
          </div>

          {/* Infos latérales */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">

            {/* Profil */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-5 rounded-full bg-[#d4a843]" />
                <h2 className="text-[13px] font-bold tracking-[0.1em] uppercase text-[#1a1a2e]">Profil</h2>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl border border-[#f0ebe3] shadow-card overflow-hidden">
                {[
                  { label: "Numéro", value: currentMember.member_number, mono: true },
                  { label: "Téléphone", value: currentMember.phone },
                  ...(currentMember.school ? [{ label: "École d'origine", value: currentMember.school }] : []),
                  ...(currentMember.profession ? [{ label: "Profession", value: currentMember.profession }] : []),
                  ...(currentMember.city ? [{ label: "Ville", value: currentMember.city }] : []),
                  { label: "Statut", value: currentMember.status === "actif" ? "Actif" : "En attente", status: true },
                ].map(({ label, value, mono, status }) => (
                  <div key={label} className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 border-b border-[#f8f6f2] last:border-0">
                    <span className="text-[12px] text-[#999] flex-shrink-0">{label}</span>
                    {status ? (
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        value === "Actif" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${value === "Actif" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {value}
                      </span>
                    ) : (
                      <span className={`text-[12px] sm:text-[13px] font-semibold text-[#1a1a2e] text-right truncate ml-3 max-w-[55%] sm:max-w-[180px] ${mono ? "font-mono text-[11px] sm:text-[12px] text-[#0f5132]" : ""}`}>
                        {value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Upload photo */}
            <div>
              <input type="file" ref={fileRef} onChange={handlePhotoUpload} accept="image/jpeg,image/png,image/webp" className="hidden" />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full bg-white rounded-xl sm:rounded-2xl border border-[#f0ebe3] shadow-card p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:border-[#0f5132]/30 transition-all disabled:opacity-50 text-left group btn-touch"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#0f5132]/10 to-[#0f5132]/5 flex items-center justify-center flex-shrink-0 group-hover:from-[#0f5132]/20 group-hover:to-[#0f5132]/10 transition-colors">
                  {uploading ? <Loader2 className="w-4 h-4 text-[#0f5132] animate-spin" /> : <Upload className="w-4 h-4 text-[#0f5132]" />}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[#1a1a2e]">
                    {currentMember.photo_url ? "Changer la photo" : "Ajouter une photo"}
                  </p>
                  <p className="text-[11px] text-[#999] mt-0.5 truncate">Apparaîtra sur votre carte de membre</p>
                </div>
              </button>
              {uploadMsg && (
                <p className={`text-[11px] mt-2 px-2 font-medium ${uploadMsg.includes("Erreur") ? "text-red-600" : "text-emerald-600"}`}>
                  {uploadMsg}
                </p>
              )}
            </div>

            {/* Lien vérification */}
            <a
              href={`/verifier/${currentMember.member_number}`}
              className="block bg-white rounded-xl sm:rounded-2xl border border-[#f0ebe3] shadow-card p-4 sm:p-5 hover:border-[#0f5132]/30 transition-all group btn-touch"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-[#999] mb-0.5 sm:mb-1">Page publique</p>
                  <p className="text-[13px] sm:text-[14px] font-bold text-[#1a1a2e] group-hover:text-[#0f5132] transition-colors">
                    Voir ma vérification
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-[#ccc] group-hover:text-[#0f5132] transition-colors flex-shrink-0" />
              </div>
            </a>

          </div>
        </div>
      </main>
    </div>
  );
}
