import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Evenement, TypeEvenement } from "../../types/evenement";
import { RichTextEditor } from "./RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  X,
  Loader2,
  CalendarHeart,
  Utensils,
  Coins,
  GraduationCap,
  Stethoscope,
  Shirt,
  Moon,
  Sparkles,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  titre: z.string().min(3, "Le titre doit comporter au moins 3 caractères").trim(),
  description: z.string().min(10, "La description doit comporter au moins 10 caractères"),
  type: z.enum([
    "distribution_alimentaire",
    "collecte_dons",
    "soutien_scolaire",
    "aide_medicale",
    "distribution_vetements",
    "evenement_religieux",
    "autre",
  ]),
  dateDebut: z.string().min(1, "La date de début est requise"),
  dateFin: z.string().min(1, "La date de fin est requise"),
  lieu: z.string().min(2, "Le lieu est requis").trim(),
  capaciteMax: z.coerce.number().int().positive().optional().nullable(),
  budget: z.coerce.number().min(0, "Le budget ne peut être négatif").default(0),
  statut: z.enum(["brouillon", "publie", "termine"]),
  imageCouverture: z.string().optional().nullable(),
});

type FormData = z.infer<typeof formSchema>;

interface EvenementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  evenement?: Evenement | null;
  isSubmitting?: boolean;
}

