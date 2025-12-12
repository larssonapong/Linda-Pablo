import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Users, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface GuestWithRsvp {
  id: string;
  invitation_code: string;
  first_name: string;
  last_name: string;
  category: string | null;
  rsvp?: {
    is_attending: boolean;
    num_adults: number;
    num_children: number;
    remarks: string | null;
    responded_at: string;
  };
}

const RsvpTracking = () => {
  const [guests, setGuests] = useState<GuestWithRsvp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "confirmed" | "declined" | "pending">("all");

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("rsvp-tracking")
      .on("postgres_changes", { event: "*", schema: "public", table: "guests" }, fetchData)
      .on("postgres_changes", { event: "*", schema: "public", table: "rsvp_responses" }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    const { data: guestsData, error: guestsError } = await supabase
      .from("guests")
      .select("*")
      .order("created_at", { ascending: false });

    if (guestsError) {
      console.error("Error fetching guests:", guestsError);
      return;
    }

    const { data: rsvpData, error: rsvpError } = await supabase
      .from("rsvp_responses")
      .select("*");

    if (rsvpError) {
      console.error("Error fetching RSVPs:", rsvpError);
      return;
    }

    const rsvpMap = new Map(rsvpData?.map((r) => [r.guest_id, r]));

    const guestsWithRsvp = guestsData?.map((guest) => ({
      ...guest,
      rsvp: rsvpMap.get(guest.id),
    })) || [];

    setGuests(guestsWithRsvp);
    setIsLoading(false);
  };

  const filteredGuests = guests.filter((guest) => {
    if (filter === "all") return true;
    if (filter === "confirmed") return guest.rsvp?.is_attending === true;
    if (filter === "declined") return guest.rsvp?.is_attending === false;
    if (filter === "pending") return !guest.rsvp;
    return true;
  });

  const handleExport = () => {
    const headers = ["Code", "Nom", "Catégorie", "Statut", "Adultes", "Enfants", "Remarques", "Date réponse"];
    const csvContent = [
      headers.join(","),
      ...guests.map((g) => {
        const status = !g.rsvp ? "En attente" : g.rsvp.is_attending ? "Confirmé" : "Décliné";
        return [
          g.invitation_code,
          `${g.first_name} ${g.last_name}`,
          g.category || "",
          status,
          g.rsvp?.num_adults || "",
          g.rsvp?.num_children || "",
          `"${g.rsvp?.remarks || ""}"`,
          g.rsvp?.responded_at ? new Date(g.rsvp.responded_at).toLocaleDateString("fr-FR") : "",
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "rsvp_linda_pablo.csv";
    link.click();
  };

  const getStatusIcon = (guest: GuestWithRsvp) => {
    if (!guest.rsvp) {
      return <Clock className="w-5 h-5 text-amber-600" />;
    }
    if (guest.rsvp.is_attending) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusText = (guest: GuestWithRsvp) => {
    if (!guest.rsvp) return "En attente";
    return guest.rsvp.is_attending ? "Confirmé" : "Décliné";
  };

  const counts = {
    all: guests.length,
    confirmed: guests.filter((g) => g.rsvp?.is_attending === true).length,
    declined: guests.filter((g) => g.rsvp?.is_attending === false).length,
    pending: guests.filter((g) => !g.rsvp).length,
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground mb-2">Suivi RSVP</h1>
          <p className="text-muted-foreground font-sans">Réponses en temps réel</p>
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
          { id: "confirmed", label: "Confirmés", count: counts.confirmed },
          { id: "declined", label: "Déclinés", count: counts.declined },
          { id: "pending", label: "En attente", count: counts.pending },
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

      {/* RSVP List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-background rounded-2xl p-8 text-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="bg-background rounded-2xl p-8 text-center text-muted-foreground font-sans">
            Aucun invité dans cette catégorie
          </div>
        ) : (
          filteredGuests.map((guest) => (
            <div
              key={guest.id}
              className="bg-background rounded-2xl p-6 shadow-soft hover:shadow-card transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center flex-shrink-0">
                  {getStatusIcon(guest)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div>
                      <p className="font-serif text-foreground">
                        {guest.first_name} {guest.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {guest.invitation_code}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-sans ${
                        !guest.rsvp
                          ? "bg-amber-100 text-amber-700"
                          : guest.rsvp.is_attending
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {getStatusText(guest)}
                    </span>
                  </div>

                  {guest.rsvp && guest.rsvp.is_attending && (
                    <div className="flex items-center gap-4 text-sm text-muted-foreground font-sans mt-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {guest.rsvp.num_adults} adulte(s), {guest.rsvp.num_children} enfant(s)
                      </span>
                    </div>
                  )}

                  {guest.rsvp?.remarks && (
                    <p className="mt-2 text-sm text-muted-foreground font-sans italic bg-cream rounded-lg p-3">
                      "{guest.rsvp.remarks}"
                    </p>
                  )}

                  {guest.rsvp?.responded_at && (
                    <p className="mt-2 text-xs text-muted-foreground font-sans">
                      Répondu le {new Date(guest.rsvp.responded_at).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RsvpTracking;
