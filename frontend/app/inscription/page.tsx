"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";
import { AuthResponse } from "@/types";
import { Eye, EyeOff, Loader2, ArrowLeft, ArrowRight, CheckCircle2, Upload } from "lucide-react";

const OPTIONS = [
  "Sciences mathématiques",
  "Sciences sociales",
  "Sciences expérimentales",
];

const STEP_LABELS = ["Identité", "Localisation", "Sécurité"];

const COUNTRIES: { name: string; dial: string }[] = [
  { name: "Guinée", dial: "+224" },
  { name: "Sénégal", dial: "+221" },
  { name: "Mali", dial: "+223" },
  { name: "Côte d'Ivoire", dial: "+225" },
  { name: "Burkina Faso", dial: "+226" },
  { name: "Niger", dial: "+227" },
  { name: "Bénin", dial: "+229" },
  { name: "Togo", dial: "+228" },
  { name: "Ghana", dial: "+233" },
  { name: "Nigeria", dial: "+234" },
  { name: "Cameroun", dial: "+237" },
  { name: "Gabon", dial: "+241" },
  { name: "Congo", dial: "+242" },
  { name: "RD Congo", dial: "+243" },
  { name: "Guinée-Bissau", dial: "+245" },
  { name: "Guinée équatoriale", dial: "+240" },
  { name: "Sierra Leone", dial: "+232" },
  { name: "Libéria", dial: "+231" },
  { name: "Gambie", dial: "+220" },
  { name: "Mauritanie", dial: "+222" },
  { name: "Cap-Vert", dial: "+238" },
  { name: "Maroc", dial: "+212" },
  { name: "Algérie", dial: "+213" },
  { name: "Tunisie", dial: "+216" },
  { name: "Libye", dial: "+218" },
  { name: "Égypte", dial: "+20" },
  { name: "Soudan", dial: "+249" },
  { name: "Éthiopie", dial: "+251" },
  { name: "Kenya", dial: "+254" },
  { name: "Tanzania", dial: "+255" },
  { name: "Rwanda", dial: "+250" },
  { name: "Ouganda", dial: "+256" },
  { name: "Angola", dial: "+244" },
  { name: "Mozambique", dial: "+258" },
  { name: "Madagascar", dial: "+261" },
  { name: "Afrique du Sud", dial: "+27" },
  { name: "France", dial: "+33" },
  { name: "Belgique", dial: "+32" },
  { name: "Suisse", dial: "+41" },
  { name: "Allemagne", dial: "+49" },
  { name: "Espagne", dial: "+34" },
  { name: "Italie", dial: "+39" },
  { name: "Portugal", dial: "+351" },
  { name: "Royaume-Uni", dial: "+44" },
  { name: "États-Unis", dial: "+1" },
  { name: "Canada", dial: "+1" },
  { name: "Brésil", dial: "+55" },
  { name: "Chine", dial: "+86" },
  { name: "Arabie Saoudite", dial: "+966" },
  { name: "Émirats arabes unis", dial: "+971" },
  { name: "Qatar", dial: "+974" },
  { name: "Turquie", dial: "+90" },
  { name: "Russie", dial: "+7" },
].sort((a, b) => {
  if (a.name === "Guinée") return -1;
  if (b.name === "Guinée") return 1;
  return a.name.localeCompare(b.name, "fr");
});

