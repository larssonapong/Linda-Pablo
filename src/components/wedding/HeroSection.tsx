import { Heart } from "lucide-react";
import coverImage from "@/assets/cover-main.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-hero-pattern overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-cream/50" />
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 border border-primary/20 rounded-full animate-pulse-soft" />
      <div className="absolute bottom-20 right-10 w-24 h-24 border border-primary/15 rounded-full animate-float" />
      <div className="absolute top-1/4 right-1/4 w-16 h-16 border border-primary/10 rounded-full" />
      
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Cover Image / Faire-part */}
          <div className="relative mb-8 animate-fade-in">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-2xl" />
            <div className="relative w-72 h-auto md:w-96 rounded-2xl overflow-hidden shadow-card border-4 border-background">
              <img
                src={coverImage}
                alt="Faire-part officiel du mariage civil de Linda et Pablo"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-background rounded-full p-3 shadow-soft">
              <Heart className="w-6 h-6 text-primary fill-primary animate-pulse-soft" />
            </div>
          </div>
          
          {/* Names */}
          <div className="space-y-2 animate-fade-in-delay-1">
            <p className="text-muted-foreground font-serif text-lg tracking-[0.3em] uppercase">
              Nous nous marions
            </p>
            <h1 className="font-script text-6xl md:text-8xl lg:text-9xl text-primary">
              Linda & Pablo
            </h1>
          </div>
          
          {/* Quote */}
          <p className="mt-8 text-xl md:text-2xl font-serif italic text-muted-foreground max-w-xl animate-fade-in-delay-2">
            "Deux âmes, un cœur, un destin…"
          </p>
          
          {/* Event Type */}
          <div className="mt-10 animate-fade-in-delay-3">
            <span className="inline-block px-6 py-2 bg-primary/10 text-primary font-serif text-lg tracking-wider rounded-full">
              Mariage Civil
            </span>
          </div>
          
          {/* Date Highlight */}
          <div className="mt-12 flex flex-col items-center gap-4 animate-fade-in-delay-3">
            <div className="flex items-center gap-4 text-foreground">
              <div className="h-px w-12 bg-primary/30" />
              <span className="font-serif text-lg tracking-[0.2em] uppercase">Samedi</span>
              <div className="h-px w-12 bg-primary/30" />
            </div>
            <div className="text-5xl md:text-7xl font-serif font-light text-foreground">
              20
            </div>
            <div className="font-serif text-2xl tracking-[0.3em] uppercase text-primary">
              Décembre 2025
            </div>
            <div className="text-xl font-sans text-muted-foreground">
              à 13h00
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="mt-16 animate-float">
            <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-primary/50 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
