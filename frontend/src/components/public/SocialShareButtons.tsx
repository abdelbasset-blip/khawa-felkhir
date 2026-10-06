import React from "react";
import { Facebook, Twitter, Linkedin, Send, MessageCircle, Link2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShareTarget {
  id: string;
  titre: string;
  lieu: string;
  dateDebut: string;
}

/**
 * Construit les liens de partage à partir de l'origine courante du navigateur
 * (garantit le bon domaine/port, y compris en développement).
 */
export const buildPublicShareLinks = (evt: ShareTarget) => {
  const url = `${window.location.origin}/evenements/${evt.id}`;
  const u = encodeURIComponent(url);
  const text = `${evt.titre} — le ${new Date(evt.dateDebut).toLocaleDateString("fr-FR")} à ${evt.lieu}. #KhawaFelkhir #Solidarite`;
  const t = encodeURIComponent(text);

  return {
    url,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    twitter: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text}\n${url}`)}`,
    telegram: `https://t.me/share/url?url=${u}&text=${t}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
  };
};

const NETWORKS = [
  { key: "facebook", label: "Facebook", icon: Facebook, cls: "hover:bg-[#1877F2] hover:text-white" },
  { key: "twitter", label: "X / Twitter", icon: Twitter, cls: "hover:bg-foreground hover:text-background" },
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, cls: "hover:bg-[#25D366] hover:text-white" },
  { key: "telegram", label: "Telegram", icon: Send, cls: "hover:bg-[#229ED9] hover:text-white" },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, cls: "hover:bg-[#0A66C2] hover:text-white" },
] as const;

interface SocialShareButtonsProps {
  evenement: ShareTarget;
  size?: "sm" | "md";
  showCopy?: boolean;
  className?: string;
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  evenement,
  size = "md",
  showCopy = true,
  className,
}) => {
  const links = buildPublicShareLinks(evenement);
  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const icon = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.url);
      toast.success("Lien copié dans le presse-papiers");
    } catch {
      toast.error("Impossible de copier le lien");
    }
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {NETWORKS.map(({ key, label, icon: Icon, cls }) => (
        <a
          key={key}
          href={links[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Partager sur ${label}`}
          title={`Partager sur ${label}`}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            dim,
            "inline-flex items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            cls
          )}
        >
          <Icon className={icon} />
        </a>
      ))}
      {showCopy && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            copy();
          }}
          aria-label="Copier le lien"
          title="Copier le lien"
          className={cn(
            dim,
            "inline-flex items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-500 hover:text-white hover:border-transparent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <Link2 className={icon} />
        </button>
      )}
    </div>
  );
};
