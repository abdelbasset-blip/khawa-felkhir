import { useEffect } from "react";

interface MetaTagsProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const useMetaTags = ({
  title,
  description = "Khawa_felkhir - Association caritative de solidarité et d'entraide.",
  image = "/logo-khawa.svg",
  url = window.location.href,
  type = "website",
}: MetaTagsProps) => {
  useEffect(() => {
    // 1. Titre standard
    document.title = `${title} | Khawa Felkhir`;

    // 2. Fonction utilitaire pour mettre à jour ou créer un tag meta
    const setMetaTag = (attribute: string, key: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Standard meta
    setMetaTag("name", "description", description);

    // OpenGraph
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:image", image);
    setMetaTag("property", "og:url", url);
    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:site_name", "Khawa Felkhir");

    // Twitter Cards
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", image);
  }, [title, description, image, url, type]);
};
