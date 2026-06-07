"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";
import { AuthResponse } from "@/types";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

export default function ConnexionPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ phone: "", password: "" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post<AuthResponse>("/auth/connexion", form);
      login(res.data.access_token, res.data.member);
      router.push("/dashboard");
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { detail?: string } } };
      setError(apiErr?.response?.data?.detail || "Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100svh] bg-[#fefcf9] flex items-start sm:items-center justify-center px-4 sm:px-6 py-8 sm:py-16 relative">
      <div className="absolute inset-0 pattern-kente opacity-30" />
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-[#0f5132]/[0.03] blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-[#d4a843]/[0.05] blur-3xl" />

      <div className="relative w-full max-w-[400px]">

        <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-medium text-[#999] hover:text-[#0f5132] transition-colors btn-touch py-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour à l&apos;accueil
        </Link>

        <div className="mt-6 sm:mt-10 mb-6 sm:mb-8">
          <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0f5132] to-[#1a7a4c] flex items-center justify-center flex-shrink-0">
              <span className="text-[9px] font-bold text-white tracking-wide">AAES</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-[#1a1a2e] leading-none">Anciens Élèves de Siguiri</span>
              <span className="text-[9px] font-medium text-[#999] tracking-wider uppercase">Promotion 2012</span>
            </div>
          </div>
          <h1 className="font-display text-[1.5rem] sm:text-[1.75rem] text-[#1a1a2e] mb-2">Bon retour parmi nous</h1>
          <p className="text-[14px] sm:text-[15px] text-[#5a5a6e]">Connectez-vous à votre espace membre.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#f0ebe3] shadow-card p-5 sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {error && (
              <div className="flex items-start gap-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="field-group">
              <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder=" " required autoComplete="tel" />
              <label>Numéro de téléphone</label>
            </div>

            <div className="field-group relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder=" "
                required
                autoComplete="current-password"
                className="pr-12"
              />
              <label>Mot de passe</label>
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-[#ccc] hover:text-[#0f5132] transition-colors btn-touch flex items-center justify-center"
              >
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-[14px] font-semibold text-white bg-[#0f5132] py-3.5 rounded-xl hover:bg-[#0d4429] transition-all hover:shadow-lg hover:shadow-[#0f5132]/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2 btn-touch"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>

        <div className="mt-6 sm:mt-8 text-center pb-safe">
          <p className="text-[13px] text-[#999]">
            Pas encore membre ?{" "}
            <Link href="/inscription" className="text-[#0f5132] font-semibold hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
