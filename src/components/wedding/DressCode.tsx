import { Shirt, Sparkles } from "lucide-react";

const DressCode = () => {
  const colors = [
    { name: "Orange Brûlé", color: "bg-primary", textColor: "text-primary-foreground" },
    { name: "Blanc", color: "bg-white border-2 border-border", textColor: "text-foreground" },
    { name: "Crème", color: "bg-cream-dark", textColor: "text-foreground" },
    { name: "Or", color: "bg-gold", textColor: "text-foreground" },
  ];

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-script text-5xl md:text-6xl text-primary mb-4">
            Dress Code
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-primary/30" />
            <span className="text-muted-foreground font-serif">Chic & Élégant</span>
            <div className="h-px w-20 bg-primary/30" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-background rounded-3xl p-8 md:p-12 shadow-card">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shirt className="w-12 h-12 text-primary" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-serif text-foreground mb-4 flex items-center justify-center md:justify-start gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Style recommandé
                </h3>
                <p className="text-muted-foreground font-sans leading-relaxed mb-6">
                  Nous vous invitons à nous rejoindre dans une tenue{" "}
                  <span className="text-primary font-medium">chic et élégante</span>.
                  Laissez-vous inspirer par les teintes chaleureuses de notre thème
                  pour créer une harmonie visuelle parfaite.
                </p>

                {/* Color Palette */}
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
                    Palette de couleurs suggérée
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    {colors.map((color) => (
                      <div key={color.name} className="flex flex-col items-center gap-2">
                        <div
                          className={`w-12 h-12 rounded-full ${color.color} shadow-soft`}
                        />
                        <span className="text-xs font-sans text-muted-foreground">
                          {color.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <p className="text-sm font-sans text-muted-foreground italic">
                    💍 Note : Merci d'éviter le blanc total pour laisser la mariée
                    se distinguer avec éclat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DressCode;
