import React from "react";
import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  /** Chemin relatif (ex: /evenements/123) — l'origine est ajoutée automatiquement */
  path?: string;
  type?: "website" | "article";
}

const DEFAULT_DESCRIPTION =
  "Khawa Felkhir — association caritative tunisienne de solidarité et d'entraide : distributions alimentaires, caravanes médicales, soutien scolaire.";
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80";

/**
 * Balises SEO dynamiques par page (react-helmet-async) :
 * title, description, canonical, OpenGraph et Twitter Cards.
 */
export const Seo: React.FC<SeoProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  path,
  type = "website",
}) => {
  const url = `${window.location.origin}${path ?? window.location.pathname}`;
  const fullTitle = `${title} | Khawa Felkhir`;
  const desc = description.length > 160 ? `${description.slice(0, 157)}...` : description;

  return (
    <Helmet>
      <html lang="fr" />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      <meta property="og:site_name" content="Khawa Felkhir" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="fr_FR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
