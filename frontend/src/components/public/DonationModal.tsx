import React, { useState } from "react";
import {
  Heart,
  X,
  CreditCard,
  Building2,
  Smartphone,
  CheckCircle2,
  Copy,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEventTitle?: string;
}

const PRESET_AMOUNTS = [20, 50, 100, 200, 500];

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  defaultEventTitle,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "virement" | "d17">("card");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount || 0;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié dans le presse-papiers`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalAmount || finalAmount <= 0) {
      toast.error("Veuillez sélectionner ou saisir un montant valide");
      return;
    }
    if (!donorEmail) {
      toast.error("Veuillez renseigner votre email pour recevoir le reçu");
      return;
    }

    setIsSuccess(true);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setSelectedAmount(50);
    setCustomAmount("");
    setDonorName("");
    setDonorEmail("");
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
            onClick={handleResetAndClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="relative p-6 pb-5 bg-gradient-to-r from-primary/15 via-emerald-600/10 to-amber-500/10 border-b border-border/80">
              <button
                onClick={handleResetAndClose}
                className="absolute top-5 right-5 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-foreground flex items-center gap-1.5">
                    Faire un Don Solidaire
                    <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {defaultEventTitle
                      ? `Campagne : ${defaultEventTitle}`
                      : "Chaque don apporte une aide directe aux familles nécessiteuses."}
                  </p>
                </div>
              </div>
            </div>

            {/* Contenu */}
            {isSuccess ? (
              <div className="p-8 text-center space-y-5">
                <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-extrabold text-foreground">
                    Merci infiniment pour votre générosité !
                  </h4>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Votre promesse de don de{" "}
                    <strong className="text-primary font-bold">{finalAmount} DT</strong> a bien
                    été enregistrée. Un reçu vous a été envoyé à{" "}
                    <span className="font-medium text-foreground">{donorEmail}</span>.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-xs text-left space-y-1.5">
                  <p className="font-semibold text-foreground">Référence de l'action :</p>
                  <p className="text-muted-foreground font-mono">KHAWA-DON-{Date.now().toString().slice(-6)}</p>
                </div>
                <Button onClick={handleResetAndClose} className="w-full font-semibold rounded-xl">
                  Fermer
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Montants prédéfinis */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Choisissez votre don (DT)
                  </Label>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amt);
                          setCustomAmount("");
                        }}
                        className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                          selectedAmount === amt && !customAmount
                            ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105"
                            : "bg-muted/30 border-border text-foreground hover:bg-muted"
                        }`}
                      >
                        {amt} DT
                      </button>
                    ))}
                  </div>

                  {/* Montant personnalisé */}
                  <div className="pt-1">
                    <Input
                      type="number"
                      placeholder="Autre montant libre (DT)..."
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      min="1"
                      className="text-sm rounded-xl"
                    />
                  </div>
                </div>

                {/* Modes de paiement */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Moyen de contribution
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-xs font-bold">En ligne</span>
                      <span className="text-[10px] opacity-70">CB / Flouci</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("virement")}
                      className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                        paymentMethod === "virement"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span className="text-xs font-bold">Virement</span>
                      <span className="text-[10px] opacity-70">RIB bancaire</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("d17")}
                      className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                        paymentMethod === "d17"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span className="text-xs font-bold">D17 Poste</span>
                      <span className="text-[10px] opacity-70">Tunisie Poste</span>
                    </button>
                  </div>
                </div>

                {/* Détails du mode de paiement sélectionné */}
                {paymentMethod === "virement" && (
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Banque :</span>
                      <span className="font-semibold text-foreground">BNA - Agence Centrale</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">RIB :</span>
                      <span className="font-mono font-bold text-foreground">
                        03 001 02345678901234 56
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy("030010234567890123456", "RIB")}
                        className="h-6 w-6"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {paymentMethod === "d17" && (
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Numéro D17 :</span>
                      <span className="font-mono font-bold text-foreground">+216 98 123 456</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy("98123456", "Numéro D17")}
                        className="h-6 w-6"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Effectuez le transfert depuis votre application D17 avec la mention "Don solidaire".
                    </p>
                  </div>
                )}

                {/* Coordonnées du donateur */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Nom complet</Label>
                    <Input
                      placeholder="Ahmed Ben..."
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="text-xs h-9 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Email *</Label>
                    <Input
                      type="email"
                      required
                      placeholder="ahmed@exemple.tn"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="text-xs h-9 rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-11 text-sm font-bold rounded-2xl shadow-lg shadow-primary/20 gap-2"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    Confirmer le don de {finalAmount} DT
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground mt-2">
                    Khawa Felkhir est une association à but non lucratif enregistrée au JORT.
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
