import { env } from "../config/env";

export interface ShareLinks {
  shareUrl: string;
  facebook: string;
  twitter: string;
  whatsapp: string;
  telegram: string;
  linkedin: string;
}

interface ShareableEvenement {
  id: string;
  titre: string;
  lieu: string;
  dateDebut: Date;
}

/**
 * Génère les URLs de partage social d'un événement (DRY : utilisé par l'admin
 * lors de la publication ET par la vitrine publique).
 */
export const buildShareLinks = (evt: ShareableEvenement): ShareLinks => {
  const clientBaseUrl = env.CLIENT_URL || "http://localhost:5173";
  const shareUrl = `${clientBaseUrl}/evenements/${evt.id}`;
  const shareTitle = `Khawa Felkhir - ${evt.titre}`;
  const shareSummary = `${evt.titre} | Rejoignez notre action solidaire le ${new Date(
    evt.dateDebut
  ).toLocaleDateString("fr-FR")} à ${evt.lieu}. #KhawaFelkhir #Solidarite`;

  const u = encodeURIComponent(shareUrl);

  return {
    shareUrl,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    twitter: `https://twitter.com/intent/tweet?url=${u}&text=${encodeURIComponent(shareSummary)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${shareTitle}\n${shareSummary}\n${shareUrl}`
    )}`,
    telegram: `https://t.me/share/url?url=${u}&text=${encodeURIComponent(shareTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
  };
};
