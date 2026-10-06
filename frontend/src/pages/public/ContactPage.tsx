import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Seo } from "../../components/public/Seo";
import { envoyerContact, getApiErrorMessage } from "../../services/public.api";
import { toast } from "sonner";

export const ContactPage: React.FC = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !email.trim() || !sujet.trim() || !message.trim()) {
      toast.error("Veuillez renseigner tous les champs obligatoires (*)");
      return;
    }

    setIsSubmitting(true);
    try {
      const msg = await envoyerContact({
        nom: nom.trim(),
        email: email.trim(),
        telephone: telephone.trim() || undefined,
        sujet: sujet.trim(),
        message: message.trim(),
      });

      toast.success(msg);
      setIsSuccess(true);
      setNom("");
      setEmail("");
      setTelephone("");
      setSujet("");
      setMessage("");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Échec de l'envoi du message"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Contactez Khawa Felkhir | Siège & Permanence Solidaire"
        description="Besoin d'aide, envie de faire un don ou de devenir bénévole ? Contactez l'équipe de l'association caritative Khawa Felkhir à Tunis."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        {/* 1. En-tête */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Écoute, Accueil & Proximité
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Contactez notre Équipe
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Que vous souhaitiez signaler une famille en détresse, organiser une collecte ou devenir
            partenaire mécène, notre permanence est à votre entière disposition.
          </p>
        </div>

        {/* 2. Grille Formulaire + Coordonnées & Carte */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Colonne Gauche : Formulaire de contact (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl border border-border/80 bg-card shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-foreground">
                Envoyez-nous un message
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Remplissez ce formulaire et notre secrétariat vous répondra sous 24 à 48 heures ouvrées.
              </p>
            </div>

            {isSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-start gap-3 text-emerald-800 dark:text-emerald-300 text-xs">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <div className="space-y-1">
                  <p className="font-bold">Message envoyé avec succès !</p>
                  <p>
                    Merci pour votre sollicitation. Nos coordinateurs prendront contact avec vous
                    très rapidement.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Nom & Prénom *</Label>
                  <Input
                    required
                    placeholder="Karim Ben Salem"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="text-xs h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Adresse Email *</Label>
                  <Input
                    type="email"
                    required
                    placeholder="karim@exemple.tn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-xs h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Téléphone mobile (optionnel)</Label>
                  <Input
                    type="tel"
                    placeholder="+216 98 000 000"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="text-xs h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Objet de votre demande *</Label>
                  <Input
                    required
                    placeholder="Ex: Demande d'aide, bénévolat, don d'entreprise..."
                    value={sujet}
                    onChange={(e) => setSujet(e.target.value)}
                    className="text-xs h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Votre message détaillé *</Label>
                <textarea
                  required
                  rows={5}
                  placeholder="Décrivez votre besoin, votre proposition de partenariat ou vos disponibilités..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-input bg-background text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring resize-y min-h-[120px]"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto h-11 px-8 rounded-xl text-xs font-bold gap-2 shadow-md shadow-primary/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Envoyer le message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Colonne Droite : Coordonnées + Carte de localisation (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Boîte des coordonnées */}
            <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card space-y-6 shadow-sm">
              <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Siège & Permanence Sociale
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Adresse postale</p>
                    <p>12 Rue de la Solidarité, 1002 Tunis, Tunisie</p>
                    <p className="text-[11px] text-muted-foreground/80 mt-0.5">
                      (Proche station métro Mohamed V)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Permanence téléphonique</p>
                    <p>+216 71 234 567 (Standard)</p>
                    <p>+216 98 123 456 (Urgences & Caravanes)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Courrier électronique</p>
                    <p>contact@khawa-felkhir.org</p>
                    <p>dons@khawa-felkhir.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Horaires d'ouverture</p>
                    <p>Lundi au Vendredi : 08h30 - 16h30</p>
                    <p>Samedi (départs caravanes) : 07h00 - 13h00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte OpenStreetMap élégante intégrée */}
            <div className="rounded-3xl overflow-hidden border border-border/80 shadow-sm h-64 relative bg-muted">
              <iframe
                title="Carte du siège Khawa Felkhir à Tunis"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://www.openstreetmap.org/export/embed.html?bbox=10.1600%2C36.8000%2C10.2000%2C36.8200&layer=mapnik&marker=36.8065%2C10.1815"
                className="w-full h-full filter saturate-150 contrast-95 opacity-90 hover:opacity-100 transition-opacity"
              />
              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-background/90 backdrop-blur-md text-[10px] font-semibold text-muted-foreground border border-border shadow-sm pointer-events-none">
                📍 Tunis, Tunisie
              </div>
            </div>
          </div>
        </div>

        {/* 3. Questions Fréquentes (FAQ) */}
        <div className="pt-8 border-t border-border/80 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="font-extrabold text-2xl text-foreground flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Foire Aux Questions
            </h3>
            <p className="text-xs text-muted-foreground">
              Les réponses à vos interrogations les plus fréquentes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl border border-border bg-card space-y-2">
              <h4 className="font-bold text-sm text-foreground">
                Comment mes dons sont-ils utilisés ?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                100% des dons affectés vont directement à l'achat de denrées, médicaments et
                fournitures pour les bénéficiaires identifiés lors de nos enquêtes sociales.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card space-y-2">
              <h4 className="font-bold text-sm text-foreground">
                Puis-je participer sans être véhiculé ?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Oui ! Des départs collectifs en minibus sont organisés depuis notre siège à Tunis
                pour chaque caravane rurale du samedi matin.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card space-y-2">
              <h4 className="font-bold text-sm text-foreground">
                Puis-je faire des dons en nature ?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tout à fait ! Nous acceptons les vêtements propres d'hiver, les couvertures, les
                équipements scolaires et les denrées alimentaires non périssables au siège.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