export const EvenementModal: React.FC<EvenementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  evenement,
  isSubmitting = false,
}) => {
  const isEditing = Boolean(evenement);
  const [imagePreview, setImagePreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titre: "",
      description: "",
      type: "distribution_alimentaire",
      dateDebut: "",
      dateFin: "",
      lieu: "",
      capaciteMax: 100,
      budget: 5000,
      statut: "brouillon",
      imageCouverture: "",
    },
  });

  const watchedImage = watch("imageCouverture");

  useEffect(() => {
    if (watchedImage) {
      setImagePreview(watchedImage);
    }
  }, [watchedImage]);

  useEffect(() => {
    if (evenement) {
      reset({
        titre: evenement.titre,
        description: evenement.description,
        type: evenement.type,
        dateDebut: evenement.dateDebut
          ? new Date(evenement.dateDebut).toISOString().slice(0, 16)
          : "",
        dateFin: evenement.dateFin
          ? new Date(evenement.dateFin).toISOString().slice(0, 16)
          : "",
        lieu: evenement.lieu,
        capaciteMax: evenement.capaciteMax || undefined,
        budget: evenement.budget || 0,
        statut: evenement.statut,
        imageCouverture: evenement.imageCouverture || "",
      });
      setImagePreview(evenement.imageCouverture || "");
    } else {
      const now = new Date();
      const inThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      reset({
        titre: "",
        description: "",
        type: "distribution_alimentaire",
        dateDebut: now.toISOString().slice(0, 16),
        dateFin: inThreeDays.toISOString().slice(0, 16),
        lieu: "Grand Tunis",
        capaciteMax: 100,
        budget: 5000,
        statut: "brouillon",
        imageCouverture:
          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80",
      });
      setImagePreview(
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80"
      );
    }
  }, [evenement, reset]);

  // Gestion de l'upload d'image locale avec conversion Base64 pour prévisualisation immédiate
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setValue("imageCouverture", base64String);
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const typeOptions: {
    value: TypeEvenement;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { value: "distribution_alimentaire", label: "Distribution Alimentaire", icon: Utensils },
    { value: "collecte_dons", label: "Collecte de Dons", icon: Coins },
    { value: "soutien_scolaire", label: "Soutien Scolaire", icon: GraduationCap },
    { value: "aide_medicale", label: "Aide Médicale & Santé", icon: Stethoscope },
    { value: "distribution_vetements", label: "Vêtements & Hiver", icon: Shirt },
    { value: "evenement_religieux", label: "Action Religieuse / Ramadan", icon: Moon },
    { value: "autre", label: "Autre Initiative", icon: Sparkles },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <CalendarHeart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    {isEditing ? "Modifier l'Événement" : "Nouvelle Action Caritative"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Configurez le programme, les visuels et les informations pour vos bénévoles.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulaire défilant */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Ligne 1 : Titre */}
              <div className="space-y-1.5">
                <Label htmlFor="titre">Titre de l'action *</Label>
                <Input
                  id="titre"
                  placeholder="Ex: Distribution Colis Hivernal 2026"
                  {...register("titre")}
                  className={errors.titre ? "border-destructive" : ""}
                />
                {errors.titre && (
                  <p className="text-xs text-destructive font-medium">{errors.titre.message}</p>
                )}
              </div>

              {/* Ligne 2 : Type d'événement (avec icônes Lucide) & Statut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="type">Type d'action *</Label>
                  <select
                    id="type"
                    {...register("type")}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {typeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="statut">Statut de publication *</Label>
                  <select
                    id="statut"
                    {...register("statut")}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-semibold"
                  >
                    <option value="brouillon">Brouillon (Non visible au public)</option>
                    <option value="publie">Publié (En ligne sur la vitrine)</option>
                    <option value="termine">Terminé / Clôturé</option>
                  </select>
                </div>
              </div>

              {/* Ligne 3 : Dates Début & Fin */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="dateDebut">Date et heure de début *</Label>
                  <Input
                    id="dateDebut"
                    type="datetime-local"
                    {...register("dateDebut")}
                    className={errors.dateDebut ? "border-destructive" : ""}
                  />
                  {errors.dateDebut && (
                    <p className="text-xs text-destructive font-medium">{errors.dateDebut.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="dateFin">Date et heure de fin *</Label>
                  <Input
                    id="dateFin"
                    type="datetime-local"
                    {...register("dateFin")}
                    className={errors.dateFin ? "border-destructive" : ""}
                  />
                  {errors.dateFin && (
                    <p className="text-xs text-destructive font-medium">{errors.dateFin.message}</p>
                  )}
                </div>
              </div>

              {/* Ligne 4 : Lieu, Capacité & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="lieu">Lieu / Ville *</Label>
                  <Input
                    id="lieu"
                    placeholder="Ex: Kasserine, Sidi Bouzid..."
                    {...register("lieu")}
                    className={errors.lieu ? "border-destructive" : ""}
                  />
                  {errors.lieu && (
                    <p className="text-xs text-destructive font-medium">{errors.lieu.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="capaciteMax">Capacité (Bénévoles / Places)</Label>
                  <Input
                    id="capaciteMax"
                    type="number"
                    min="1"
                    placeholder="Ex: 50"
                    {...register("capaciteMax")}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="budget">Budget estimé (DT)</Label>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    placeholder="Ex: 15000"
                    {...register("budget")}
                  />
                </div>
              </div>

              {/* Ligne 5 : Image de Couverture avec Prévisualisation */}
              <div className="space-y-2">
                <Label>Image de Couverture</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                  <div className="sm:col-span-2 space-y-2">
                    <Input
                      placeholder="URL de l'image (Unsplash, CDN...)"
                      {...register("imageCouverture")}
                    />
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-input bg-muted/40 hover:bg-muted text-xs font-semibold cursor-pointer text-foreground transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        Choisir une image locale...
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-muted-foreground">
                        JPG, PNG ou WebP
                      </span>
                    </div>
                  </div>

                  {/* Prévisualisation visuelle */}
                  <div className="h-24 rounded-xl border border-border bg-muted/30 overflow-hidden flex items-center justify-center relative shadow-inner">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Prévisualisation"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground gap-1 text-[11px]">
                        <ImageIcon className="w-5 h-5 opacity-40" />
                        <span>Aperçu</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ligne 6 : Éditeur Rich-Text pour la Description */}
              <div className="space-y-1.5">
                <Label>Description Complète (Rich-Text / Markdown) *</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Décrivez l'objectif de la campagne, les familles visées, les besoins en dons..."
                      error={errors.description?.message}
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border shrink-0">
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
                    "Créer l'action"
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
