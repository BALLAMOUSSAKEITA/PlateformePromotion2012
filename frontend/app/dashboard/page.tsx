"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MemberCard from "@/components/MemberCard";
import API from "@/lib/api";
import { Loader2, Upload, ExternalLink, LogOut, User, Menu, X, CreditCard } from "lucide-react";
import Link from "next/link";

const CARD_DURATION = 30;

export default function DashboardPage() {
  const { member, logout, loading } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [uploading, setUploading] = useState(false);
  const [currentMember, setCurrentMember] = useState(member);
  const [uploadMsg, setUploadMsg] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  // Carte : visible / countdown
  const [showCard, setShowCard] = useState(false);
  const [countdown, setCountdown] = useState(CARD_DURATION);

  useEffect(() => {
    if (!loading && !member) router.push("/connexion");
    else setCurrentMember(member);
  }, [loading, member, router]);

  const closeCard = useCallback(() => {
    setShowCard(false);
    setCountdown(CARD_DURATION);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const openCard = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(CARD_DURATION);
    setShowCard(true);

    let remaining = CARD_DURATION;
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        setShowCard(false);
        setCountdown(CARD_DURATION);
      }
    }, 1000);
  }, []);

  // Nettoyage à la destruction
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  if (loading || !currentMember) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center bg-[#fefcf9]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-[#0f5132] animate-spin" />
          <p className="text-[13px] text-[#999]">Chargement...</p>
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
      setUploadMsg("Photo mise a jour !");
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

  const progressPercent = (countdown / CARD_DURATION) * 100;

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
              <span className="text-[13px] font-bold text-[#1a1a2e] leading-none">Anciens Eleves</span>
              <span className="text-[9px] font-medium text-[#999] tracking-wider uppercase">Siguiri · 2012</span>
            </div>
          </Link>

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
              Deconnexion
            </button>
          </div>

          <button
            className="sm:hidden btn-touch flex items-center justify-center p-2"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Menu"
          >
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

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
              Se deconnecter
            </button>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-8 lg:py-12">

        {/* Bienvenue */}
        <div className="flex items-center justify-between mb-5 sm:mb-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#d4a843] mb-0.5">Mon espace</p>
            <h1 className="font-display text-[1.5rem] sm:text-[1.75rem] text-[#1a1a2e] leading-tight">
              Bonjour, {currentMember.first_name}
            </h1>
          </div>
          <span className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-700 text-[12px] font-semibold px-3 py-1.5 rounded-full border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
            Actif
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-8 lg:gap-10">

          {/* Colonne carte */}
          <div className="lg:col-span-3">

            {!showCard ? (
              /* Bouton Voir ma carte */
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, #0a2a15, #0f3d1f)",
                  border: "1px solid rgba(212,168,67,0.2)",
                }}
              >
                <div
                  className="h-1"
                  style={{ background: "linear-gradient(90deg, #b8922a, #f0d068, #d4a843, #f5e080, #b8922a)" }}
                />
                <div className="px-6 py-10 flex flex-col items-center text-center gap-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(212,168,67,0.12)", border: "1px solid rgba(212,168,67,0.25)" }}
                  >
                    <CreditCard className="w-7 h-7" style={{ color: "#d4a843" }} />
                  </div>
                  <div>
                    <p className="font-display text-lg text-white mb-1">Carte de membre</p>
                    <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                      La carte s&apos;affiche pendant 30 secondes
                    </p>
                  </div>
                  <button
                    onClick={openCard}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[14px] transition-all active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, #d4a843, #c49a35)",
                      color: "#0a2a15",
                      boxShadow: "0 4px 16px rgba(212,168,67,0.3)",
                    }}
                  >
                    <CreditCard className="w-4 h-4" />
                    Voir ma carte
                  </button>
                </div>
                <div
                  className="h-1"
                  style={{ background: "linear-gradient(90deg, #b8922a, #f0d068, #d4a843, #f5e080, #b8922a)" }}
                />
              </div>
            ) : (
              /* Carte visible avec compteur */
              <div className="space-y-3">
                {/* Barre de progression + bouton fermer */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-[#e8e3db] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-linear"
                      style={{
                        width: `${progressPercent}%`,
                        background: progressPercent > 40
                          ? "linear-gradient(90deg, #0f5132, #1a7a4c)"
                          : progressPercent > 15
                          ? "#d4a843"
                          : "#ef4444",
                      }}
                    />
                  </div>
                  <span
                    className="text-[12px] font-mono font-bold flex-shrink-0"
                    style={{ color: countdown <= 10 ? "#ef4444" : "#6b7280" }}
                  >
                    {countdown}s
                  </span>
                  <button
                    onClick={closeCard}
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:bg-[#f0ebe3]"
                    aria-label="Fermer la carte"
                  >
                    <X className="w-4 h-4 text-[#999]" />
                  </button>
                </div>

                <MemberCard member={currentMember} />
              </div>
            )}
          </div>

          {/* Panneau actions */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">

            {/* Numero en evidence */}
            <div
              className="rounded-2xl p-4 sm:p-5"
              style={{ background: "linear-gradient(135deg, #0f3d1f, #143d20)", border: "1px solid rgba(212,168,67,0.2)" }}
            >
              <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "rgba(212,168,67,0.7)" }}>
                Numero de membre
              </p>
              <p className="text-xl font-mono font-bold" style={{ color: "#d4a843" }}>
                {currentMember.member_number}
              </p>
              <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                Promotion 2012 · AAES Siguiri
              </p>
            </div>

            {/* Upload photo */}
            <div>
              <input
                type="file"
                ref={fileRef}
                onChange={handlePhotoUpload}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full bg-white rounded-2xl border border-[#f0ebe3] shadow-card p-4 sm:p-5 flex items-center gap-3 hover:border-[#0f5132]/30 transition-all disabled:opacity-50 text-left group btn-touch"
              >
                <div className="w-11 h-11 rounded-xl bg-[#f0f7f2] flex items-center justify-center flex-shrink-0 group-hover:bg-[#d8edd8] transition-colors">
                  {uploading
                    ? <Loader2 className="w-5 h-5 text-[#0f5132] animate-spin" />
                    : <Upload className="w-5 h-5 text-[#0f5132]" />
                  }
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[#1a1a2e]">
                    {currentMember.photo_url ? "Changer la photo" : "Ajouter une photo"}
                  </p>
                  <p className="text-[11px] text-[#aaa] mt-0.5">Apparait sur votre carte</p>
                </div>
              </button>
              {uploadMsg && (
                <p className={`text-[11px] mt-2 px-1 font-medium ${uploadMsg.includes("Erreur") ? "text-red-600" : "text-emerald-600"}`}>
                  {uploadMsg}
                </p>
              )}
            </div>

            {/* Informations profil */}
            <div className="bg-white rounded-2xl border border-[#f0ebe3] shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-[#f5f3f0]">
                <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#bbb]">Informations</p>
              </div>
              {[
                { label: "Telephone", value: currentMember.phone },
                ...(currentMember.school ? [{ label: "Ecole", value: currentMember.school }] : []),
                ...(currentMember.profession ? [{ label: "Profession", value: currentMember.profession }] : []),
                ...(currentMember.city ? [{ label: "Ville", value: currentMember.city }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 py-3 border-b border-[#f8f6f2] last:border-0">
                  <span className="text-[12px] text-[#aaa] flex-shrink-0 w-20">{label}</span>
                  <span className="text-[12px] font-semibold text-[#1a1a2e] text-right truncate ml-2">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Lien verification */}
            <a
              href={`/verifier/${currentMember.member_number}`}
              className="flex items-center justify-between bg-white rounded-2xl border border-[#f0ebe3] shadow-card p-4 sm:p-5 hover:border-[#0f5132]/30 transition-all group btn-touch"
            >
              <div>
                <p className="text-[11px] text-[#bbb] mb-0.5">Lien public</p>
                <p className="text-[13px] font-bold text-[#1a1a2e] group-hover:text-[#0f5132] transition-colors">
                  Page de verification
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-[#ddd] group-hover:text-[#0f5132] transition-colors flex-shrink-0" />
            </a>

          </div>
        </div>
      </main>
    </div>
  );
}
