import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Quote, ChevronLeft, ChevronRight, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  content: string;
  avatar: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Dr. Selim Mansour",
    role: "Médecin bénévole partenaire",
    location: "Sidi Bouzid",
    content:
      "Participer à la caravane médicale avec Khawa Felkhir a été une expérience profondément humaine. L'organisation sur le terrain était irréprochable et nous avons pu soigner plus de 300 enfants en une seule journée.",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    id: "2",
    name: "Amina Khemiri",
    role: "Bénévole active depuis 2 ans",
    location: "Tunis",
    content:
      "Ce qui me touche chez Khawa Felkhir, c'est la transparence totale et le respect absolu de la dignité des familles. Chaque don se transforme directement en sourire sur le terrain.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    id: "3",
    name: "Yassine Ben Amor",
    role: "Directeur d'école rurale",
    location: "Kasserine",
    content:
      "La rénovation de notre école et la distribution de 500 cartables ont redonné espoir à tout notre village. Les élèves ont repris le chemin de l'école avec fierté et motivation.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    id: "4",
    name: "Leila Bouazizi",
    role: "Donatrice régulière",
    location: "Sousse",
    content:
      "Savoir exactement où vont mes contributions et recevoir les bilans de chaque action me donne une confiance absolue. C'est l'association de référence pour la solidarité en Tunisie.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
];

export const TestimonialsCarousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <div className="relative max-w-5xl mx-auto px-4">
      {/* Conteneur Embla */}
      <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
        <div className="flex -ml-4">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="flex-[0_0_100%] md:flex-[0_0_50%] min-w-0 pl-4 py-2"
            >
              <div className="h-full flex flex-col justify-between p-8 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-primary/20" />
                  </div>

                  <p className="text-sm md:text-base text-foreground/90 italic leading-relaxed">
                    « {t.content} »
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-border/60">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      {t.name}
                      <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {t.role} • <span className="text-foreground/70">{t.location}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation et Indicateurs */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={scrollPrev}
          className="rounded-full h-10 w-10 border-border bg-card hover:bg-muted text-foreground"
          aria-label="Témoignage précédent"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-2">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => emblaApi?.scrollTo(idx)}
              aria-label={`Aller au témoignage ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                selectedIndex === idx ? "w-8 bg-primary" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={scrollNext}
          className="rounded-full h-10 w-10 border-border bg-card hover:bg-muted text-foreground"
          aria-label="Témoignage suivant"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
