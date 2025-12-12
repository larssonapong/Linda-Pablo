import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import tradImage from "@/assets/trad-01.jpg";
import heartImage from "@/assets/heart-02.jpg";
import kissImage from "@/assets/kiss-03.jpg";
import intimateImage from "@/assets/intimate-04.jpg";
import whiteImage from "@/assets/white-05.jpg";

const PhotoGallery = () => {
  const photos = [
    {
      id: "trad-01",
      src: tradImage,
      alt: "Notre avenir commence ici, main dans la main, avec l’envie profonde de vieillir ensemble.",
    },
    {
      id: "heart-02",
      src: heartImage,
      alt: "Deux âmes, un destin : aujourd’hui nous choisissons de marcher côte à côte pour la vie.",
    },
    {
      id: "kiss-03",
      src: kissImage,
      alt: "Nous avons trouvé en l’autre un refuge, un sourire, une maison… et l’envie d’écrire une histoire sans fin.",
    },
    {
      id: "intimate-04",
      src: intimateImage,
      alt: "Ce mariage n’est pas une promesse d’un jour, mais le début d’un toujours.",
    },
    {
      id: "white-05",
      src: whiteImage,
      alt: "Avec toi, chaque moment prend sens. Ensemble, nous voulons transformer les années en éternité.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-script text-5xl md:text-6xl text-primary mb-4">
            Notre Histoire
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-primary/30" />
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <div className="h-px w-20 bg-primary/30" />
          </div>
        </div>

        {/* Main Gallery */}
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          <div className="relative mb-8">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card">
              <img
                src={photos[currentIndex].src}
                alt={photos[currentIndex].alt}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              
              {/* Navigation Buttons */}
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-background transition-colors"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="w-6 h-6 text-primary" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-background transition-colors"
                aria-label="Photo suivante"
              >
                <ChevronRight className="w-6 h-6 text-primary" />
              </button>
              
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-foreground/80 to-transparent">
                <p className="text-background font-serif text-lg text-center">
                  {photos[currentIndex].alt}
                </p>
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex justify-center gap-3">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                  index === currentIndex
                    ? "ring-4 ring-primary ring-offset-2 ring-offset-cream scale-110"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;
