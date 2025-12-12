import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Trash2, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GuestbookMessage {
  id: string;
  author_name: string;
  message: string;
  is_approved: boolean;
  created_at: string;
  guest_id: string | null;
}

const GuestbookModeration = () => {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("guestbook-moderation")
      .on("postgres_changes", { event: "*", schema: "public", table: "guestbook_messages" }, fetchMessages)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("guestbook_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data || []);
    }
    setIsLoading(false);
  };

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from("guestbook_messages")
      .update({ is_approved: true })
      .eq("id", id);

    if (error) {
      toast.error("Erreur lors de l'approbation");
    } else {
      toast.success("Message approuvé");
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from("guestbook_messages")
      .update({ is_approved: false })
      .eq("id", id);

    if (error) {
      toast.error("Erreur lors du rejet");
    } else {
      toast.success("Message rejeté");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce message définitivement ?")) return;

    const { error } = await supabase
      .from("guestbook_messages")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erreur lors de la suppression");
    } else {
      toast.success("Message supprimé");
    }
  };

  const handleExport = () => {
    const headers = ["Auteur", "Message", "Statut", "Date"];
    const csvContent = [
      headers.join(","),
      ...messages.map((m) => [
        `"${m.author_name}"`,
        `"${m.message.replace(/"/g, '""')}"`,
        m.is_approved ? "Approuvé" : "En attente",
        new Date(m.created_at).toLocaleDateString("fr-FR"),
      ].join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "livre_or_linda_pablo.csv";
    link.click();
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === "all") return true;
    if (filter === "pending") return !msg.is_approved;
    if (filter === "approved") return msg.is_approved;
    return true;
  });

  const counts = {
    all: messages.length,
    pending: messages.filter((m) => !m.is_approved).length,
    approved: messages.filter((m) => m.is_approved).length,
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground mb-2">Livre d'or</h1>
          <p className="text-muted-foreground font-sans">Modération des messages</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "all", label: "Tous", count: counts.all },
          { id: "pending", label: "En attente", count: counts.pending },
          { id: "approved", label: "Approuvés", count: counts.approved },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as typeof filter)}
            className={`px-4 py-2 rounded-xl font-sans text-sm transition-all ${
              filter === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-background rounded-2xl p-8 text-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="bg-background rounded-2xl p-8 text-center text-muted-foreground font-sans">
            Aucun message
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-background rounded-2xl p-6 shadow-soft transition-all ${
                !msg.is_approved ? "border-l-4 border-amber-400" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-serif text-lg">
                    {msg.author_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-foreground">{msg.author_name}</span>
                      {msg.is_approved ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-sans bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3" />
                          Approuvé
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-sans bg-amber-100 text-amber-700">
                          <Clock className="w-3 h-3" />
                          En attente
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground font-sans">
                      {new Date(msg.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  <p className="text-muted-foreground font-sans leading-relaxed mb-4">
                    {msg.message}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!msg.is_approved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(msg.id)}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approuver
                      </Button>
                    )}
                    {msg.is_approved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(msg.id)}
                        className="text-amber-600 border-amber-200 hover:bg-amber-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Masquer
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(msg.id)}
                      className="text-destructive border-destructive/20 hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GuestbookModeration;
