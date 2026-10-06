import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  description?: string;
  itemName?: string;
  isDeleting?: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmer la suppression",
  description = "Cette action est irréversible et supprimera définitivement cet enregistrement.",
  itemName,
  isDeleting = false,
}) => {
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
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-card border border-destructive/20 shadow-2xl rounded-2xl p-6 z-10 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              </div>
            </div>

            {itemName && (
              <div className="p-3 rounded-xl bg-muted/60 border border-border text-xs text-foreground font-medium">
                Dossier concerné : <strong className="text-foreground">{itemName}</strong>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isDeleting}
              >
                Annuler
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onConfirm}
                disabled={isDeleting}
                className="gap-2 font-semibold"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  "Supprimer définitivement"
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
