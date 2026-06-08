"use client";
import { Member } from "@/types";

interface Props { member: Member; }

export default function MemberCard({ member }: Props) {
  const initials = `${member.first_name[0] ?? ""}${member.last_name[0] ?? ""}`.toUpperCase();
  const cardUrl = `${process.env.NEXT_PUBLIC_API_URL}/membres/${member.member_number}/carte`;
  const verifyUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/verifier/${member.member_number}`;
  const joinedDate = new Date(member.created_at).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

  const details = [
    { icon: "📱", label: "Téléphone", value: member.phone },
    { icon: "🏫", label: "École", value: member.school },
    { icon: "💼", label: "Profession", value: member.profession },
    { icon: "📍", label: "Ville", value: member.city },
  ].filter((d) => d.value);

  return (
    <div className="w-full max-w-sm mx-auto select-none">

      {/* ─── CARTE PRINCIPALE ─── */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0a2a15 0%, #0f3d1f 35%, #143d20 65%, #0a2a15 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(212,168,67,0.2)",
        }}
      >
        {/* Reflet haut */}
        <div
          className="absolute top-0 inset-x-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.6), transparent)" }}
        />

        {/* Motif de fond subtil */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4a843' fill-opacity='1'%3E%3Cpath d='M20 0L40 20L20 40L0 20z' /%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Orbe lumineux bas-droite */}
        <div
          className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #d4a843 0%, transparent 70%)" }}
        />

        {/* Bande dorée haut */}
        <div
          className="relative z-10 h-1.5"
          style={{ background: "linear-gradient(90deg, #b8922a, #f0d068, #d4a843, #f5e080, #b8922a)" }}
        />

        {/* Contenu carte */}
        <div className="relative z-10 px-5 pt-4 pb-5 space-y-4">

          {/* ─ En-tête : Logo + Badge + QR ─ */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(212,168,67,0.15)", border: "1px solid rgba(212,168,67,0.3)" }}
                >
                  <span className="text-[8px] font-bold" style={{ color: "#d4a843" }}>A</span>
                </div>
                <span className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: "#d4a843" }}>
                  AAES · Siguiri
                </span>
              </div>
              <p className="text-[9px] tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
                Promotion 2012 · Carte officielle
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span
                className="text-[8px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #d4a843, #c49a35)",
                  color: "#0a2a15",
                }}
              >
                PROMO 2012
              </span>
            </div>
          </div>

          {/* ─ Identité : Photo + Nom + ID ─ */}
          <div className="flex items-center gap-4">
            {/* Photo / Avatar */}
            {member.photo_url ? (
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.4), 0 0 0 2px rgba(212,168,67,0.35)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={member.photo_url} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #d4a843 0%, #c49a35 100%)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.4), 0 0 0 2px rgba(212,168,67,0.35)",
                }}
              >
                <span className="text-2xl font-bold" style={{ color: "#0a2a15" }}>{initials}</span>
              </div>
            )}

            {/* Nom + ID + QR */}
            <div className="flex-1 min-w-0">
              <p
                className="text-xl font-bold uppercase tracking-wide leading-tight"
                style={{ color: "#ffffff", fontFamily: "'DM Serif Display', serif" }}
              >
                {member.first_name}
              </p>
              <p
                className="text-xl font-bold uppercase tracking-wide leading-tight"
                style={{ color: "#ffffff", fontFamily: "'DM Serif Display', serif" }}
              >
                {member.last_name}
              </p>
              <div
                className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg"
                style={{ background: "rgba(212,168,67,0.12)", border: "1px solid rgba(212,168,67,0.2)" }}
              >
                <span className="text-[9px] font-mono font-bold tracking-widest" style={{ color: "#d4a843" }}>
                  {member.member_number}
                </span>
              </div>
            </div>

            {/* QR Code */}
            <div
              className="flex-shrink-0 rounded-xl overflow-hidden p-1"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(212,168,67,0.15)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=72x72&data=${encodeURIComponent(verifyUrl)}&color=d4a843&bgcolor=0a2a15&format=png&margin=2`}
                alt="QR vérification"
                width={56}
                height={56}
                className="rounded-lg"
              />
              <p className="text-center text-[7px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Scanner</p>
            </div>
          </div>

          {/* Séparateur */}
          <div
            className="h-px mx-0"
            style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.3), transparent)" }}
          />

          {/* ─ Informations ─ */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {details.map(({ icon, label, value }) => (
              <div key={label} className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] mb-0.5" style={{ color: "rgba(212,168,67,0.6)" }}>
                  {label}
                </p>
                <p className="text-[12px] font-medium truncate" style={{ color: "rgba(255,255,255,0.88)" }}>
                  {icon} {value}
                </p>
              </div>
            ))}

            {/* Date adhésion */}
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] mb-0.5" style={{ color: "rgba(212,168,67,0.6)" }}>
                Membre depuis
              </p>
              <p className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.88)" }}>
                🗓 {joinedDate}
              </p>
            </div>
          </div>

          {/* ─ Pied : Statut + Label ─ */}
          <div
            className="flex items-center justify-between pt-3 mt-1"
            style={{ borderTop: "1px dashed rgba(212,168,67,0.2)" }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "#4ade80", boxShadow: "0 0 6px rgba(74,222,128,0.6)" }}
              />
              <span className="text-[10px] font-semibold" style={{ color: "#4ade80" }}>
                Membre actif
              </span>
            </div>
            <span
              className="text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{
                color: "rgba(212,168,67,0.8)",
                border: "1px solid rgba(212,168,67,0.2)",
                background: "rgba(212,168,67,0.06)",
              }}
            >
              Carte virtuelle
            </span>
          </div>
        </div>

        {/* Bande dorée bas */}
        <div
          className="relative z-10 h-1.5"
          style={{ background: "linear-gradient(90deg, #b8922a, #f0d068, #d4a843, #f5e080, #b8922a)" }}
        />
      </div>

      {/* ─── BOUTON TÉLÉCHARGEMENT ─── */}
      <a
        href={cardUrl}
        download={`carte-${member.member_number}.png`}
        className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl font-semibold text-sm transition-all active:scale-95"
        style={{
          padding: "14px",
          background: "linear-gradient(135deg, #0f5132, #1a7a4c)",
          color: "#ffffff",
          boxShadow: "0 4px 16px rgba(15,81,50,0.35)",
          minHeight: "48px",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2v9M5 8l3 3 3-3M3 12h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Télécharger ma carte
      </a>

      {/* ─── LIEN VÉRIFICATION ─── */}
      <p className="text-center text-[11px] mt-3 pb-2" style={{ color: "rgba(90,90,110,0.7)" }}>
        Partagez{" "}
        <a href={verifyUrl} className="font-semibold underline" style={{ color: "#0f5132" }}>
          ce lien
        </a>{" "}
        pour permettre la vérification
      </p>
    </div>
  );
}
