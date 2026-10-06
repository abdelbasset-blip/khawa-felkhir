import React, { useState, useEffect, useCallback } from "react";
import {
  getEvenements,
  createEvenement,
  updateEvenement,
  deleteEvenement,
  publierEvenement,
} from "../../services/evenements.api";
import {
  Evenement,
  TypeEvenement,
  StatutEvenement,
  EvenementsQuery,
  ShareLinks,
} from "../../types/evenement";
import { EvenementModal } from "../../components/admin/EvenementModal";
import { ShareSocialDialog } from "../../components/admin/ShareSocialDialog";
import { DeleteConfirmDialog } from "../../components/admin/DeleteConfirmDialog";
import { useMetaTags } from "../../hooks/useMetaTags";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  Search,
  Calendar,
  MapPin,
  Users,
  Coins,
  Share2,
  Edit2,
  Trash2,
  Utensils,
  GraduationCap,
  Stethoscope,
  Shirt,
  Moon,
  Sparkles,
  Loader2,
  Clock,
  CheckCircle2,
  Archive,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const EvenementsPage: React.FC = () => {
  useMetaTags({
    title: "Gestion des Événements & Actions",
    description: "Administration des campagnes solidaires et caravanes caritatives de Khawa Felkhir.",
  });

  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filtres
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("all");
  const [statut, setStatut] = useState<string>("all");

  // Modale Formulaire
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvenement, setEditingEvenement] = useState<Evenement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modale Partage Social
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [sharingEvenement, setSharingEvenement] = useState<Evenement | null>(null);
  const [activeShareLinks, setActiveShareLinks] = useState<ShareLinks | null>(null);

  // Dialogue Suppression
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingEvenement, setDeletingEvenement] = useState<Evenement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvenements = useCallback(async () => {
    setIsLoading(true);
    try {
      const query: EvenementsQuery = {
        page,
        limit: 12,
        search: search.trim() || undefined,
        type: type !== "all" ? (type as TypeEvenement) : undefined,
        statut: statut !== "all" ? (statut as StatutEvenement) : undefined,
        sortBy: "dateDebut",
        sortOrder: "asc",
      };

      const data = await getEvenements(query);
      setEvenements(data.items);
      setTotal(data.total);
    } catch {
      toast.error("Impossible de charger les événements");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, type, statut]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvenements();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchEvenements]);

  // Création / Édition
  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (editingEvenement) {
        const updated = await updateEvenement(editingEvenement.id, formData);
        setEvenements((prev) =>
          prev.map((e) => (e.id === updated.id ? updated : e))
        );
        toast.success(`Événement "${updated.titre}" mis à jour`);
      } else {
        const created = await createEvenement(formData);
        toast.success(`Action "${created.titre}" créée avec succès`);
        fetchEvenements();
      }
      setIsModalOpen(false);
      setEditingEvenement(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Erreur de sauvegarde");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Publication & Partage direct
  const handlePublier = async (evt: Evenement) => {
    try {
      const result = await publierEvenement(evt.id);
      setEvenements((prev) =>
        prev.map((e) => (e.id === result.evenement.id ? result.evenement : e))
      );
      setSharingEvenement(result.evenement);
      setActiveShareLinks(result.shareLinks);
      setIsShareOpen(true);
      toast.success(`Événement "${result.evenement.titre}" publié en ligne !`);
    } catch {
      toast.error("Échec de la publication");
    }
  };

  // Suppression
  const handleConfirmDelete = async () => {
    if (!deletingEvenement) return;
    setIsDeleting(true);
    try {
      await deleteEvenement(deletingEvenement.id);
      toast.success(`Événement "${deletingEvenement.titre}" supprimé`);
      setIsDeleteDialogOpen(false);
      setDeletingEvenement(null);
      fetchEvenements();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  // Badges de statut
  const renderStatutBadge = (st: StatutEvenement) => {
    switch (st) {
      case "brouillon":
        return (
          <Badge variant="warning" className="gap-1 font-semibold">
            <Clock className="w-3 h-3" /> Brouillon
          </Badge>
        );
      case "publie":
        return (
          <Badge variant="success" className="gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" /> En Ligne
          </Badge>
        );
      case "termine":
        return (
          <Badge variant="outline" className="gap-1 font-semibold">
            <Archive className="w-3 h-3" /> Clôturé
          </Badge>
        );
    }
  };

  // Icône & libellé par type
  const getTypeInfo = (t: TypeEvenement) => {
    switch (t) {
      case "distribution_alimentaire":
        return { label: "Paniers Alimentaires", icon: Utensils, color: "text-emerald-500" };
      case "collecte_dons":
        return { label: "Collecte de Dons", icon: Coins, color: "text-amber-500" };
      case "soutien_scolaire":
        return { label: "Soutien Scolaire", icon: GraduationCap, color: "text-blue-500" };
      case "aide_medicale":
        return { label: "Aide Médicale", icon: Stethoscope, color: "text-rose-500" };
      case "distribution_vetements":
        return { label: "Vêtements & Hiver", icon: Shirt, color: "text-purple-500" };
      case "evenement_religieux":
        return { label: "Action Ramadan / Aïd", icon: Moon, color: "text-teal-500" };
      default:
        return { label: "Autre Action", icon: Sparkles, color: "text-primary" };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Événements & Actions Solidaires
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {total} actions
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Planifiez, publiez et partagez les caravanes caritatives de l'association.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            onClick={() => {
              setEditingEvenement(null);
              setIsModalOpen(true);
            }}
            className="gap-2 text-xs font-semibold shadow-md"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Nouvel Événement
          </Button>
        </div>
      </div>

      {/* 2. Barre d'outils et Filtres */}
      <div className="p-4 rounded-2xl border border-border/80 bg-card/80 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Recherche */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher par titre, lieu ou description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 bg-background text-xs h-10"
            />
          </div>

          {/* Filtre Type */}
          <div>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 px-3 text-xs rounded-lg border border-input bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">Tous les types d'action</option>
              <option value="distribution_alimentaire">Paniers Alimentaires</option>
              <option value="aide_medicale">Caravanes Médicales</option>
              <option value="soutien_scolaire">Soutien Scolaire</option>
              <option value="distribution_vetements">Vêtements & Hiver</option>
              <option value="collecte_dons">Collectes de Dons</option>
              <option value="evenement_religieux">Actions Religieuses / Ramadan</option>
            </select>
          </div>

          {/* Filtre Statut */}
          <div>
            <select
              value={statut}
              onChange={(e) => {
                setStatut(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 px-3 text-xs rounded-lg border border-input bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">Tous les statuts</option>
              <option value="publie">En Ligne (Publiés)</option>
              <option value="brouillon">Brouillons</option>
              <option value="termine">Clôturés</option>
            </select>
          </div>
        </div>

        {/* Réinitialisation */}
        {(search || type !== "all" || statut !== "all") && (
          <div className="flex justify-end pt-1 border-t border-border/50 text-xs">
            <button
              onClick={() => {
                setSearch("");
                setType("all");
                setStatut("all");
                setPage(1);
              }}
              className="text-primary hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3 h-3" /> Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* 3. Grille en Cartes avec Aperçu Visuel */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Chargement des événements...</p>
        </div>
      ) : evenements.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-border bg-card/40 p-8 space-y-3">
          <Calendar className="w-12 h-12 text-muted-foreground/40 mx-auto" />
          <h3 className="font-bold text-base text-foreground">Aucun événement trouvé</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Ajustez vos filtres ou lancez une nouvelle action caritative pour l'association.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evenements.map((evt, idx) => {
            const typeInfo = getTypeInfo(evt.type);
            const TypeIcon = typeInfo.icon;

            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                className="group rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* Image de couverture avec Overlay de statut */}
                <div className="h-44 w-full relative bg-muted overflow-hidden">
                  {evt.imageCouverture ? (
                    <img
                      src={evt.imageCouverture}
                      alt={evt.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-primary/20 via-background to-secondary flex items-center justify-center text-primary font-bold text-lg">
                      Khawa Felkhir
                    </div>
                  )}

                  {/* Badge Statut flottant */}
                  <div className="absolute top-3 right-3 shadow-md">
                    {renderStatutBadge(evt.statut)}
                  </div>

                  {/* Badge Type d'événement flottant */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                    <TypeIcon className={`w-3.5 h-3.5 ${typeInfo.color}`} />
                    <span>{typeInfo.label}</span>
                  </div>
                </div>

                {/* Contenu de la carte */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {evt.titre}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {evt.description.replace(/[#*`>]/g, "")}
                    </p>
                  </div>

                  {/* Métadonnées : Date, Lieu, Budget, Capacité */}
                  <div className="space-y-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                        {new Date(evt.dateDebut).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5 truncate font-medium text-foreground">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        {evt.lieu}
                      </span>
                    </div>

                    <div className="flex items-center justify-between font-medium">
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <Coins className="w-3.5 h-3.5 shrink-0" />
                        {evt.budget > 0 ? `${evt.budget.toLocaleString()} DT` : "Bénévolat pur"}
                      </span>
                      {evt.capaciteMax && (
                        <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                          <Users className="w-3.5 h-3.5 shrink-0" />
                          {evt.capaciteMax} places
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Bouton "Publier + Partager" */}
                  <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                    <Button
                      variant={evt.statut === "publie" ? "secondary" : "default"}
                      size="sm"
                      onClick={() => handlePublier(evt)}
                      className="gap-1.5 text-xs font-semibold flex-1 shadow-sm"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      {evt.statut === "publie" ? "Partager" : "Publier & Partager"}
                    </Button>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingEvenement(evt);
                          setIsModalOpen(true);
                        }}
                        className="h-8 w-8 rounded-lg hover:bg-muted text-foreground"
                        title="Modifier l'événement"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeletingEvenement(evt);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="h-8 w-8 rounded-lg hover:bg-destructive/10 text-destructive"
                        title="Supprimer l'événement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal Formulaire Événement */}
      <EvenementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvenement(null);
        }}
        onSubmit={handleFormSubmit}
        evenement={editingEvenement}
        isSubmitting={isSubmitting}
      />

      {/* Dialogue Partage Social */}
      <ShareSocialDialog
        isOpen={isShareOpen}
        onClose={() => {
          setIsShareOpen(false);
          setSharingEvenement(null);
          setActiveShareLinks(null);
        }}
        evenement={sharingEvenement}
        shareLinks={activeShareLinks}
      />

      {/* Confirmation Suppression */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingEvenement(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Supprimer cet événement"
        description="Cette action retirera définitivement cette campagne du calendrier."
        itemName={deletingEvenement?.titre}
        isDeleting={isDeleting}
      />
    </div>
  );
};
