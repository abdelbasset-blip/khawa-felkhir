import React, { useState } from "react";
import { Evenement, ShareLinks } from "../../types/evenement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  MessageCircle,
  Send,
  Calendar,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ShareSocialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  evenement: Evenement | null;
  shareLinks?: ShareLinks | null;
}

export const ShareSocialDialog: React.FC<ShareSocialDialogProps> = ({
  isOpen,
  onClose,
  evenement,
  shareLinks,
}) => {
  const [copied, setCopied] = useState(false);

  if (!evenement) return null;

  const currentUrl =
    shareLinks?.shareUrl || `${window.location.origin}/evenements/${evenement.id}`;

  const defaultShareLinks: ShareLinks = shareLinks || {
    shareUrl: currentUrl,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(`Rejoignez l'action solidaire : ${evenement.titre} avec l'association caritative Khawa Felkhir ! #KhawaFelkhir #Solidarité`)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Khawa Felkhir - ${evenement.titre}\nRejoignez notre action solidaire le ${new Date(evenement.dateDebut).toLocaleDateString("fr-FR")} à ${evenement.lieu}.\n${currentUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(`Khawa Felkhir - ${evenement.titre}`)}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success("Lien copié dans le presse-papier !");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Impossible de copier le lien");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative w-full max-w-lg bg-card border border-border shadow-2xl rounded-2xl p-6 z-10 space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    Publier & Partager l'Action
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Mobilisez les bénévoles et donateurs sur les réseaux sociaux.
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

            {/* Aperçu rapide de l'événement */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/80">
              {evenement.imageCouverture ? (
                <img
                  src={evenement.imageCouverture}
                  alt={evenement.titre}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                  Khawa
                </div>
              )}
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="font-bold text-sm text-foreground truncate">
                  {evenement.titre}
                </h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {new Date(evenement.dateDebut).toLocaleDateString("fr-FR")}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {evenement.lieu}
                  </span>
                </div>
              </div>
            </div>

            {/* Boutons de Partage Réseaux Sociaux */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Partager directement
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Facebook */}
                <a
                  href={defaultShareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-all font-semibold text-xs gap-1.5 group"
                >
                  <span className="font-extrabold text-base">f</span>
                  <span>Facebook</span>
                </a>

                {/* X / Twitter */}
                <a
                  href={defaultShareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-700/20 bg-neutral-900/10 dark:bg-neutral-100/10 hover:bg-neutral-900/20 text-foreground transition-all font-semibold text-xs gap-1.5"
                >
                  <span className="font-extrabold text-base">𝕏</span>
                  <span>X / Twitter</span>
                </a>

                {/* WhatsApp */}
                <a
                  href={defaultShareLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-all font-semibold text-xs gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>

                {/* Telegram */}
                <a
                  href={defaultShareLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-sky-500/20 bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 transition-all font-semibold text-xs gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram</span>
                </a>
              </div>
            </div>

            {/* Lien Public Copiable */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground">
                Lien public de la page événement :
              </span>
              <div className="flex items-center gap-2">
                <Input
                  value={currentUrl}
                  readOnly
                  className="bg-muted/50 text-xs font-mono h-10 select-all"
                />
                <Button
                  onClick={handleCopy}
                  className="h-10 px-3.5 gap-1.5 font-semibold shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" /> Copié
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copier
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 flex items-center justify-between border-t border-border">
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
              >
                Voir la page publique <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Button variant="outline" size="sm" onClick={onClose}>
                Fermer
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
