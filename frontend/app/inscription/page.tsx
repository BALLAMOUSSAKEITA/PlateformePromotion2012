"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";
import { AuthResponse } from "@/types";
import { Eye, EyeOff, Loader2, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

const FILIERES = [
  "Sciences naturelles",
  "Sciences exactes",
  "Lettres modernes",
  "Sciences sociales",
  "Économie",
  "Informatique",
  "Autre",
];

export default function InscriptionPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    filiere: "",
    password: "",
    confirm_password: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validateStep1 = () => {
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError("Le prénom et le nom sont requis.");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep2 = () => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setError("Adresse email invalide.");
      return false;
    }
    if (form.password.length < 8) {
      setError("Minimum 8 caractères pour le mot de passe.");
      return false;
    }
    if (form.password !== form.confirm_password) {
      setError("Les mots de passe ne correspondent pas.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const res = await API.post<AuthResponse>("/auth/inscription", {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone || undefined,
        filiere: form.filiere || undefined,
        password: form.password,
      });
      login(res.data.access_token, res.data.member);
      router.push("/dashboard");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e?.response?.data?.detail || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100svh] flex flex-col lg:flex-row">

      {/* Panneau gauche - visuel (desktop only) */}
      <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-[#0f5132] via-[#145a38] to-[#0a3d26] flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.5) 10px, rgba(255,255,255,0.5) 11px)",
        }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#d4a843]/10 blur-3xl" />

        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-medium text-white/40 hover:text-white/80 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour à l&apos;accueil
          </Link>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-6">
            <span className="text-[11px] font-semibold text-[#d4a843]">100% Gratuit</span>
          </div>
          <h2 className="font-display text-[2.25rem] text-white leading-[1.15] mb-4">
            Rejoignez votre<br />promotion.
          </h2>
          <p className="text-white/40 text-[15px] leading-relaxed max-w-sm">
            Créez votre compte en 2 minutes et obtenez immédiatement votre carte de membre officielle.
          </p>
        </div>

        <div className="relative flex items-center gap-3">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${
                step === s ? "bg-[#d4a843] text-[#0f5132]" : step > s ? "bg-white/20 text-white" : "bg-white/5 text-white/30"
              }`}>
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              <span className={`text-[12px] ${step === s ? "text-white font-medium" : "text-white/30"}`}>
                {s === 1 ? "Identité" : "Compte"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Formulaire */}
      <div className="flex-1 flex items-start sm:items-center justify-center px-4 sm:px-6 py-8 sm:py-16 bg-[#fefcf9] min-h-[100svh] lg:min-h-0">
        <div className="w-full max-w-[420px]">

          <div className="lg:hidden mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-medium text-[#999] hover:text-[#0f5132] transition-colors btn-touch py-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              Retour
            </Link>
          </div>

          {/* Mobile step indicator */}
          <div className="lg:hidden flex items-center gap-2 mb-5">
            <div className={`h-1.5 rounded-full flex-1 transition-colors ${step >= 1 ? "bg-[#0f5132]" : "bg-[#e8e3db]"}`} />
            <div className={`h-1.5 rounded-full flex-1 transition-colors ${step >= 2 ? "bg-[#0f5132]" : "bg-[#e8e3db]"}`} />
          </div>

          <span className="text-[12px] font-bold tracking-[0.15em] uppercase text-[#d4a843]">
            Étape {step} sur 2
          </span>
          <h1 className="font-display text-[1.5rem] sm:text-[1.75rem] text-[#1a1a2e] mt-2 mb-6 sm:mb-8">
            {step === 1 ? "Qui êtes-vous ?" : "Créez votre compte"}
          </h1>

          {error && (
            <div className="flex items-start gap-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FloatField label="Prénom" value={form.first_name} onChange={(v) => set("first_name", v)} />
                <FloatField label="Nom" value={form.last_name} onChange={(v) => set("last_name", v)} />
              </div>
              <FloatField label="Téléphone (optionnel)" value={form.phone} onChange={(v) => set("phone", v)} type="tel" />
              <div className={`field-group ${form.filiere ? "filled" : ""}`}>
                <select value={form.filiere} onChange={(e) => set("filiere", e.target.value)}>
                  <option value="" disabled> </option>
                  {FILIERES.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
                <label>Filière (optionnel)</label>
              </div>

              <button
                onClick={() => validateStep1() && setStep(2)}
                className="w-full text-[14px] font-semibold text-white bg-[#0f5132] py-3.5 rounded-xl hover:bg-[#0d4429] transition-all hover:shadow-lg hover:shadow-[#0f5132]/20 mt-4 flex items-center justify-center gap-2 group btn-touch"
              >
                Continuer
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 sm:space-y-4">
              <FloatField label="Adresse email" value={form.email} onChange={(v) => set("email", v)} type="email" />
              <div className="field-group relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder=" "
                  className="pr-12"
                />
                <label>Mot de passe (min. 8 car.)</label>
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-[#ccc] hover:text-[#0f5132] transition-colors btn-touch flex items-center justify-center"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <FloatField label="Confirmer le mot de passe" value={form.confirm_password} onChange={(v) => set("confirm_password", v)} type="password" />

              <div className="flex gap-3 pt-2 sm:pt-3">
                <button
                  onClick={() => { setStep(1); setError(""); }}
                  className="px-4 sm:px-5 py-3.5 text-[13px] font-semibold text-[#5a5a6e] bg-white border border-[#e8e3db] rounded-xl hover:bg-[#f8f6f2] transition-colors flex items-center gap-2 btn-touch"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Retour</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 text-[14px] font-semibold text-white bg-[#0f5132] py-3.5 rounded-xl hover:bg-[#0d4429] transition-all hover:shadow-lg hover:shadow-[#0f5132]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-none btn-touch"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Création…" : "Créer mon compte"}
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-[#f0ebe3]">
            <p className="text-center text-[13px] text-[#999]">
              Déjà membre ?{" "}
              <Link href="/connexion" className="text-[#0f5132] font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatField({ label, value, onChange, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div className="field-group">
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder=" " />
      <label>{label}</label>
    </div>
  );
}
