"use client";
import { Member } from "@/types";

interface Props { member: Member; }

export default function MemberCard({ member }: Props) {
  const initials = `${member.first_name[0]}${member.last_name[0]}`.toUpperCase();
  const cardUrl = `${process.env.NEXT_PUBLIC_API_URL}/membres/${member.member_number}/carte`;
  const verifyUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/verifier/${member.member_number}`;

  return (
    <div className="w-full max-w-[540px]">
      <div
        className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl shadow-[#0f5132]/15"
        style={{ aspectRatio: "86/52" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f5132] via-[#145a38] to-[#0a3d26]" />
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#d4a843] via-[#f0d078] to-[#d4a843]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.5) 10px, rgba(255,255,255,0.5) 11px)",
        }} />
        <div className="absolute -bottom-10 -right-10 w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-[#d4a843]/[0.08]" />

        <div className="relative h-full flex flex-col justify-between p-4 sm:p-5 md:p-6">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[8px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[#d4a843]">
                AAES · Siguiri
              </p>
              <p className="text-[7px] sm:text-[8px] text-white/25 mt-0.5 tracking-wider truncate">Promotion 2012 · Carte de membre</p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=56x56&data=${encodeURIComponent(verifyUrl)}&color=d4a843&bgcolor=0f5132&format=png`}
              alt="QR"
              className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg opacity-80 flex-shrink-0 ring-1 ring-[#d4a843]/20"
            />
          </div>

          {/* Bottom row */}
          <div className="flex items-end gap-2.5 sm:gap-4">
            {member.photo_url ? (
              <div className="w-10 h-10 sm:w-[50px] sm:h-[50px] md:w-14 md:h-14 rounded-lg sm:rounded-xl overflow-hidden ring-2 ring-[#d4a843]/30 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={member.photo_url} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 sm:w-[50px] sm:h-[50px] md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-[#d4a843]/10 ring-2 ring-[#d4a843]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm sm:text-lg font-bold text-[#d4a843]">{initials}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-display text-white text-[0.9375rem] sm:text-[1.0625rem] md:text-[1.125rem] leading-tight truncate">
                {member.first_name} {member.last_name}
              </p>
              {member.filiere && (
                <p className="text-white/30 text-[9px] sm:text-[10px] mt-0.5 truncate">{member.filiere}</p>
              )}
              <div className="flex items-center gap-1.5 sm:gap-2.5 mt-1.5 sm:mt-2 flex-wrap">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#d4a843] tracking-wider">
                  {member.member_number}
                </span>
                <span className="w-px h-3 bg-white/15 hidden sm:block" />
                <span className={`inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-semibold ${
                  member.status === "actif" ? "text-emerald-300" : "text-amber-300"
                }`}>
                  <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                    member.status === "actif" ? "bg-emerald-400" : "bg-amber-400"
                  }`} />
                  {member.status === "actif" ? "Actif" : "En attente"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download link */}
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
