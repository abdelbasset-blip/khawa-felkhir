import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "fr" | "ar";

export interface Translations {
  [key: string]: {
    fr: string;
    ar: string;
  };
}

export const DICTIONARY: Translations = {
  // Navigation
  nav_home: { fr: "Accueil", ar: "الرئيسية" },
  nav_events: { fr: "Événements & Actions", ar: "الفعاليات والقوافل" },
  nav_contact: { fr: "Contact", ar: "اتصل بنا" },
  nav_admin: { fr: "Espace Admin", ar: "فضاء الإدارة" },
  nav_donate: { fr: "Faire un don", ar: "تبرع الآن" },
  nav_tagline: { fr: "Solidarité & Entraide Citoyenne", ar: "تضامن وتآزر شعبي" },

  // Hero
  hero_title_1: { fr: "Ensemble, chaque geste devient un", ar: "معاً، كل بادرة تصبح" },
  hero_title_highlight: { fr: "sourire d'espoir", ar: "بسمة أمل" },
  hero_subtitle: {
    fr: "Khawa Felkhir mobilise les cœurs généreux pour soutenir les familles isolées, soigner les enfants des zones rurales et bâtir une solidarité durable.",
    ar: "خاوة في الخير تجمع القلوب الكريمة لدعم العائلات المتعففة، علاج الأطفال في المناطق الريفية وبناء تضامن دائم.",
  },
  hero_cta_donate: { fr: "Faire un don solidaire", ar: "تبرع الآن" },
  hero_cta_events: { fr: "Voir nos actions sur le terrain", ar: "شاهد قوافلنا الميدانية" },

  // Stats
  stat_families: { fr: "Familles répertoriées & soutenues", ar: "عائلات محصاة ومدعومة" },
  stat_actions: { fr: "Caravanes & Actions déployées", ar: "قوافل وحملات ميدانية" },
  stat_volunteers: { fr: "Bénévoles mobilisés sur le terrain", ar: "متطوعون ناشطون في الميدان" },
  stat_cities: { fr: "Couverture territoriale", ar: "ولايات مشمولة بالتدخل" },

  // Tabs
  tab_upcoming: { fr: "À venir", ar: "القادمة" },
  tab_ongoing: { fr: "En cours", ar: "الجارية" },
  tab_completed: { fr: "Passés", ar: "المنجزة" },

  // Events
  event_details: { fr: "Détails", ar: "التفاصيل" },
  event_volunteers: { fr: "bénévoles mobilisés", ar: "متطوعين مسجلين" },
  event_full: { fr: "Complet", ar: "مكتمل" },
  event_register: { fr: "Devenir bénévole sur cette action", ar: "التطوع في هذه القافلة" },
  event_finance: { fr: "Financer cette action (Faire un don)", ar: "تمويل هذه المبادرة (تبرع)" },
  event_share: { fr: "Partager :", ar: "مشاركة :" },

  // Contact
  contact_title: { fr: "Contactez notre Équipe", ar: "تواصل مع فريقنا" },
  contact_subtitle: {
    fr: "Que vous souhaitiez signaler une famille en détresse, organiser une collecte ou devenir partenaire mécène, notre permanence est à votre entière disposition.",
    ar: "سواء أردت الإبلاغ عن عائلة محتاجة، تنظيم حملة تبرع أو الشراكة معنا، فريقنا على ذمتكم.",
  },
  contact_name: { fr: "Nom & Prénom", ar: "الاسم واللقب" },
  contact_email: { fr: "Adresse Email", ar: "البريد الإلكتروني" },
  contact_phone: { fr: "Téléphone mobile", ar: "الهاتف الجوال" },
  contact_subject: { fr: "Objet de votre demande", ar: "موضوع الرسالة" },
  contact_message: { fr: "Votre message détaillé", ar: "نص الرسالة" },
  contact_send: { fr: "Envoyer le message", ar: "إرسال الرسالة" },

  // Footer
  footer_desc: {
    fr: "Khawa Felkhir est une organisation caritative citoyenne tunisienne dédiée au soutien des familles démunies, à l'accès aux soins de santé et à la réussite scolaire des enfants.",
    ar: "خاوة في الخير جمعية خيرية تونسية مكرسة لدعم العائلات المعوزة وتوفير الرعاية الصحية ودعم تمدرس الأطفال.",
  },
  footer_copyright: {
    fr: "Tous droits réservés. Association reconnue d'utilité publique.",
    ar: "جميع الحقوق محفوظة. جمعية مرخص لها رسمياً.",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("khawa_lang") as Language | null;
    return saved === "ar" ? "ar" : "fr";
  });

  const isRtl = language === "ar";

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("lang", language);
    root.setAttribute("dir", isRtl ? "rtl" : "ltr");
    localStorage.setItem("khawa_lang", language);
  }, [language, isRtl]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "fr" ? "ar" : "fr"));
  };

  const t = (key: string, fallback?: string): string => {
    if (DICTIONARY[key]) {
      return DICTIONARY[key][language] || DICTIONARY[key].fr;
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
};
