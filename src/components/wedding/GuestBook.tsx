import { useState, useEffect } from "react";
import { Heart, MessageCircle, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GuestBookMessage {
  id: string;
  author_name: string;
  message: string;
  created_at: string;
}

interface GuestBookProps {
  guestId?: string;
  guestName?: string;
}

const GuestBook = ({ guestId, guestName }: GuestBookProps) => {
  const [name, setName] = useState(guestName || "");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<GuestBookMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pre-fill name if guest is identified
  useEffect(() => {
    if (guestName) {
      setName(guestName);
    }
  }, [guestName]);

  // Fetch approved messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("guestbook_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data || []);
      }
      setIsLoading(false);
    };

    fetchMessages();

    // Subscribe to new approved messages
    const channel = supabase
      .channel("guestbook-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "guestbook_messages",
          filter: "is_approved=eq.true",
        },
        (payload) => {
          setMessages((prev) => [payload.new as GuestBookMessage, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !message.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("guestbook_messages").insert({
      guest_id: guestId || null,
      author_name: name.trim(),
      message: message.trim(),
      is_approved: false,
    });

    if (error) {
      console.error("Error submitting message:", error);
      toast.error("Erreur lors de l'envoi du message");
    } else {
      setMessage("");
      toast.success("Merci ! Votre message apparaîtra après validation.");
    }

    setIsSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-script text-5xl md:text-6xl text-primary mb-4">
            Livre d'Or
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-primary/30" />
            <span className="text-muted-foreground font-serif">
              Vos messages de félicitations
            </span>
            <div className="h-px w-20 bg-primary/30" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Message Form */}
          <div className="bg-cream rounded-3xl p-8 md:p-10 shadow-card mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-serif text-foreground">
                Laissez un message aux mariés
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-sans text-muted-foreground mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Votre nom
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Prénom et nom"
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-sans placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-sans text-muted-foreground mb-2">
                  <Heart className="w-4 h-4 inline mr-2" />
                  Votre message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écrivez vos félicitations..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-sans placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="wedding"
                size="lg"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer mon message
                  </>
                )}
              </Button>
            </form>

            <p className="mt-4 text-sm text-muted-foreground font-sans italic">
              Votre message apparaîtra après validation par les mariés.
            </p>
          </div>

          {/* Messages Display */}
          <div className="space-y-6">
            <h3 className="text-lg font-serif text-foreground text-center mb-8">
              Messages récents
            </h3>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-center text-muted-foreground font-sans py-8">
                Soyez le premier à laisser un message !
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-cream rounded-2xl p-6 shadow-soft hover:shadow-card transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-serif text-lg">
                        {msg.author_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif text-foreground">
                          {msg.author_name}
                        </span>
                        <span className="text-xs text-muted-foreground font-sans">
                          {formatDate(msg.created_at)}
                        </span>
                      </div>
                      <p className="text-muted-foreground font-sans leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuestBook;