export default function InscriptionPage() {
  const { login } = useAuth();
  const router = useRouter();
  const photoRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    school: "",
    option: "",
    profession: "",
    current_activity: "",
    country: "",
    city: "",
    phone: "",
    contact_email: "",
    password: "",
    confirm_password: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleCountryChange = (countryName: string) => {
    const country = COUNTRIES.find((c) => c.name === countryName);
    setForm((f) => {
      const currentDial = COUNTRIES.find((c) => f.phone.startsWith(c.dial))?.dial ?? "";
      const phoneWithoutDial = currentDial ? f.phone.slice(currentDial.length).trimStart() : f.phone;
      const newDial = country?.dial ?? "";
      const newPhone = newDial
        ? phoneWithoutDial ? `${newDial} ${phoneWithoutDial}` : newDial
        : phoneWithoutDial;
      return { ...f, country: countryName, phone: newPhone };
    });
  };

  const validateStep1 = () => {
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError("Le prénom et le nom sont requis.");
      return false;
    }
    if (!form.school.trim()) {
      setError("L'école d'origine est requise.");
      return false;
    }
    if (!form.option) {
      setError("Veuillez sélectionner une option.");
      return false;
    }
    if (!form.profession.trim()) {
      setError("La profession est requise.");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep2 = () => {
    if (!form.country.trim()) {
      setError("Le pays de résidence est requis.");
      return false;
    }
    if (!form.city.trim()) {
      setError("La ville de résidence est requise.");
      return false;
    }
    if (!form.phone.trim()) {
      setError("Le numéro de téléphone est requis.");
      return false;
    }
    if (form.contact_email && !/\S+@\S+\.\S+/.test(form.contact_email)) {
      setError("L'adresse email est invalide.");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep3 = () => {
    if (form.password.length < 6) {
      setError("Minimum 6 caractères pour le mot de passe.");
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
    if (!validateStep3()) return;
    setLoading(true);
    try {
      const res = await API.post<AuthResponse>("/auth/inscription", {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        school: form.school.trim(),
        option: form.option,
        profession: form.profession.trim(),
        current_activity: form.current_activity.trim() || undefined,
        country: form.country.trim(),
        city: form.city.trim(),
        phone: form.phone.trim(),
        contact_email: form.contact_email.trim() || undefined,
        password: form.password,
      });

      login(res.data.access_token, res.data.member);

      // Upload photo si sélectionnée
      if (photoFile) {
        const fd = new FormData();
        fd.append("file", photoFile);
        await API.post("/membres/moi/photo", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Upload CV si sélectionné
      if (cvFile) {
        const fd = new FormData();
        fd.append("file", cvFile);
        await API.post("/membres/moi/cv", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string | { msg: string }[] } } };
      const detail = e?.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join(", "));
      } else {
        setError(detail || "Une erreur est survenue. Vérifiez votre connexion.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100svh] flex flex-col lg:flex-row">

      {/* ─ Panneau gauche desktop ─ */}
      <div className="hidden lg:flex w-[42%] bg-gradient-to-br from-[#0f5132] via-[#145a38] to-[#0a3d26] flex-col justify-between p-10 relative overflow-hidden">
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
          <h2 className="font-display text-[2.25rem] text-white leading-[1.15] mb-4">
            Rejoignez votre<br />promotion.
          </h2>
          <p className="text-white/40 text-[15px] leading-relaxed max-w-sm">
            Renseignez vos informations pour obtenir votre carte de membre officielle de la Promotion 2012.
          </p>
        </div>

        {/* Indicateur d'étapes */}
        <div className="relative flex items-center gap-4">
          {STEP_LABELS.map((label, i) => {
            const s = i + 1;
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${
                  step === s ? "bg-[#d4a843] text-[#0f5132]"
                  : step > s ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/30"
                }`}>
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                <span className={`text-[12px] ${step === s ? "text-white font-medium" : "text-white/30"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─ Formulaire ─ */}
      <div className="flex-1 flex items-start justify-center px-4 sm:px-6 py-8 bg-[#fefcf9] min-h-[100svh] lg:min-h-0 overflow-y-auto">
        <div className="w-full max-w-[440px] py-4">

          {/* Retour mobile */}
          <div className="lg:hidden mb-5">
            <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-medium text-[#999] hover:text-[#0f5132] transition-colors btn-touch py-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              Retour
            </Link>
          </div>

          {/* Barre de progression mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-5">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 rounded-full flex-1 transition-colors ${step >= s ? "bg-[#0f5132]" : "bg-[#e8e3db]"}`} />
            ))}
          </div>

          <span className="text-[12px] font-bold tracking-[0.15em] uppercase text-[#d4a843]">
            Étape {step} sur 3 — {STEP_LABELS[step - 1]}
          </span>
          <h1 className="font-display text-[1.5rem] sm:text-[1.75rem] text-[#1a1a2e] mt-2 mb-6">
            {step === 1 && "Votre identité"}
            {step === 2 && "Localisation & contact"}
            {step === 3 && "Sécurité & fichiers"}
          </h1>

          {error && (
            <div className="flex items-start gap-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* ─ Étape 1 : Identité ─ */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FloatField label="Prénom *" value={form.first_name} onChange={(v) => set("first_name", v)} />
                <FloatField label="Nom *" value={form.last_name} onChange={(v) => set("last_name", v)} />
              </div>
              <FloatField label="École d'origine *" value={form.school} onChange={(v) => set("school", v)} />

              {/* Select Option */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#5a5a6e]">Option *</label>
                <select
                  value={form.option}
                  onChange={(e) => set("option", e.target.value)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: "1.5px solid #e8e3db",
                    background: "#fff",
                    fontSize: "14px",
                    color: form.option ? "#1a1a2e" : "#aaa",
                    outline: "none",
                    width: "100%",
                    appearance: "auto",
                  }}
                >
                  <option value="" disabled>Sélectionner une option</option>
                  {OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <FloatField label="Profession *" value={form.profession} onChange={(v) => set("profession", v)} />
              <div className="relative">
                <FloatField label="Activité actuelle (facultatif)" value={form.current_activity} onChange={(v) => set("current_activity", v)} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#bbb] pointer-events-none">optionnel</span>
              </div>

              <button
                onClick={() => validateStep1() && setStep(2)}
                className="w-full text-[14px] font-semibold text-white bg-[#0f5132] py-3.5 rounded-xl hover:bg-[#0d4429] transition-all mt-2 flex items-center justify-center gap-2 group btn-touch"
              >
                Continuer
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}

          {/* ─ Étape 2 : Localisation & Contact ─ */}
          {step === 2 && (
            <div className="space-y-3">
              {/* Select pays */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#5a5a6e]">Pays de résidence *</label>
                <select
                  value={form.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: "1.5px solid #e8e3db",
                    background: "#fff",
                    fontSize: "14px",
                    color: form.country ? "#1a1a2e" : "#aaa",
                    outline: "none",
                    width: "100%",
                    appearance: "auto",
                    minHeight: "var(--touch-min)",
                  }}
                >
                  <option value="" disabled>Sélectionner un pays</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.dial})
                    </option>
                  ))}
                </select>
              </div>

              <FloatField label="Ville de résidence *" value={form.city} onChange={(v) => set("city", v)} />

              {/* Téléphone avec indicatif affiché */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#5a5a6e]">Téléphone *</label>
                <div className="flex gap-2">
                  {form.country && COUNTRIES.find((c) => c.name === form.country) && (
                    <div className="flex items-center px-3 rounded-xl border border-[#e8e3db] bg-[#f8f6f2] text-[13px] font-bold text-[#0f5132] whitespace-nowrap flex-shrink-0">
                      {COUNTRIES.find((c) => c.name === form.country)?.dial}
                    </div>
                  )}
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder={
                      COUNTRIES.find((c) => c.name === form.country)
                        ? `${COUNTRIES.find((c) => c.name === form.country)?.dial} 6XX XX XX XX`
                        : "Numéro de téléphone"
                    }
                    style={{
                      flex: 1,
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: "1.5px solid #e8e3db",
                      background: "#fff",
                      fontSize: "14px",
                      color: "#1a1a2e",
                      outline: "none",
                      minHeight: "var(--touch-min)",
                    }}
                  />
                </div>
              </div>

              <div className="relative">
                <FloatField label="Adresse email (facultatif)" value={form.contact_email} onChange={(v) => set("contact_email", v)} type="email" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#bbb] pointer-events-none">optionnel</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setStep(1); setError(""); }}
                  className="px-4 py-3.5 text-[13px] font-semibold text-[#5a5a6e] bg-white border border-[#e8e3db] rounded-xl hover:bg-[#f8f6f2] transition-colors flex items-center gap-2 btn-touch"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => validateStep2() && setStep(3)}
                  className="flex-1 text-[14px] font-semibold text-white bg-[#0f5132] py-3.5 rounded-xl hover:bg-[#0d4429] transition-all flex items-center justify-center gap-2 group btn-touch"
                >
                  Continuer
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}

          {/* ─ Étape 3 : Sécurité & Fichiers ─ */}
          {step === 3 && (
            <div className="space-y-3">
              {/* Mot de passe */}
              <div className="field-group relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder=" "
                  className="pr-12"
                />
                <label>Mot de passe * (min. 6 car.)</label>
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ccc] hover:text-[#0f5132] transition-colors btn-touch flex items-center justify-center"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <FloatField label="Confirmer le mot de passe *" value={form.confirm_password} onChange={(v) => set("confirm_password", v)} type="password" />

              {/* Photo facultative */}
              <input ref={photoRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} />
              <button
                type="button"
                onClick={() => photoRef.current?.click()}
                className="w-full flex items-center gap-3 bg-white border border-[#e8e3db] rounded-xl px-4 py-3.5 text-left hover:border-[#0f5132]/40 transition-colors btn-touch"
              >
                <div className="w-9 h-9 rounded-lg bg-[#f0f7f2] flex items-center justify-center flex-shrink-0">
                  <Upload className="w-4 h-4 text-[#0f5132]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[#1a1a2e] truncate">
                    {photoFile ? photoFile.name : "Photo de profil"}
                  </p>
                  <p className="text-[11px] text-[#aaa]">JPG, PNG, WebP — facultatif</p>
                </div>
              </button>

              {/* CV facultatif */}
              <input ref={cvRef} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden"
                onChange={(e) => setCvFile(e.target.files?.[0] ?? null)} />
              <button
                type="button"
                onClick={() => cvRef.current?.click()}
                className="w-full flex items-center gap-3 bg-white border border-[#e8e3db] rounded-xl px-4 py-3.5 text-left hover:border-[#0f5132]/40 transition-colors btn-touch"
              >
                <div className="w-9 h-9 rounded-lg bg-[#f0f7f2] flex items-center justify-center flex-shrink-0">
                  <Upload className="w-4 h-4 text-[#0f5132]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[#1a1a2e] truncate">
                    {cvFile ? cvFile.name : "CV"}
                  </p>
                  <p className="text-[11px] text-[#aaa]">PDF, DOC, DOCX — facultatif</p>
                </div>
              </button>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setStep(2); setError(""); }}
                  className="px-4 py-3.5 text-[13px] font-semibold text-[#5a5a6e] bg-white border border-[#e8e3db] rounded-xl hover:bg-[#f8f6f2] transition-colors flex items-center gap-2 btn-touch"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 text-[14px] font-semibold text-white bg-[#0f5132] py-3.5 rounded-xl hover:bg-[#0d4429] transition-all flex items-center justify-center gap-2 disabled:opacity-50 btn-touch"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Création en cours..." : "Créer mon compte"}
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-5 border-t border-[#f0ebe3]">
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
