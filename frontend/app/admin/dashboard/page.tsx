"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { Member } from "@/types";
import {
  ShieldCheck, LogOut, Trash2, Loader2, Users,
  Search, RefreshCw, AlertTriangle,
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
      setError("Session expirée ou accès refusé.");
      router.push("/admin/connexion");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchMembres(); }, [fetchMembres]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      membres.filter(
        (m) =>
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

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#12121f] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#d4a843]/10 border border-[#d4a843]/20 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[#d4a843]" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Administration</p>
            <p className="text-[11px] text-white/30 mt-0.5">Filifing – Promotion 2012</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
        >
          <LogOut className="w-3.5 h-3.5" />
          Déconnexion
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <Users className="w-4 h-4 text-[#d4a843]" />
            <span className="text-sm font-semibold">{membres.length}</span>
            <span className="text-xs text-white/40">membre{membres.length !== 1 ? "s" : ""}</span>
          </div>
          <button
            onClick={fetchMembres}
            disabled={loading}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Barre de recherche */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, numéro, téléphone, pays..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#d4a843]/40 transition-colors"
          />
        </div>

        {/* Tableau */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-white/30">
            <Loader2 className="w-6 h-6 animate-spin mr-3" />
            Chargement...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/30 text-sm">
            {search ? "Aucun résultat pour cette recherche." : "Aucun membre inscrit."}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/8">
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Numéro</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Nom complet</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Téléphone</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider hidden lg:table-cell">Pays / Ville</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider hidden lg:table-cell">Profession</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Statut</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider hidden sm:table-cell">Inscription</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[11px] text-[#d4a843]/80 bg-[#d4a843]/8 px-2 py-1 rounded-md">
                        {m.member_number}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white/90">
                        {m.first_name} {m.last_name}
                      </div>
                      {m.contact_email && (
                        <div className="text-[11px] text-white/30 mt-0.5">{m.contact_email}</div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-white/50 hidden md:table-cell">{m.phone}</td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-white/60">{m.country}</span>
                      {m.city && <span className="text-white/30">, {m.city}</span>}
                    </td>
                    <td className="px-4 py-3.5 text-white/50 hidden lg:table-cell max-w-[160px] truncate">{m.profession}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
                        m.status === "actif"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-white/5 text-white/30"
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[11px] text-white/30 hidden sm:table-cell whitespace-nowrap">
                      {new Date(m.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3.5">
                      {confirmId === m.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(m.id)}
                            disabled={deletingId === m.id}
                            className="text-[11px] font-semibold text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center gap-1"
                          >
                            {deletingId === m.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              "Confirmer"
                            )}
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="text-[11px] text-white/30 hover:text-white/60 transition-colors px-2 py-1"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(m.id)}
                          className="text-white/20 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
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
        )}
      </main>
    </div>
  );
}
