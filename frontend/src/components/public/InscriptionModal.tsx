import React, { useState } from "react";
import { X, CheckCircle2, UserCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { inscrireEvenement, getApiErrorMessage } from "../../services/public.api";
import { motion, AnimatePresence } from "framer-motion";

interface InscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  evenementId: string;
  evenementTitre: string;
  onSuccess: (newPlacesPrises: number) => void;
}

export const InscriptionModal: React.FC<InscriptionModalProps> = ({
  isOpen,
  onClose,
  evenementId,
  evenementTitre,
  onSuccess,
}) => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !email.trim()) {
      toast.error("Veuillez renseigner votre nom et votre email");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await inscrireEvenement(evenementId, {
        nom: nom.trim(),
        email: email.trim(),
        telephone: telephone.trim() || undefined,
        message: message.trim() || undefined,
      });

      toast.success(res.message);
      setIsSuccess(true);
      onSuccess(res.placesPrises);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Échec de l'inscription"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setNom("");
    setEmail("");
    setTelephone("");
    setMessage("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="p-6 pb-4 bg-primary/10 border-b border-border/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-foreground">
                    Inscription Bénévole
                  </h3>
                  <p className="text-xs text-muted-foreground truncate max-w-[240px]">
                    {evenementTitre}
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-1 rounded-full text-muted-foreground hover:text-foreground"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corps */}
            {isSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="h-14 w-14 mx-auto rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-lg text-foreground">
                  Inscription Validée !
                </h4>
                <p className="text-xs text-muted-foreground">
                  Merci pour votre engagement solidaire. Notre coordinateur de caravane
                  prendra contact avec vous par email ou téléphone avant l'événement.
                </p>
                <Button onClick={handleClose} className="w-full rounded-xl text-xs font-bold">
                  Fermer
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Nom & Prénom *</Label>
                  <Input
                    required
                    placeholder="Selim Trabelsi"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="text-xs h-9 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Adresse Email *</Label>
                  <Input
                    type="email"
                    required
                    placeholder="selim@exemple.tn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-xs h-9 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Téléphone mobile (optionnel)</Label>
                  <Input
                    type="tel"
                    placeholder="+216 98 123 456"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="text-xs h-9 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Message ou compétences particulières</Label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Véhicule disponible, secouriste diplômé, disponible le matin..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-input bg-background text-xs text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-10 rounded-xl text-xs font-bold gap-2 shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...
                      </>
                    ) : (
                      "Confirmer ma participation"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
