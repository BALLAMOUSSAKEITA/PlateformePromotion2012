"use client";
import { useState } from "react";
import Link from "next/link";
import { X, PenLine, KeyRound, Camera, CreditCard } from "lucide-react";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">

      {/* ── NAVIGATION ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#e8e3db]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0f5132] to-[#1a7a4c] flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white tracking-wide">AAES</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-[#1a1a2e] leading-none">Anciens Élèves</span>
              <span className="text-[9px] font-medium text-[#999] tracking-wider uppercase">Siguiri · 2012</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/connexion" className="text-[13px] font-medium text-[#666] hover:text-[#0f5132] transition-colors px-4 py-2 rounded-lg hover:bg-[#f0f7f2]">
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="text-[13px] font-semibold text-white bg-[#0f5132] px-5 py-2.5 rounded-xl hover:bg-[#0d4429] transition-all hover:shadow-lg hover:shadow-[#0f5132]/20 btn-touch flex items-center"
            >
              Rejoindre
            </Link>
          </div>

          <button
            className={`md:hidden flex flex-col gap-[5px] p-2 btn-touch items-center justify-center ${menuOpen ? "hamburger-active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </nav>

      <div className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 p-2 btn-touch flex items-center justify-center"
          aria-label="Fermer"
        >
          <X className="w-6 h-6 text-[#1a1a2e]" />
        </button>
        <Link href="/" onClick={() => setMenuOpen(false)}>Accueil</Link>
        <Link href="/connexion" onClick={() => setMenuOpen(false)}>Connexion</Link>
        <Link
          href="/inscription"
          onClick={() => setMenuOpen(false)}
          className="!bg-[#0f5132] !text-white !px-8 !py-3 !rounded-xl"
        >
          Rejoindre
        </Link>
      </div>

      {/* ── HERO ── */}
      <section className="relative pt-14 sm:pt-16 min-h-[100svh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0f7f2] via-[#fefcf9] to-[#fdf6e8]" />
        <div className="absolute inset-0 pattern-kente" />
        <div className="absolute top-20 right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-[#0f5132]/[0.04] blur-3xl" />
        <div className="absolute bottom-20 left-[-5%] w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full bg-[#d4a843]/[0.06] blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16 lg:py-0 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            <div className="text-center lg:text-left">
              <h1 className="font-display text-[2rem] sm:text-[2.5rem] lg:text-[clamp(2.5rem,5.5vw,4rem)] text-[#1a1a2e] leading-[1.12] mb-4 sm:mb-6">
                La promotion 2012<br />
                <span className="text-gradient">se retrouve ici.</span>
              </h1>

              <p className="text-[0.9375rem] sm:text-[1.0625rem] text-[#5a5a6e] leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8 sm:mb-10">
                Rejoignez l&apos;Association des Anciens Eleves de Siguiri.
                Obtenez votre carte de membre officielle et reconnectez-vous avec votre communaute.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 sm:gap-4">
                <Link
                  href="/inscription"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 text-[15px] font-semibold text-white bg-[#0f5132] px-7 py-4 rounded-xl hover:bg-[#0d4429] transition-all hover:shadow-xl hover:shadow-[#0f5132]/20 group btn-touch"
                >
                  Creer mon compte
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link href="/connexion" className="text-[14px] font-medium text-[#5a5a6e] hover:text-[#0f5132] transition-colors py-2 btn-touch flex items-center gap-1">
                  J&apos;ai deja un compte
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Apercu carte */}
            <div className="relative mt-4 lg:mt-0">
              <div className="relative">
                <div className="hidden lg:block absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-[#d4a843]/10 rotate-12" />
                <div className="hidden lg:block absolute -bottom-4 -left-4 w-16 h-16 rounded-xl bg-[#0f5132]/10 -rotate-6" />

                <div className="relative rounded-2xl overflow-hidden shadow-xl lg:shadow-2xl shadow-[#0f5132]/10 mx-auto max-w-[400px] lg:max-w-none" style={{ aspectRatio: "86/52" }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0f5132] via-[#145a38] to-[#0a3d26]" />
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#d4a843] via-[#f0d078] to-[#d4a843]" />
                  <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.5) 10px, rgba(255,255,255,0.5) 11px)",
                  }} />
                  <div className="relative h-full flex flex-col justify-between p-5 sm:p-7">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase text-[#d4a843]">AAES · Siguiri</p>
                        <p className="text-[7px] sm:text-[8px] text-white/30 mt-0.5">Promotion 2012 · Carte de membre</p>
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded border border-[#d4a843]/50 grid grid-cols-3 grid-rows-3 gap-px p-0.5">
                          {[...Array(9)].map((_, i) => (
                            <div key={i} className={`rounded-sm ${[0,2,4,6,8].includes(i) ? "bg-[#d4a843]/60" : "bg-white/20"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-bold text-[#d4a843]/80">IK</span>
                      </div>
                      <div>
                        <p className="text-white font-display text-base sm:text-lg">Ibrahim Filifing Keita</p>
                        <p className="text-[9px] sm:text-[10px] font-mono text-[#d4a843] mt-0.5">PR-20120042</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMENT CA MARCHE ── */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-[#f0f7f2] to-[#fefcf9] relative">
        <div className="absolute inset-0 pattern-kente opacity-50" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">

          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block text-[12px] font-bold tracking-[0.2em] uppercase text-[#0f5132] mb-3">Simple et rapide</span>
            <h2 className="font-display text-[1.5rem] sm:text-[clamp(1.75rem,3.5vw,2.5rem)] text-[#1a1a2e]">
              En 4 etapes
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              { n: "01", text: "Renseignez nom, prenom, telephone, ecole, profession et ville", icon: PenLine },
              { n: "02", text: "Choisissez votre mot de passe", icon: KeyRound },
              { n: "03", text: "Ajoutez une photo de profil", icon: Camera },
              { n: "04", text: "Consultez votre carte de membre", icon: CreditCard },
            ].map((step, i) => (
              <div key={i} className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-card-hover group">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-xl sm:text-[2rem] font-bold text-[#0f5132]/10 font-display">{step.n}</span>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#0f5132]/[0.06] flex items-center justify-center group-hover:bg-[#0f5132]/[0.12] transition-colors">
                    <step.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0f5132]" />
                  </div>
                </div>
                <p className="text-[0.8rem] sm:text-[0.9375rem] font-medium text-[#1a1a2e] leading-relaxed">
                  {step.text}
                </p>
                {i < 3 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 w-6 items-center justify-center text-[#d4a843]">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-12 sm:py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0f5132] via-[#145a38] to-[#0a3d26] p-8 sm:p-12 lg:p-16 text-center">
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-[#d4a843]/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d4a843] to-transparent" />

            <div className="relative">
              <h2 className="font-display text-[1.5rem] sm:text-[clamp(1.75rem,3vw,2.5rem)] text-white leading-tight mb-6 sm:mb-8">
                Rejoignez la promotion 2012
              </h2>
              <Link
                href="/inscription"
                className="inline-flex items-center justify-center gap-3 text-[15px] font-semibold text-[#0f5132] bg-white px-8 py-4 rounded-xl hover:bg-[#f5e6c8] transition-all hover:shadow-xl group btn-touch"
              >
                S&apos;inscrire maintenant
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#f0ebe3] py-8 sm:py-10 bg-white pb-safe">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0f5132] to-[#1a7a4c] flex items-center justify-center flex-shrink-0">
                <span className="text-[8px] font-bold text-white tracking-wide">AAES</span>
              </div>
              <span className="text-[13px] font-semibold text-[#1a1a2e]">AAES Siguiri</span>
            </div>
            <p className="text-[11px] sm:text-[12px] text-[#999] text-center">
              Association des Anciens Élèves de Siguiri · Promotion 2012
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
