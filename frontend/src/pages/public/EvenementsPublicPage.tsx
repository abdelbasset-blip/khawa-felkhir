import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Calendar,
  Sparkles,
  Clock,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Seo } from "../../components/public/Seo";
import { EvenementCard } from "../../components/public/EvenementCard";
import { usePublicLayout } from "../../layouts/PublicLayout";
import { getPublicEvenements } from "../../services/public.api";
import { TYPES_EVENEMENT, TYPE_EVENEMENT_META } from "../../lib/evenement-meta";
import type { PublicEvenement, Periode } from "../../types/public";
import type { TypeEvenement } from "../../types/evenement";

export const EvenementsPublicPage: React.FC = () => {
  const { openDonation } = usePublicLayout();
  const [searchParams, setSearchParams] = useSearchParams();

  // Onglet courant : a_venir | en_cours | passes
  const activePeriode = (searchParams.get("periode") as Periode) || "a_venir";

  const [items, setItems] = useState<PublicEvenement[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filtres
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedType, setSelectedType] = useState<TypeEvenement | "all">(
    (searchParams.get("type") as TypeEvenement) || "all"
  );

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getPublicEvenements({
        periode: activePeriode,
        type: selectedType !== "all" ? selectedType : undefined,
        search: search.trim() || undefined,
        limit: 18,
      });
      setItems(data.items);
      setTotal(data.total);
    } catch {
      setItems([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [activePeriode, selectedType, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  const handleTabChange = (p: Periode) => {
    const next = new URLSearchParams(searchParams);
    next.set("periode", p);
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedType("all");
    const next = new URLSearchParams();
    next.set("periode", activePeriode);
    setSearchParams(next);
  };

  return (
    <>
      <Seo
        title="Nos Actions & Caravanes Solidaires"
        description="Consultez le calendrier de nos distributions alimentaires, caravanes médicales et chantiers solidaires en Tunisie. Rejoignez-nous en tant que bénévole !"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
        {/* 1. En-tête de la page */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Actions Citoyennes & Solidaires
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Toutes nos Caravanes & Campagnes
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Trouvez une action près de chez vous, inscrivez-vous comme bénévole ou contribuez
            directement pour permettre son déploiement.
          </p>
        </div>

        {/* 2. Onglets Période : À venir | En cours | Passés */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-muted/70 border border-border/80 shadow-inner max-w-md w-full">
            <button
              type="button"
              onClick={() => handleTabChange("a_venir")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activePeriode === "a_venir"
                  ? "bg-card text-foreground shadow-md shadow-black/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="w-4 h-4 text-emerald-500" />
              À venir
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("en_cours")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activePeriode === "en_cours"
                  ? "bg-card text-foreground shadow-md shadow-black/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              En cours
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("passes")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activePeriode === "passes"
                  ? "bg-card text-foreground shadow-md shadow-black/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-sky-500" />
              Passés
            </button>
          </div>
        </div>

        {/* 3. Barre de Recherche et Filtre par Type */}
        <div className="p-4 sm:p-5 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-sm shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Recherche textuelle */}
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher une action par titre ou lieu (ex: Kasserine, Paniers, École...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 text-xs sm:text-sm h-11 rounded-2xl"
              />
            </div>

            {/* Sélecteur de type */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as TypeEvenement | "all")}
                className="w-full h-11 px-3 text-xs sm:text-sm rounded-2xl border border-input bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">Tous les types d'actions</option>
                {TYPES_EVENEMENT.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_EVENEMENT_META[t].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Badges de filtre rapide par type sur desktop */}
          <div className="hidden lg:flex items-center gap-2 pt-2 border-t border-border/50 overflow-x-auto scrollbar-none">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Filtrer :
            </span>
            <button
              onClick={() => setSelectedType("all")}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                selectedType === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Tous
            </button>
            {TYPES_EVENEMENT.map((t) => {
              const meta = TYPE_EVENEMENT_META[t];
              const isSel = selectedType === t;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    isSel
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>

          {/* Bouton de réinitialisation si filtres actifs */}
          {(search || selectedType !== "all") && (
            <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
              <span className="text-muted-foreground">
                <strong className="text-foreground">{total}</strong> action(s) trouvée(s)
              </span>
              <button
                onClick={handleResetFilters}
                className="text-primary hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>

        {/* 4. Grille des Cartes d'Événements */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Chargement des actions solidaires...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center rounded-3xl border border-dashed border-border bg-card/40 p-8 space-y-4 max-w-lg mx-auto">
            <Calendar className="w-14 h-14 text-muted-foreground/40 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-foreground">
                Aucune action dans cette catégorie
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Essayez d'ajuster vos critères de recherche ou explorez les autres onglets.
              </p>
            </div>
            <Button onClick={handleResetFilters} variant="outline" className="rounded-xl text-xs font-bold">
              Afficher toutes les actions
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((evt, idx) => (
              <EvenementCard
                key={evt.id}
                evenement={evt}
                index={idx}
                onOpenDonation={(t) => openDonation(t)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
