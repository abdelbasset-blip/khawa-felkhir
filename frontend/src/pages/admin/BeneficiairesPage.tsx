import React, { useState, useEffect, useCallback } from "react";
import {
  getBeneficiaires,
  createBeneficiaire,
  updateBeneficiaire,
  deleteBeneficiaire,
  downloadBeneficiairesCsv,
} from "../../services/beneficiaires.api";
import {
  Beneficiaire,
  TypeAide,
  StatutBeneficiaire,
  BeneficiairesQuery,
} from "../../types/beneficiaire";
import { BeneficiaireModal } from "../../components/admin/BeneficiaireModal";
import { DeleteConfirmDialog } from "../../components/admin/DeleteConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  PlusCircle,
  FileSpreadsheet,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Phone,
  MapPin,
  Baby,
  CheckCircle,
  Clock,
  Heart,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const BeneficiairesPage: React.FC = () => {
  const [beneficiaires, setBeneficiaires] = useState<Beneficiaire[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filtres et recherche
  const [search, setSearch] = useState("");
  const [typeAide, setTypeAide] = useState<string>("all");
  const [statut, setStatut] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"nom" | "dateAjout" | "nbEnfants">("dateAjout");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBeneficiaire, setEditingBeneficiaire] = useState<Beneficiaire | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dialogue de suppression
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingBeneficiaire, setDeletingBeneficiaire] = useState<Beneficiaire | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Export CSV loading
  const [isExporting, setIsExporting] = useState(false);

  const fetchBeneficiaires = useCallback(async () => {
    setIsLoading(true);
    try {
      const query: BeneficiairesQuery = {
        page,
        limit: 8,
        search: search.trim() || undefined,
        type_aide: typeAide !== "all" ? (typeAide as TypeAide) : undefined,
        statut: statut !== "all" ? (statut as StatutBeneficiaire) : undefined,
        sortBy,
        sortOrder,
      };

      const data = await getBeneficiaires(query);
      setBeneficiaires(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error("Impossible de charger la liste des bénéficiaires");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, typeAide, statut, sortBy, sortOrder]);

  // Chargement des données à chaque changement de filtre / pagination
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBeneficiaires();
    }, 250); // Petit debounce sur la recherche
    return () => clearTimeout(timer);
  }, [fetchBeneficiaires]);

  // Soumission Création / Modification
  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (editingBeneficiaire) {
        const updated = await updateBeneficiaire(editingBeneficiaire.id, formData);
        setBeneficiaires((prev) =>
          prev.map((b) => (b.id === updated.id ? updated : b))
        );
        toast.success(`Dossier de ${updated.prenom} ${updated.nom} mis à jour avec succès`);
      } else {
        const created = await createBeneficiaire(formData);
        toast.success(`Nouveau bénéficiaire ${created.prenom} ${created.nom} ajouté`);
        fetchBeneficiaires();
      }
      setIsModalOpen(false);
      setEditingBeneficiaire(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmation de suppression
  const handleConfirmDelete = async () => {
    if (!deletingBeneficiaire) return;
    setIsDeleting(true);
    try {
      await deleteBeneficiaire(deletingBeneficiaire.id);
      toast.success(`Dossier de ${deletingBeneficiaire.prenom} ${deletingBeneficiaire.nom} supprimé`);
      setIsDeleteDialogOpen(false);
      setDeletingBeneficiaire(null);
      fetchBeneficiaires();
    } catch {
      toast.error("Erreur lors de la suppression du bénéficiaire");
    } finally {
      setIsDeleting(false);
    }
  };

  // Export CSV
  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      await downloadBeneficiairesCsv({
        search: search.trim() || undefined,
        type_aide: typeAide !== "all" ? (typeAide as TypeAide) : undefined,
        statut: statut !== "all" ? (statut as StatutBeneficiaire) : undefined,
      });
      toast.success("Fichier CSV exporté avec succès (format compatible Excel)");
    } catch {
      toast.error("Échec du téléchargement du fichier CSV");
    } finally {
      setIsExporting(false);
    }
  };

  // Formatage du statut
  const renderStatutBadge = (st: StatutBeneficiaire) => {
    switch (st) {
      case "en_attente":
        return (
          <Badge variant="warning" className="gap-1 font-semibold">
            <Clock className="w-3 h-3" /> En attente
          </Badge>
        );
      case "valide":
        return (
          <Badge variant="info" className="gap-1 font-semibold">
            <CheckCircle className="w-3 h-3" /> Validé
          </Badge>
        );
      case "aide":
        return (
          <Badge variant="success" className="gap-1 font-semibold">
            <Heart className="w-3 h-3" /> Aidé
          </Badge>
        );
      default:
        return <Badge variant="outline">{st}</Badge>;
    }
  };

  // Formatage du type d'aide
  const renderTypeAideLabel = (type: TypeAide) => {
    const labels: Record<TypeAide, { text: string; bg: string }> = {
      alimentaire: { text: "Alimentaire", bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
      medical: { text: "Médical", bg: "bg-sky-500/10 text-sky-700 dark:text-sky-400" },
      scolaire: { text: "Scolaire", bg: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
      vestimentaire: { text: "Vestimentaire", bg: "bg-purple-500/10 text-purple-700 dark:text-purple-400" },
      financier: { text: "Financier", bg: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
      autre: { text: "Autre", bg: "bg-muted text-muted-foreground" },
    };
    const item = labels[type] || labels.autre;
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.bg}`}>
        {item.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions principales */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Gestion des Bénéficiaires
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {total} dossiers
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Registre complet des familles prises en charge et suivi des aides caritatives.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={isExporting}
            className="gap-2 text-xs font-semibold shadow-sm"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-3.5 h-3.5" />
            )}
            Exporter CSV
          </Button>

          {/* Bouton "+ Nouveau Bénéficiaire" reprenant le style exact du Dashboard */}
          <Button
            size="sm"
            onClick={() => {
              setEditingBeneficiaire(null);
              setIsModalOpen(true);
            }}
            className="gap-2 text-xs font-semibold shadow-md"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Nouveau Bénéficiaire
          </Button>
        </div>
      </div>

      {/* 2. Barre d'outils (Recherche + Filtres avancés) */}
      <div className="p-4 rounded-2xl border border-border/80 bg-card/80 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Recherche instantanée */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher par nom, prénom, CIN, téléphone, ville..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 bg-background text-xs h-10"
            />
          </div>

          {/* Filtre Type d'aide */}
          <div>
            <select
              value={typeAide}
              onChange={(e) => {
                setTypeAide(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 px-3 text-xs rounded-lg border border-input bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">Tous les types d'aide</option>
              <option value="alimentaire">Paniers Alimentaires</option>
              <option value="medical">Soins Médicaux</option>
              <option value="scolaire">Rentrée Scolaire</option>
              <option value="vestimentaire">Vêtements & Couvertures</option>
              <option value="financier">Soutien Financier</option>
              <option value="autre">Autre soutien</option>
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
              <option value="en_attente">En attente</option>
              <option value="valide">Dossier Validé</option>
              <option value="aide">Aidé / Clôturé</option>
            </select>
          </div>
        </div>

        {/* Ligne d'actions secondaires : Tri et Reset */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Trier par :</span>
            <button
              onClick={() => {
                setSortBy("dateAjout");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
              className={`hover:text-foreground font-medium px-2 py-0.5 rounded ${
                sortBy === "dateAjout" ? "bg-muted text-foreground" : ""
              }`}
            >
              Date {sortBy === "dateAjout" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => {
                setSortBy("nom");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
              className={`hover:text-foreground font-medium px-2 py-0.5 rounded ${
                sortBy === "nom" ? "bg-muted text-foreground" : ""
              }`}
            >
              Nom {sortBy === "nom" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => {
                setSortBy("nbEnfants");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
              className={`hover:text-foreground font-medium px-2 py-0.5 rounded ${
                sortBy === "nbEnfants" ? "bg-muted text-foreground" : ""
              }`}
            >
              Enfants {sortBy === "nbEnfants" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
          </div>

          {(search || typeAide !== "all" || statut !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setTypeAide("all");
                setStatut("all");
                setPage(1);
              }}
              className="text-primary hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3 h-3" /> Réinitialiser filtres
            </button>
          )}
        </div>
      </div>

      {/* 3. Table des Bénéficiaires */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Bénéficiaire</th>
                <th className="py-3.5 px-4">CIN</th>
                <th className="py-3.5 px-4">Coordonnées</th>
                <th className="py-3.5 px-4">Foyer</th>
                <th className="py-3.5 px-4">Besoin Prioritaire</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="text-xs font-medium">Chargement des dossiers...</span>
                    </div>
                  </td>
                </tr>
              ) : beneficiaires.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-muted-foreground/40" />
                      <p className="font-semibold text-sm text-foreground">Aucun bénéficiaire trouvé</p>
                      <p className="text-xs">Modifiez vos critères de recherche ou enregistrez un nouveau dossier.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                beneficiaires.map((b) => (
                  <motion.tr
                    key={b.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-muted/40 transition-colors group"
                  >
                    {/* Nom & Prénom */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 border border-primary/20 text-xs">
                          {b.prenom.charAt(0)}
                          {b.nom.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate text-sm">
                            {b.prenom} {b.nom}
                          </p>
                          <span className="text-[11px] text-muted-foreground">
                            Inscrit le {new Date(b.dateAjout).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* CIN */}
                    <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                      {b.cin}
                    </td>

                    {/* Téléphone & Localisation */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-foreground font-medium">
                        <Phone className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span>{b.telephone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] truncate max-w-[180px]">
                        <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span title={`${b.adresse}, ${b.ville}`}>{b.ville}</span>
                      </div>
                    </td>

                    {/* Foyer & Enfants */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <Baby className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{b.nbEnfants} enfant{b.nbEnfants > 1 ? "s" : ""}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {b.situationFamiliale}
                      </span>
                    </td>

                    {/* Type d'aide */}
                    <td className="py-3.5 px-4">
                      {renderTypeAideLabel(b.typeAide)}
                    </td>

                    {/* Statut */}
                    <td className="py-3.5 px-4">
                      {renderStatutBadge(b.statut)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingBeneficiaire(b);
                            setIsModalOpen(true);
                          }}
                          className="h-8 w-8 rounded-lg hover:bg-muted text-foreground"
                          title="Modifier le dossier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingBeneficiaire(b);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="h-8 w-8 rounded-lg hover:bg-destructive/10 text-destructive"
                          title="Supprimer le dossier"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Barre de Pagination */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            Affichage de <strong className="text-foreground">{beneficiaires.length}</strong> sur{" "}
            <strong className="text-foreground">{total}</strong> familles enregistrées
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              className="h-8 px-2.5 text-xs gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Précédent
            </Button>

            <span className="font-semibold text-foreground px-2">
              Page {page} / {totalPages || 1}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isLoading}
              className="h-8 px-2.5 text-xs gap-1"
            >
              Suivant <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Ajout / Modification */}
      <BeneficiaireModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBeneficiaire(null);
        }}
        onSubmit={handleFormSubmit}
        beneficiaire={editingBeneficiaire}
        isSubmitting={isSubmitting}
      />

      {/* Boîte de dialogue Confirmation de suppression */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingBeneficiaire(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Supprimer ce bénéficiaire"
        description="Cette suppression retirera le dossier du registre actif de l'association."
        itemName={deletingBeneficiaire ? `${deletingBeneficiaire.prenom} ${deletingBeneficiaire.nom} (CIN: ${deletingBeneficiaire.cin})` : undefined}
        isDeleting={isDeleting}
      />
    </div>
  );
};
