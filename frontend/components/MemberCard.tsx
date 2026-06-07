"use client";
import { Member } from "@/types";

interface Props { member: Member; }

export default function MemberCard({ member }: Props) {
  const initials = `${member.first_name[0]}${member.last_name[0]}`.toUpperCase();
  const cardUrl = `${process.env.NEXT_PUBLIC_API_URL}/membres/${member.member_number}/carte`;
  const verifyUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/verifier/${member.member_number}`;
  const joinedDate = new Date(member.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full max-w-[540px]">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl shadow-[#0f5132]/25 border border-[#d4a843]/20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2e1a] via-[#145a38] to-[#0a3d26]" />
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#d4a843] via-[#f0d078] to-[#d4a843]" />
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.5) 10px, rgba(255,255,255,0.5) 11px)",
        }} />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-[#d4a843]/10 blur-2xl" />

        <div className="relative p-4 sm:p-5 md:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase text-[#d4a843]">
                AAES · Siguiri
              </p>
              <p className="text-[8px] sm:text-[9px] text-white/30 mt-0.5">Promotion 2012 · Carte officielle</p>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-wide uppercase bg-[#d4a843] text-[#0f2e1a] px-2.5 py-1 rounded-full">
              Promo 2012
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {member.photo_url ? (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden ring-2 ring-[#d4a843]/40 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={member.photo_url} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-[#d4a843] to-[#c49a35] flex items-center justify-center ring-2 ring-[#d4a843]/30 flex-shrink-0 shadow-lg">
                <span className="text-lg sm:text-xl font-bold text-[#0f2e1a]">{initials}</span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-display text-white text-base sm:text-lg uppercase tracking-wide truncate">
                {member.first_name} {member.last_name}
              </p>
              <p className="text-[10px] sm:text-[11px] font-mono font-bold text-[#d4a843] mt-1 tracking-wider">
                {member.member_number}
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${encodeURIComponent(verifyUrl)}&color=d4a843&bgcolor=0f5132&format=png`}
              alt="QR"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg opacity-90 flex-shrink-0 ring-1 ring-[#d4a843]/25 hidden sm:block"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white/[0.06] border border-[#d4a843]/15 rounded-xl p-3 sm:p-4">
            {[
              { label: "Téléphone", value: member.phone },
              { label: "École", value: member.school },
              { label: "Profession", value: member.profession },
              { label: "Ville", value: member.city },
            ].filter((item) => item.value).map(({ label, value }) => (
              <div key={label} className="min-w-0">
                <p className="text-[9px] uppercase tracking-wide text-white/40 mb-0.5">{label}</p>
                <p className="text-[11px] sm:text-[12px] text-white/90 truncate">{value}</p>
              </div>
            ))}
            <div className="sm:col-span-2 min-w-0">
              <p className="text-[9px] uppercase tracking-wide text-white/40 mb-0.5">Membre depuis</p>
              <p className="text-[11px] sm:text-[12px] text-white/90">{joinedDate}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#d4a843]/20">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Membre actif
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wide text-[#d4a843] bg-[#d4a843]/10 px-2.5 py-1 rounded-full border border-[#d4a843]/20">
              Carte virtuelle officielle
            </span>
          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-[#d4a843] via-[#f0d078] to-[#d4a843]" />
      </div>

      <div className="flex justify-center sm:justify-end mt-3 sm:pr-1">
        <a
          href={cardUrl}
          download={`carte-${member.member_number}.png`}
          className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium text-[#0f5132] hover:text-[#0d4429] transition-colors group btn-touch py-2"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-y-0.5">
            <path d="M8 2v9M5 8l3 3 3-3M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Télécharger en PNG
        </a>
      </div>
    </div>
  );
}
