import { useState, useEffect } from "react";
import { Check, X, Users, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface RsvpResponse {
  is_attending: boolean;
  num_adults: number;
  num_children: number;
  remarks: string | null;
}

interface RSVPSectionProps {
  guestId?: string;
  guestName?: string;
  existingResponse?: RsvpResponse | null;
  onSubmit?: (
    isAttending: boolean,
    numAdults: number,
    numChildren: number,
    remarks: string
  ) => Promise<{ error?: string; success?: boolean }>;
}

const RSVPSection = ({
  guestId,
  guestName,
  existingResponse,
  onSubmit,
}: RSVPSectionProps) => {
  const [response, setResponse] = useState<"yes" | "no" | null>(null);
  const [guests, setGuests] = useState(1);
  const [children, setChildren] = useState(0);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Pre-fill form if there's an existing response
  useEffect(() => {
    if (existingResponse) {
      setResponse(existingResponse.is_attending ? "yes" : "no");
      setGuests(existingResponse.num_adults);
      setChildren(existingResponse.num_children);
      setMessage(existingResponse.remarks || "");
      setIsSubmitted(true);
    }
  }, [existingResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!response) return;

    setIsSubmitting(true);

    if (onSubmit) {
      const result = await onSubmit(
        response === "yes",
        guests,
        children,
        message
      );
      if (result.error) {
        toast.error(result.error);
      } else {
        setIsSubmitted(true);
        toast.success(
          response === "yes"
            ? "Merci ! Nous avons hâte de vous voir !"
            : "Merci de nous avoir informés. Vous nous manquerez !"
        );
      }
    } else {
      // Demo mode
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      toast.success(
        response === "yes"
          ? "Merci ! Nous avons hâte de vous voir !"
          : "Merci de nous avoir informés. Vous nous manquerez !"
      );
    }

    setIsSubmitting(false);
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-background rounded-3xl p-12 shadow-card">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-primary" />
              </div>
              <h2 className="font-script text-4xl text-primary mb-4">
                Réponse enregistrée !
              </h2>
              <p className="text-muted-foreground font-sans text-lg mb-6">
                {response === "yes"
                  ? "Nous avons hâte de célébrer ce jour spécial avec vous !"
                  : "Nous comprenons et vous remercions de nous avoir prévenus."}
              </p>
              {guestId && (
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Modifier ma réponse
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-script text-5xl md:text-6xl text-primary mb-4">
            Confirmez votre présence
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-primary/30" />
            <span className="text-muted-foreground font-serif">RSVP</span>
            <div className="h-px w-20 bg-primary/30" />
          </div>
          {guestName && (
            <p className="mt-4 text-lg font-serif text-foreground">
              Bonjour {guestName} !
            </p>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-background rounded-3xl p-8 md:p-12 shadow-card">
            {/* Response Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                type="button"
                onClick={() => setResponse("yes")}
                className={`flex-1 p-6 rounded-2xl border-2 transition-all duration-300 ${
                  response === "yes"
                    ? "border-primary bg-primary/10 shadow-soft"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      response === "yes" ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <Check
                      className={`w-6 h-6 ${
                        response === "yes"
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-lg font-serif ${
                      response === "yes" ? "text-primary" : "text-foreground"
                    }`}
                  >
                    Je participe
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setResponse("no")}
                className={`flex-1 p-6 rounded-2xl border-2 transition-all duration-300 ${
                  response === "no"
                    ? "border-muted-foreground bg-muted/50"
                    : "border-border hover:border-muted-foreground/50"
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      response === "no" ? "bg-muted-foreground" : "bg-muted"
                    }`}
                  >
                    <X
                      className={`w-6 h-6 ${
                        response === "no"
                          ? "text-background"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-lg font-serif ${
                      response === "no"
                        ? "text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    Je ne peux pas venir
                  </span>
                </div>
              </button>
            </div>

            {/* Form Fields */}
            {response && (
              <form
                onSubmit={handleSubmit}
                className="space-y-6 animate-fade-in"
              >
                {response === "yes" && (
                  <>
                    {/* Guest Count */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-sans text-muted-foreground mb-2">
                          <Users className="w-4 h-4 inline mr-2" />
                          Adultes
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            className="w-10 h-10 rounded-full border-2 border-border hover:border-primary text-foreground font-sans transition-colors"
                          >
                            -
                          </button>
                          <span className="w-10 text-center text-xl font-serif">
                            {guests}
                          </span>
                          <button
                            type="button"
                            onClick={() => setGuests(Math.min(10, guests + 1))}
                            className="w-10 h-10 rounded-full border-2 border-border hover:border-primary text-foreground font-sans transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-sans text-muted-foreground mb-2">
                          Enfants
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setChildren(Math.max(0, children - 1))
                            }
                            className="w-10 h-10 rounded-full border-2 border-border hover:border-primary text-foreground font-sans transition-colors"
                          >
                            -
                          </button>
                          <span className="w-10 text-center text-xl font-serif">
                            {children}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setChildren(Math.min(10, children + 1))
                            }
                            className="w-10 h-10 rounded-full border-2 border-border hover:border-primary text-foreground font-sans transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Message */}
                <div>
                  <label className="block text-sm font-sans text-muted-foreground mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Remarques (allergies, contraintes, etc.)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrivez vos remarques ici..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-sans placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="wedding"
                  size="xl"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Confirmer ma réponse
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RSVPSection;
