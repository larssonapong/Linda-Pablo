import { Calendar, Clock, MapPin, Users } from "lucide-react";

const EventDetails = () => {
  const details = [
    {
      icon: Calendar,
      label: "Date",
      value: "20 Décembre 2025",
      sublabel: "Samedi",
    },
    {
      icon: Clock,
      label: "Heure",
      value: "13h00",
      sublabel: "Merci d'arriver 15 min avant",
    },
    {
      icon: MapPin,
      label: "Lieu",
      value: "Olembe",
      sublabel: "Derrière les Brasseries",
    },
    {
      icon: Users,
      label: "Réception",
      value: "15h00",
      sublabel: "Après la cérémonie",
    },
  ];

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-script text-5xl md:text-6xl text-primary mb-4">
            Les Détails
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-primary/30" />
            <span className="text-muted-foreground font-serif">Notre jour spécial</span>
            <div className="h-px w-20 bg-primary/30" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {details.map((detail, index) => (
            <div
              key={detail.label}
              className="group bg-background rounded-2xl p-8 shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <detail.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm font-sans uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  {detail.label}
                </span>
                <span className="text-2xl font-serif text-foreground mb-1">
                  {detail.value}
                </span>
                <span className="text-sm text-muted-foreground font-sans">
                  {detail.sublabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
