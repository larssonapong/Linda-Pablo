import { Circle, Heart } from "lucide-react";

const ProgramTimeline = () => {
  const events = [
    {
      time: "12h45",
      title: "Accueil des invités",
      description: "Installation et retrouvailles",
    },
    {
      time: "13h00",
      title: "Cérémonie civile",
      description: "Échange des vœux et des alliances",
      highlight: true,
    },
    {
      time: "14h00",
      title: "Séance photos",
      description: "Moments de joie immortalisés",
    },
    {
      time: "15h00",
      title: "Réception",
      description: "Célébration et convivialité",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-script text-5xl md:text-6xl text-primary mb-4">
            Programme
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-primary/30" />
            <span className="text-muted-foreground font-serif">Le déroulé de la journée</span>
            <div className="h-px w-20 bg-primary/30" />
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />

            <div className="space-y-8">
              {events.map((event, index) => (
                <div
                  key={event.time}
                  className={`relative flex gap-8 ${
                    event.highlight ? "scale-[1.02]" : ""
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        event.highlight
                          ? "bg-primary shadow-glow"
                          : "bg-cream border-2 border-primary/30"
                      }`}
                    >
                      {event.highlight ? (
                        <Heart className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
                      ) : (
                        <Circle className="w-3 h-3 text-primary fill-primary" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 pb-8 ${
                      event.highlight
                        ? "bg-primary/5 -ml-4 pl-8 pr-6 py-6 rounded-2xl"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                      <span
                        className={`text-2xl font-serif ${
                          event.highlight ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {event.time}
                      </span>
                      <div className="hidden md:block h-px w-8 bg-primary/30" />
                      <h3
                        className={`text-xl font-serif ${
                          event.highlight
                            ? "text-primary font-medium"
                            : "text-foreground"
                        }`}
                      >
                        {event.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground font-sans">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramTimeline;
