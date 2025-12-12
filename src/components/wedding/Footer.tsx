import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Names */}
          <h2 className="font-script text-4xl md:text-5xl text-primary-light mb-4">
            Linda & Pablo
          </h2>

          {/* Date */}
          <p className="font-serif text-lg text-background/80 mb-6">
            20 Décembre 2025
          </p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-primary/30" />
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <div className="h-px w-16 bg-primary/30" />
          </div>

          {/* Quote */}
          <p className="font-serif italic text-background/70 max-w-md mx-auto mb-8">
            "L'amour ne se voit pas avec les yeux, mais avec l'âme."
          </p>

          {/* Hashtag */}
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-primary/20 text-primary-light font-sans text-sm tracking-wider rounded-full">
              #LindaEtPablo2025
            </span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-background/50 font-sans">
            © 2025 Linda & Pablo. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
