"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "@/lib/api";
import { Member } from "@/types";
import { getDialCode } from "@/lib/countries";
import {
  ShieldCheck, LogOut, Trash2, Loader2,
  Search, RefreshCw, AlertTriangle, Users, X, FileText,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [membres, setMembres] = useState<Member[]>([]);
  const [filtered, setFiltered] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchMembres = useCallback(async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/connexion"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await API.get<Member[]>("/admin/membres", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembres(res.data);
      setFiltered(res.data);
    } catch {
      router.push("/admin/connexion");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchMembres(); }, [fetchMembres]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      membres.filter((m) =>
        m.first_name.toLowerCase().includes(q) ||
        m.last_name.toLowerCase().includes(q) ||
        m.member_number.toLowerCase().includes(q) ||
        (m.phone || "").includes(q) ||
        (m.country || "").toLowerCase().includes(q) ||
        (m.profession || "").toLowerCase().includes(q),
      ),
    );
  }, [search, membres]);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    setDeletingId(id);
    try {
      await API.delete(`/admin/membres/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembres((prev) => prev.filter((m) => m.id !== id));
    } catch {
      setError("Erreur lors de la suppression.");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_member");
    router.push("/admin/connexion");
  };

  if (loading) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center bg-[#fefcf9]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-[#0f5132] animate-spin" />
          <p className="text-[13px] text-[#999]">Chargement...</p>
        </div>
      </div>
    );
  }

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

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[#f0f7f2] rounded-lg px-3 py-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0f5132]" />
              <span className="text-[12px] font-medium text-[#0f5132]">Administrateur</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-[13px] text-[#999] hover:text-red-600 transition-colors btn-touch py-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">

        {/* Titre */}
        <div className="mb-6 sm:mb-8">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#d4a843] mb-0.5">Gestion</p>
          <h1 className="font-display text-[1.5rem] sm:text-[1.75rem] text-[#1a1a2e]">Membres inscrits</h1>
        </div>

        {error && (
          <div className="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Stats + actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
          <div className="flex items-center gap-2 bg-white border border-[#f0ebe3] shadow-card rounded-xl px-4 py-2.5">
            <Users className="w-4 h-4 text-[#0f5132]" />
            <span className="text-[14px] font-bold text-[#1a1a2e]">{membres.length}</span>
            <span className="text-[13px] text-[#999]">membre{membres.length !== 1 ? "s" : ""}</span>
          </div>
          <button
            onClick={fetchMembres}
            className="inline-flex items-center gap-2 text-[13px] font-medium text-[#666] hover:text-[#0f5132] transition-colors btn-touch py-2 px-3"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Actualiser
          </button>
        </div>

        {/* Recherche */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ccc]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, numéro, téléphone, pays..."
            className="w-full bg-white border border-[#e8e3db] rounded-xl pl-11 pr-4 py-3 text-[14px] text-[#1a1a2e] placeholder:text-[#ccc] outline-none focus:border-[#0f5132] focus:shadow-[0_0_0_3px_rgba(15,81,50,0.08)] transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ccc] hover:text-[#999] transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tableau */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#bbb] text-[14px] bg-white rounded-2xl border border-[#f0ebe3]">
            {search ? "Aucun résultat pour cette recherche." : "Aucun membre inscrit."}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#f0ebe3] shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f5f3f0]">
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-[#bbb] uppercase tracking-wider">Numéro</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-[#bbb] uppercase tracking-wider">Nom complet</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-[#bbb] uppercase tracking-wider hidden md:table-cell">Téléphone</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-[#bbb] uppercase tracking-wider hidden lg:table-cell">Pays / Ville</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-[#bbb] uppercase tracking-wider hidden lg:table-cell">Profession</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-[#bbb] uppercase tracking-wider">Statut</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-[#bbb] uppercase tracking-wider hidden sm:table-cell">Inscription</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-[#bbb] uppercase tracking-wider">CV</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f8f6f2]">
                  {filtered.map((m) => (
                    <tr key={m.id} className="hover:bg-[#fafaf8] transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-[11px] font-bold text-[#0f5132] bg-[#f0f7f2] px-2 py-1 rounded-md">
                          {m.member_number}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-[#1a1a2e] text-[13px]">
                          {m.first_name} {m.last_name}
                        </div>
                        {m.contact_email && (
                          <div className="text-[11px] text-[#aaa] mt-0.5">{m.contact_email}</div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-[#666] hidden md:table-cell">
                        {getDialCode(m.country) && (
                          <span className="text-[11px] font-bold text-[#0f5132] mr-1">{getDialCode(m.country)}</span>
                        )}
                        {m.phone}
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className="text-[13px] text-[#666]">{m.country}</span>
                        {m.city && <span className="text-[12px] text-[#bbb]">, {m.city}</span>}
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-[#666] hidden lg:table-cell max-w-[160px] truncate">{m.profession}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
                          m.status === "actif"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-[#f5f3f0] text-[#999]"
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[12px] text-[#bbb] hidden sm:table-cell whitespace-nowrap">
                        {new Date(m.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3.5">
                        {m.cv_url ? (
                          <a
                            href={m.cv_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0f5132] bg-[#f0f7f2] hover:bg-[#d8edd8] border border-[#c8e6c8] px-2.5 py-1.5 rounded-lg transition-colors btn-touch"
                            title="Télécharger le CV"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            CV
                          </a>
                        ) : (
                          <span className="text-[11px] text-[#ddd]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {confirmId === m.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(m.id)}
                              disabled={deletingId === m.id}
                              className="text-[11px] font-semibold text-red-600 hover:text-red-700 transition-colors px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 border border-red-100 flex items-center gap-1 btn-touch"
                            >
                              {deletingId === m.id
                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                : "Confirmer"}
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="text-[11px] text-[#999] hover:text-[#666] transition-colors px-2 py-1 btn-touch"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmId(m.id)}
                            className="text-[#ddd] hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 btn-touch flex items-center justify-center"
                            title="Supprimer ce membre"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
