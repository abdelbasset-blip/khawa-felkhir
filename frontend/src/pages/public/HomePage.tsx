import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  CalendarHeart,
  ArrowRight,
  ShieldCheck,
  Users2,
  Sparkles,
  MapPin,
  CheckCircle2,
  HandHeart,
  Smile,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "../../components/public/Seo";
import { AnimatedCounter } from "../../components/public/AnimatedCounter";
import { TestimonialsCarousel } from "../../components/public/TestimonialsCarousel";
import { EvenementCard } from "../../components/public/EvenementCard";
import { usePublicLayout } from "../../layouts/PublicLayout";
import { getPublicEvenements, getPublicStats } from "../../services/public.api";
import type { PublicEvenement, PublicStats } from "../../types/public";
import { motion } from "framer-motion";

export const HomePage: React.FC = () => {
  const { openDonation } = usePublicLayout();
  const [featuredEvents, setFeaturedEvents] = useState<PublicEvenement[]>([]);
  const [stats, setStats] = useState<PublicStats>({
    familles: 1500,
    beneficiairesAides: 1250,
    actions: 48,
    benevoles: 620,
    villes: 18,
  });

  useEffect(() => {
    // Charger les statistiques réelles
    getPublicStats()
      .then((data) => setStats(data))
      .catch(() => {});

    // Charger les 3 premières actions à venir
    getPublicEvenements({ periode: "a_venir", limit: 3 })
      .then((data) => {
        if (data.items.length > 0) {
          setFeaturedEvents(data.items);
        } else {
          // Fallback sur tous les événements publics si aucun "à venir"
          getPublicEvenements({ limit: 3 }).then((all) => setFeaturedEvents(all.items));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Seo
        title="Solidarité & Entraide Citoyenne en Tunisie"
        description="Khawa Felkhir unit les citoyens et donateurs pour apporter paniers alimentaires, soins médicaux et fournitures scolaires aux familles nécessiteuses."
      />

      <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
        {/* ============================================================ */}
        {/* 1. HERO SECTION                                              */}
        {/* ============================================================ */}
        <section className="relative pt-12 sm:pt-20 lg:pt-24">
          {/* Cercles d'ambiance en arrière-plan */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-primary/20 via-emerald-500/10 to-amber-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            {/* Pillule badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-bold shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Association Caritative & Humanitaire Tunisienne</span>
            </motion.div>

            {/* Titre & Slogan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4 max-w-4xl mx-auto"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Ensemble, chaque geste devient un{" "}
                <span className="bg-gradient-to-r from-primary via-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  sourire d'espoir
                </span>
                .
              </h1>
              <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Khawa Felkhir mobilise les cœurs généreux pour soutenir les familles isolées,
                soigner les enfants des zones rurales et bâtir une solidarité durable.
              </p>
            </motion.div>

            {/* Boutons d'action CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2"
            >
              <Button
                size="lg"
                onClick={() => openDonation()}
                className="w-full sm:w-auto h-13 px-8 rounded-2xl text-base font-bold gap-2.5 shadow-xl shadow-primary/25 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/95 hover:to-emerald-600/95"
              >
                <Heart className="w-5 h-5 fill-current text-white" />
                Faire un don maintenant
              </Button>

              <Link to="/evenements" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-13 px-8 rounded-2xl text-base font-bold gap-2.5 border-border hover:bg-muted/60"
                >
                  <CalendarHeart className="w-5 h-5 text-primary" />
                  Voir nos actions sur le terrain
                </Button>
              </Link>
            </motion.div>

            {/* Bannière visuelle illustrative */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative max-w-5xl mx-auto pt-8"
            >
              <div className="relative rounded-3xl overflow-hidden border border-border/80 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&auto=format&fit=crop&q=80"
                  alt="Enfants et bénévoles de Khawa Felkhir"
                  className="w-full h-72 sm:h-96 lg:h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-white text-left">
                  <div className="space-y-1 max-w-lg">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-black">
                      Action Urgente
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold">
                      Caravane Hivernale dans les montagnes du Nord-Ouest
                    </h2>
                    <p className="text-xs sm:text-sm text-white/80 line-clamp-2">
                      Colis alimentaires, couvertures et chauffages d'appoint distribués auprès de 200 foyers.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => openDonation("Caravane Hivernale Nord-Ouest")}
                    className="rounded-xl font-bold bg-white text-primary hover:bg-white/90 shrink-0"
                  >
                    Participer à cette action
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. STATISTIQUES ANIMÉES (COMPTEURS FRAMER MOTION)            */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 shadow-lg">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
                Notre Impact sur le Terrain
              </h2>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Des chiffres qui racontent de vraies vies changées
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
              {/* Stat 1 : Familles */}
              <div className="p-6 rounded-2xl bg-background/60 border border-border/60 space-y-2">
                <div className="h-12 w-12 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Users2 className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-foreground">
                  <AnimatedCounter value={stats.familles || 1500} suffix="+" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                  Familles répertoriées & soutenues
                </p>
              </div>

              {/* Stat 2 : Actions Menées */}
              <div className="p-6 rounded-2xl bg-background/60 border border-border/60 space-y-2">
                <div className="h-12 w-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <HandHeart className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-foreground">
                  <AnimatedCounter value={stats.actions || 48} suffix="+" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                  Caravanes & Actions déployées
                </p>
              </div>

              {/* Stat 3 : Bénévoles */}
              <div className="p-6 rounded-2xl bg-background/60 border border-border/60 space-y-2">
                <div className="h-12 w-12 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Smile className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-foreground">
                  <AnimatedCounter value={stats.benevoles || 620} suffix="+" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                  Bénévoles mobilisés sur le terrain
                </p>
              </div>

              {/* Stat 4 : Villes & Régions */}
              <div className="p-6 rounded-2xl bg-background/60 border border-border/60 space-y-2">
                <div className="h-12 w-12 mx-auto rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-foreground">
                  <AnimatedCounter value={stats.villes || 18} suffix=" gouvernorats" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                  Couverture territoriale nationale
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. SECTION À PROPOS (MISSION & VALEURS)                      */}
        {/* ============================================================ */}
        <section id="a-propos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Colonne Gauche : Texte & Piliers */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  À Propos de Khawa Felkhir
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  Une association née de la volonté d'agir directement là où le besoin est le plus grand.
                </h2>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Fondée par un collectif de citoyens et de professionnels de santé, Khawa Felkhir
                refuse la fatalité de la précarité. Nous mettons en relation directe la générosité
                des donateurs avec les besoins concrets des familles les plus vulnérables.
              </p>

              {/* 4 Valeurs fondamentales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl border border-border bg-card space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                    Transparence Totale
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Chaque millime collecté est justifié par un rapport d'action public détaillé.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-border bg-card space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                    <Heart className="w-4 h-4 text-emerald-500 shrink-0" />
                    Dignité Humaine
                  </div>
                  <p className="text-xs text-muted-foreground">
                    L'aide est apportée dans le respect absolu de l'intimité et de l'honneur des familles.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-border bg-card space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                    <Compass className="w-4 h-4 text-amber-500 shrink-0" />
                    Proximité Rurale
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Priorité donnée aux zones d'ombre et villages enclavés éloignés des grands centres.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-border bg-card space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                    Pérennité & Éducation
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Soutien scolaire et réhabilitation d'écoles pour briser le cycle de la pauvreté.
                  </p>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Galerie illustrative */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80"
                  alt="Distribution de vivres"
                  className="rounded-3xl object-cover h-56 sm:h-72 w-full shadow-md"
                />
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80"
                  alt="Caravane médicale"
                  className="rounded-3xl object-cover h-56 sm:h-72 w-full shadow-md mt-6"
                />
              </div>

              {/* Badge flottant */}
              <div className="absolute -bottom-6 left-6 right-6 p-4 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-xl flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center font-black text-xl shrink-0">
                  100%
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Bénévolat Intégral</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Zéro frais de siège ou d'intermédiaire sur vos dons affectés.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. ACTIONS EN VEDETTE                                        */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Agir Maintenant
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Prochaines Caravanes & Campagnes
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                Rejoignez-nous sur le terrain en tant que bénévole ou contribuez au financement
                des fournitures nécessaires.
              </p>
            </div>

            <Link to="/evenements">
              <Button variant="outline" className="rounded-xl text-xs font-bold gap-2">
                Toutes nos actions
                <ArrowRight className="w-4 h-4 text-primary" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredEvents.map((evt, idx) => (
              <EvenementCard
                key={evt.id}
                evenement={evt}
                index={idx}
                onOpenDonation={(t) => openDonation(t)}
              />
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. TÉMOIGNAGES CAROUSEL (EMBLA)                              */}
        {/* ============================================================ */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto px-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              La Voix du Cœur
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Ce que disent nos bénévoles et partenaires
            </h2>
            <p className="text-sm text-muted-foreground">
              Découvrez les récits de ceux qui font battre le cœur de Khawa Felkhir au quotidien.
            </p>
          </div>

          <TestimonialsCarousel />
        </section>

        {/* ============================================================ */}
        {/* 6. BANNIÈRE D'APPEL AU DON                                  */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-emerald-700 to-teal-800 p-8 sm:p-14 text-white shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-black">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                Un don, une vie transformée
              </span>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Prêt à faire la différence aujourd'hui ?
              </h2>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                Avec seulement 50 DT, vous financez un panier alimentaire d'urgence pour une
                famille de 5 personnes pour une semaine entière.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Button
                  size="lg"
                  onClick={() => openDonation()}
                  className="w-full sm:w-auto h-12 px-8 rounded-2xl text-sm font-bold bg-white text-primary hover:bg-white/90 shadow-lg"
                >
                  <Heart className="w-4 h-4 fill-current mr-2" />
                  Faire un don solidaire
                </Button>

                <Link to="/contact" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-12 px-8 rounded-2xl text-sm font-bold border-white/40 text-white hover:bg-white/10"
                  >
                    Devenir bénévole actif
                  </Button>
                </Link>
              </div>
            </div>

            {/* Décoration géométrique */}
            <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          </div>
        </section>
      </div>
    </>
  );
};
