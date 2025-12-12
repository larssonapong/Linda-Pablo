import { Gift, Phone, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const Contributions = () => {
  const [copiedMTN, setCopiedMTN] = useState(false);
  const [copiedOrange, setCopiedOrange] = useState(false);

  const paymentMethods = [
    {
      name: "MTN Mobile Money",
      number: "+237 651 273 508",
      color: "bg-yellow-500",
      icon: "📱",
    },
    {
      name: "Orange Money",
      number: "+237 691 809 122",
      color: "bg-orange-500",
      icon: "📲",
    },
  ];

  const copyToClipboard = (text: string, type: "mtn" | "orange") => {
    navigator.clipboard.writeText(text);
    if (type === "mtn") {
      setCopiedMTN(true);
      setTimeout(() => setCopiedMTN(false), 2000);
    } else {
      setCopiedOrange(true);
      setTimeout(() => setCopiedOrange(false), 2000);
    }
    toast.success("Numéro copié !");
  };

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-script text-5xl md:text-6xl text-primary mb-4">
            Contribuer à notre union
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-primary/30" />
            <span className="text-muted-foreground font-serif">Un geste qui compte</span>
            <div className="h-px w-20 bg-primary/30" />
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-background rounded-3xl p-8 md:p-12 shadow-card">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Gift className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-serif text-foreground">
                  Votre soutien nous touche
                </h3>
                <p className="text-muted-foreground font-sans">
                  Votre présence est notre plus beau cadeau
                </p>
              </div>
            </div>

            {/* Message */}
            <div className="p-6 bg-cream rounded-2xl mb-8">
              <p className="text-muted-foreground font-sans leading-relaxed">
                Chers invités, votre présence à nos côtés en ce jour spécial est le plus
                beau des cadeaux. Cependant, si vous souhaitez contribuer à notre nouvelle
                vie ensemble, vous pouvez le faire via les moyens ci-dessous.
                <span className="block mt-2 text-primary font-medium">
                  Chaque geste, petit ou grand, nous touche profondément. 💕
                </span>
              </p>
            </div>

            {/* Payment Methods */}
            <div className="grid sm:grid-cols-2 gap-4">
              {paymentMethods.map((method, index) => (
                <div
                  key={method.name}
                  className="p-6 rounded-2xl border-2 border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{method.icon}</span>
                    <span className="font-serif text-lg text-foreground">
                      {method.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-foreground">{method.number}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          method.number,
                          index === 0 ? "mtn" : "orange"
                        )
                      }
                      className="ml-auto"
                    >
                      {(index === 0 ? copiedMTN : copiedOrange) ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Note */}
            <p className="mt-8 text-center text-sm text-muted-foreground font-sans italic">
              N'oubliez pas d'indiquer votre nom lors du transfert pour que nous puissions vous remercier personnellement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contributions;
