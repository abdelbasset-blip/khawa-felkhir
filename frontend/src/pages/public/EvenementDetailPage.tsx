import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Heart,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Sparkles,
  UserCheck,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "../../components/public/Seo";
import { SocialShareButtons } from "../../components/public/SocialShareButtons";
import { MarkdownRenderer, stripMarkdown } from "../../components/common/MarkdownRenderer";
import { EvenementCard } from "../../components/public/EvenementCard";
import { InscriptionModal } from "../../components/public/InscriptionModal";
import { usePublicLayout } from "../../layouts/PublicLayout";
import { getPublicEvenementById } from "../../services/public.api";
import { TYPE_EVENEMENT_META, formatDateFr, getPeriode } from "../../lib/evenement-meta";
import type { PublicEvenementDetail } from "../../types/public";

export const EvenementDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { openDonation } = usePublicLayout();

  const [data, setData] = useState<PublicEvenementDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modale d'inscription bénévole
  const [isInscriptionOpen, setIsInscriptionOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    getPublicEvenementById(id)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Événement introuvable");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-semibold">Chargement de l'action solidaire...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-black text-foreground">Événement introuvable</h2>
        <p className="text-sm text-muted-foreground">
          {error || "Cette action n'est plus accessible ou a été retirée du catalogue public."}
        </p>
        <Link to="/evenements">
          <Button className="rounded-xl text-xs font-bold gap-2">
            <ArrowLeft className="w-4 h-4" /> Retour aux événements
          </Button>
        </Link>
      </div>
    );
  }

  const { evenement, similaires } = data;
  const meta = TYPE_EVENEMENT_META[evenement.type] || TYPE_EVENEMENT_META.autre;
  const TypeIcon = meta.icon;
  const periode = getPeriode(evenement.dateDebut, evenement.dateFin);

  const places = evenement.placesPrises ?? 0;
  const max = evenement.capaciteMax || 0;
  const pct = max > 0 ? Math.min(100, Math.round((places / max) * 100)) : 0;
  const isFull = max > 0 && places >= max;

  return (
    <>
      <Seo
        title={evenement.titre}
        description={stripMarkdown(evenement.description).slice(0, 160)}
        image={evenement.imageCouverture || undefined}
        type="article"
      />

      <div className="pb-24 space-y-12">
        {/* ============================================================ */}
        {/* 1. HERO BANNER DE L'ÉVÉNEMENT                                */}
        {/* ============================================================ */}
        <section className="relative bg-muted/40 border-b border-border/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
            {/* Fil d'ariane & Bouton retour */}
            <div className="flex items-center justify-between">
              <Link
                to="/evenements"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Retour au calendrier
              </Link>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground hidden sm:inline">Partager :</span>
                <SocialShareButtons evenement={evenement} size="sm" />
              </div>
            </div>

            {/* Badges de statut & Type */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${meta.badge}`}>
                <TypeIcon className="w-3.5 h-3.5" />
                {meta.label}
              </span>

              {periode === "a_venir" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                  <Clock className="w-3.5 h-3.5" /> À venir
                </span>
              )}
              {periode === "en_cours" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" /> En cours
                </span>
              )}
              {periode === "passes" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Action achevée
                </span>
              )}
            </div>

            {/* Titre Principal */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground max-w-4xl leading-tight">
              {evenement.titre}
            </h1>

            {/* Barre de métadonnées rapide */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-2">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                Du {formatDateFr(evenement.dateDebut, true)} au {formatDateFr(evenement.dateFin, true)}
              </span>

              <span className="flex items-center gap-2 font-medium text-foreground">
                <MapPin className="w-4 h-4 text-amber-500" />
                {evenement.lieu}
              </span>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. CONTENU PRINCIPAL (2 COLONNES)                            */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Colonne Gauche (2 cols) : Image, Description Markdown, Galerie */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image principale */}
              {evenement.imageCouverture && (
                <div className="rounded-3xl overflow-hidden border border-border/80 shadow-md">
                  <img
                    src={evenement.imageCouverture}
                    alt={evenement.titre}
                    className="w-full h-80 sm:h-[420px] object-cover"
                  />
                </div>
              )}

              {/* Description détaillée en Markdown rendu de manière sûre */}
              <div className="p-8 rounded-3xl border border-border/80 bg-card space-y-4 shadow-sm">
                <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Présentation de l'action solidaire
                </h2>
                <div className="border-t border-border/60 pt-4">
                  <MarkdownRenderer content={evenement.description} className="text-base" />
                </div>
              </div>

              {/* Galerie Photos (si des images sont présentes) */}
              {evenement.galerie && evenement.galerie.length > 0 && (
                <div className="p-8 rounded-3xl border border-border/80 bg-card space-y-4 shadow-sm">
                  <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    Galerie Photos du Terrain
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {evenement.galerie.map((img, idx) => (
                      <div key={idx} className="rounded-2xl overflow-hidden border border-border/60 h-52">
                        <img
                          src={img}
                          alt={`${evenement.titre} - photo ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Colonne Droite (1 col sticky) : Inscription / Don / Infos pratiques */}
            <div className="space-y-6">
              <div className="sticky top-28 p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/95 backdrop-blur-md shadow-xl space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Mobilisation
                  </span>
                  <h3 className="text-2xl font-black text-foreground">
                    Prendre part à cette action
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Chaque bénévole sur le terrain et chaque don permet de toucher plus de familles.
                  </p>
                </div>

                {/* Progression des Bénévoles */}
                {max > 0 ? (
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-primary" />
                        Inscriptions bénévoles
                      </span>
                      <span className="font-bold text-primary">{pct}%</span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isFull ? "bg-amber-500" : "bg-gradient-to-r from-primary to-emerald-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{places} participants inscrits</span>
                      <span>Capacité max : {max}</span>
                    </div>
                  </div>
                ) : null}

                {/* Boutons d'Action */}
                <div className="space-y-3 pt-2">
                  {periode !== "passes" ? (
                    <Button
                      onClick={() => setIsInscriptionOpen(true)}
                      disabled={isFull}
                      className="w-full h-12 text-sm font-bold rounded-2xl shadow-lg shadow-primary/20 gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      {isFull ? "Toutes les places sont prises" : "Devenir bénévole sur cette action"}
                    </Button>
                  ) : (
                    <div className="p-3 rounded-2xl bg-muted text-center text-xs text-muted-foreground font-semibold">
                      Cette action est clôturée. Merci à tous les participants !
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => openDonation(evenement.titre)}
                    className="w-full h-12 text-sm font-bold rounded-2xl border-primary/30 text-primary hover:bg-primary/10 gap-2"
                  >
                    <Heart className="w-4 h-4 fill-primary text-primary" />
                    Financer cette action (Faire un don)
                  </Button>
                </div>

                {/* Infos Pratiques Résumé */}
                <div className="pt-4 border-t border-border/60 space-y-3 text-xs">
                  <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px]">
                    Informations Pratiques
                  </h4>

                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Dates</p>
                        <p>{formatDateFr(evenement.dateDebut, true)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Point de rassemblement</p>
                        <p>{evenement.lieu}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Share2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Amplification</p>
                        <p>Partagez autour de vous pour toucher de nouveaux bienfaiteurs.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Partage Social */}
                <div className="pt-4 border-t border-border/60 space-y-2">
                  <p className="text-xs font-semibold text-foreground">Partager cet événement :</p>
                  <SocialShareButtons evenement={evenement} size="md" className="justify-center" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. ÉVÉNEMENTS SIMILAIRES                                     */}
        {/* ============================================================ */}
        {similaires && similaires.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-border/80 space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Continuer à agir
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Autres Caravanes & Actions Solidaires
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similaires.map((evt, idx) => (
                <EvenementCard
                  key={evt.id}
                  evenement={evt}
                  index={idx}
                  onOpenDonation={(t) => openDonation(t)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modale d'inscription bénévole */}
      <InscriptionModal
        isOpen={isInscriptionOpen}
        onClose={() => setIsInscriptionOpen(false)}
        evenementId={evenement.id}
        evenementTitre={evenement.titre}
        onSuccess={(newCount) => {
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  evenement: {
                    ...prev.evenement,
                    placesPrises: newCount,
                  },
                }
              : null
          );
        }}
      />
    </>
  );
};
