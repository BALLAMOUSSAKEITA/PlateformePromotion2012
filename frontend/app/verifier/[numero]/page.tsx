"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import API from "@/lib/api";
import { VerifyMemberOut } from "@/types";
import { Loader2, ShieldCheck, XCircle, ArrowLeft } from "lucide-react";

export default function VerifierPage() {
  const { numero } = useParams<{ numero: string }>();
  const [member, setMember] = useState<VerifyMemberOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    API.get(`/membres/${numero}/verifier`)
      .then((res) => setMember(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [numero]);

  return (
    <div className="min-h-[100svh] bg-[#fefcf9] flex items-start sm:items-center justify-center px-4 sm:px-6 py-8 sm:py-16 relative">
      <div className="absolute inset-0 pattern-kente opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[300px] sm:h-[400px] rounded-full bg-[#0f5132]/[0.03] blur-3xl" />

      <div className="relative w-full max-w-[420px]">

        <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-medium text-[#999] hover:text-[#0f5132] transition-colors btn-touch py-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          Accueil
        </Link>

        <div className="mt-6 sm:mt-10">

          {loading && (
            <div className="py-20 sm:py-24 flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 text-[#0f5132] animate-spin" />
              <p className="text-[13px] text-[#999]">Vérification en cours…</p>
            </div>
          )}

          {!loading && notFound && (
            <div className="bg-white rounded-xl sm:rounded-2xl border border-[#f0ebe3] shadow-card p-6 sm:p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 sm:mb-5">
                <XCircle className="w-7 h-7 text-red-500" />
              </div>
              <h1 className="font-display text-[1.25rem] sm:text-[1.5rem] text-[#1a1a2e] mb-2 sm:mb-3">Membre introuvable</h1>
              <p className="text-[14px] sm:text-[15px] text-[#5a5a6e] leading-relaxed">
                Le numéro <span className="font-mono font-semibold text-[#1a1a2e] bg-[#f5f3f0] px-2 py-0.5 rounded text-[13px]">{numero}</span> ne correspond à aucun membre enregistré.
              </p>
            </div>
          )}

          {!loading && member && (
            <div className="bg-white rounded-xl sm:rounded-2xl border border-[#f0ebe3] shadow-card overflow-hidden">
              
              {/* Header vert */}
              <div className="bg-gradient-to-r from-[#0f5132] to-[#1a7a4c] px-5 sm:px-7 py-4 sm:py-5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05]" style={{
                  backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.5) 8px, rgba(255,255,255,0.5) 9px)",
                }} />
                <div className="relative flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4a843]" />
                  </div>
                  <div>
                    <p className="text-[11px] sm:text-[12px] font-bold text-[#d4a843] tracking-wide uppercase">Membre vérifié</p>
                    <p className="text-[10px] sm:text-[11px] text-white/40 mt-0.5">Promotion 2012 · Siguiri</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-7">
                {/* Identité */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  {member.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.photo_url} alt="" className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover ring-2 ring-[#f0ebe3] flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-[#0f5132]/10 to-[#0f5132]/5 flex items-center justify-center ring-2 ring-[#f0ebe3] flex-shrink-0">
                      <span className="text-lg sm:text-xl font-bold text-[#0f5132]">
                        {member.first_name[0]}{member.last_name[0]}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <h1 className="font-display text-[1.125rem] sm:text-[1.375rem] text-[#1a1a2e] leading-tight truncate">
                      {member.first_name} {member.last_name}
                    </h1>
                    <p className="text-[11px] sm:text-[12px] text-[#999] mt-1">Ancien(ne) élève de Siguiri</p>
                  </div>
                </div>

                {/* Détails */}
                <div className="space-y-0 border-t border-[#f5f3f0]">
                  {[
                    { label: "Numéro de membre", value: member.member_number, mono: true },
                    ...(member.school ? [{ label: "École d'origine", value: member.school }] : []),
                    ...(member.profession ? [{ label: "Profession", value: member.profession }] : []),
                    ...(member.city ? [{ label: "Ville", value: member.city }] : []),
                  ].map(({ label, value, mono }) => (
                    <div key={label} className="flex items-center justify-between py-3.5 sm:py-4 border-b border-[#f8f6f2]">
                      <span className="text-[12px] sm:text-[13px] text-[#999] flex-shrink-0">{label}</span>
                      <span className={`text-[12px] sm:text-[13px] font-semibold text-[#1a1a2e] truncate ml-3 max-w-[55%] ${mono ? "font-mono text-[#0f5132]" : ""}`}>{value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-3.5 sm:py-4">
                    <span className="text-[12px] sm:text-[13px] text-[#999]">Statut</span>
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full ${
                      member.status === "actif" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${member.status === "actif" ? "bg-emerald-500 animate-pulse-dot" : "bg-amber-500"}`} />
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 sm:px-7 py-3.5 sm:py-4 bg-[#faf9f6] border-t border-[#f0ebe3]">
                <p className="text-[10px] sm:text-[11px] text-[#bbb] text-center">
                  Association des Anciens Élèves de Siguiri · Promotion 2012
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
