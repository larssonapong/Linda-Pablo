import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const LocationMap = () => {
  const openGoogleMaps = () => {
    window.open(
      "https://www.google.com/maps/search/Olembe+Brasseries+Yaound%C3%A9+Cameroun",
      "_blank"
    );
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-script text-5xl md:text-6xl text-primary mb-4">
            Localisation
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-primary/30" />
            <span className="text-muted-foreground font-serif">Comment nous rejoindre</span>
            <div className="h-px w-20 bg-primary/30" />
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-cream rounded-3xl overflow-hidden shadow-card">
            <div className="grid md:grid-cols-2">
              {/* Map Embed */}
              <div className="h-64 md:h-auto min-h-[300px] bg-muted relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15919.066682246477!2d11.49!3d3.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf0c8b8c8b8b%3A0x8b8b8b8b8b8b8b8b!2sOlembe%2C%20Yaound%C3%A9!5e0!3m2!1sfr!2scm!4v1699999999999!5m2!1sfr!2scm"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
              </div>

              {/* Location Details */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-foreground mb-2">
                      Lieu de la cérémonie
                    </h3>
                    <p className="text-lg text-primary font-serif">
                      Olembe, Yaoundé
                    </p>
                    <p className="text-muted-foreground font-sans">
                      Derrière les Brasseries du Cameroun
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="p-4 bg-background rounded-xl">
                    <p className="text-sm font-sans text-muted-foreground">
                      <span className="font-medium text-foreground">Repère :</span>{" "}
                      200 mètres après les brasseries.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="wedding"
                    size="lg"
                    onClick={openGoogleMaps}
                    className="flex-1"
                  >
                    <Navigation className="w-5 h-5" />
                    Voir l'itinéraire
                  </Button>
                  <Button
                    variant="weddingOutline"
                    size="lg"
                    onClick={openGoogleMaps}
                    className="flex-1"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Ouvrir Maps
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
