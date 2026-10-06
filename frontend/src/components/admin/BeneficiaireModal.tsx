import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Beneficiaire } from "../../types/beneficiaire";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2, UserCheck, HeartHandshake } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  nom: z.string().min(2, "Le nom doit comporter au moins 2 caractères").trim(),
  prenom: z.string().min(2, "Le prénom doit comporter au moins 2 caractères").trim(),
  cin: z.string().min(4, "Le CIN doit comporter au moins 4 caractères").trim(),
  telephone: z.string().min(8, "Numéro de téléphone invalide").trim(),
  adresse: z.string().min(3, "L'adresse doit être précisée").trim(),
  ville: z.string().min(2, "La ville est requise").trim(),
  situationFamiliale: z.string().min(1, "Veuillez sélectionner une situation"),
  nbEnfants: z.coerce.number().int().min(0, "Ne peut être négatif"),
  typeAide: z.enum([
    "alimentaire",
    "medical",
    "scolaire",
    "vestimentaire",
    "financier",
    "autre",
  ]),
  statut: z.enum(["en_attente", "valide", "aide"]),
  notes: z.string().optional().nullable(),
});

type FormData = z.infer<typeof formSchema>;

interface BeneficiaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  beneficiaire?: Beneficiaire | null;
  isSubmitting?: boolean;
}

export const BeneficiaireModal: React.FC<BeneficiaireModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  beneficiaire,
  isSubmitting = false,
}) => {
  const isEditing = Boolean(beneficiaire);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      cin: "",
      telephone: "",
      adresse: "",
      ville: "",
      situationFamiliale: "Marié(e)",
      nbEnfants: 0,
      typeAide: "alimentaire",
      statut: "en_attente",
      notes: "",
    },
  });

  useEffect(() => {
    if (beneficiaire) {
      reset({
        nom: beneficiaire.nom,
        prenom: beneficiaire.prenom,
        cin: beneficiaire.cin,
        telephone: beneficiaire.telephone,
        adresse: beneficiaire.adresse,
        ville: beneficiaire.ville,
        situationFamiliale: beneficiaire.situationFamiliale || "Marié(e)",
        nbEnfants: beneficiaire.nbEnfants || 0,
        typeAide: beneficiaire.typeAide,
        statut: beneficiaire.statut,
        notes: beneficiaire.notes || "",
      });
    } else {
      reset({
        nom: "",
        prenom: "",
        cin: "",
        telephone: "",
        adresse: "",
        ville: "Tunis",
        situationFamiliale: "Marié(e)",
        nbEnfants: 0,
        typeAide: "alimentaire",
        statut: "en_attente",
        notes: "",
      });
    }
  }, [beneficiaire, reset]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop sombre */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Fenêtre modale */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-10 my-8"
          >
            {/* Header de la modale */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  {isEditing ? <UserCheck className="w-5 h-5" /> : <HeartHandshake className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    {isEditing ? "Modifier le Bénéficiaire" : "Nouveau Dossier Bénéficiaire"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isEditing
                      ? "Mettez à jour les informations du foyer enregistré."
                      : "Enregistrez une nouvelle famille ou personne nécessitant de l'aide."}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Ligne 1 : Nom & Prénom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    placeholder="Ex: Benali"
                    {...register("nom")}
                    className={errors.nom ? "border-destructive" : ""}
                  />
                  {errors.nom && (
                    <p className="text-xs text-destructive font-medium">{errors.nom.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    placeholder="Ex: Mohamed"
                    {...register("prenom")}
                    className={errors.prenom ? "border-destructive" : ""}
                  />
                  {errors.prenom && (
                    <p className="text-xs text-destructive font-medium">{errors.prenom.message}</p>
                  )}
                </div>
              </div>

              {/* Ligne 2 : CIN & Téléphone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cin">Numéro CIN / Passeport *</Label>
                  <Input
                    id="cin"
                    placeholder="Ex: 08472911"
                    {...register("cin")}
                    className={errors.cin ? "border-destructive" : ""}
                  />
                  {errors.cin && (
                    <p className="text-xs text-destructive font-medium">{errors.cin.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="telephone">Téléphone de contact *</Label>
                  <Input
                    id="telephone"
                    placeholder="Ex: 98 123 456"
                    {...register("telephone")}
                    className={errors.telephone ? "border-destructive" : ""}
                  />
                  {errors.telephone && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.telephone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Ligne 3 : Ville & Adresse */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-1">
                  <Label htmlFor="ville">Gouvernorat / Ville *</Label>
                  <Input
                    id="ville"
                    placeholder="Ex: Tunis, Kasserine..."
                    {...register("ville")}
                    className={errors.ville ? "border-destructive" : ""}
                  />
                  {errors.ville && (
                    <p className="text-xs text-destructive font-medium">{errors.ville.message}</p>
                  )}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="adresse">Adresse complète / Quartier *</Label>
                  <Input
                    id="adresse"
                    placeholder="Ex: Cité El Amal, Rue 14, N° 5"
                    {...register("adresse")}
                    className={errors.adresse ? "border-destructive" : ""}
                  />
                  {errors.adresse && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.adresse.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Ligne 4 : Situation familiale & Nombre d'enfants */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="situationFamiliale">Situation familiale</Label>
                  <select
                    id="situationFamiliale"
                    {...register("situationFamiliale")}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Marié(e)">Marié(e)</option>
                    <option value="Veuf/Veuve">Veuf / Veuve</option>
                    <option value="Divorcé(e)">Divorcé(e)</option>
                    <option value="Célibataire">Célibataire</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="nbEnfants">Nombre d'enfants à charge</Label>
                  <Input
                    id="nbEnfants"
                    type="number"
                    min="0"
                    {...register("nbEnfants")}
                    className={errors.nbEnfants ? "border-destructive" : ""}
                  />
                </div>
              </div>

              {/* Ligne 5 : Type d'aide & Statut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="typeAide">Type d'aide prioritaire *</Label>
                  <select
                    id="typeAide"
                    {...register("typeAide")}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring capitalize"
                  >
                    <option value="alimentaire">Alimentaire (Paniers, Colis)</option>
                    <option value="medical">Médical (Médicaments, Consultations)</option>
                    <option value="scolaire">Scolaire (Fournitures, Inscription)</option>
                    <option value="vestimentaire">Vestimentaire (Hiver, Aïd)</option>
                    <option value="financier">Financier (Loyer, Urgences)</option>
                    <option value="autre">Autre soutien</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="statut">Statut du dossier *</Label>
                  <select
                    id="statut"
                    {...register("statut")}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="en_attente">En attente d'évaluation</option>
                    <option value="valide">Dossier Validé</option>
                    <option value="aide">Aide Octroyée / Clôturé</option>
                  </select>
                </div>
              </div>

              {/* Ligne 6 : Notes sociales confidentielles */}
              <div className="space-y-1.5">
                <Label htmlFor="notes">Notes d'évaluation sociale (facultatif)</Label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Détails sur les besoins urgents, situation de précarité, remarques des bénévoles..."
                  {...register("notes")}
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none placeholder:text-muted-foreground/70"
                />
              </div>

              {/* Footer avec Boutons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-semibold shadow-md gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : isEditing ? (
                    "Mettre à jour"
                  ) : (
                    "Créer le dossier"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
