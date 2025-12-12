import { useEffect, useState } from "react";
import { Users, CheckCircle, XCircle, Clock, MessageSquare, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  totalGuests: number;
  confirmed: number;
  declined: number;
  pending: number;
  totalAdults: number;
  totalChildren: number;
  guestbookMessages: number;
  responseRate: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalGuests: 0,
    confirmed: 0,
    declined: 0,
    pending: 0,
    totalAdults: 0,
    totalChildren: 0,
    guestbookMessages: 0,
    responseRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();

    // Subscribe to realtime changes
    const guestsChannel = supabase
      .channel("admin-guests")
      .on("postgres_changes", { event: "*", schema: "public", table: "guests" }, fetchStats)
      .on("postgres_changes", { event: "*", schema: "public", table: "rsvp_responses" }, fetchStats)
      .on("postgres_changes", { event: "*", schema: "public", table: "guestbook_messages" }, fetchStats)
      .subscribe();

    return () => {
      supabase.removeChannel(guestsChannel);
    };
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch all guests
      const { data: guests, error: guestsError } = await supabase
        .from("guests")
        .select("id");

      if (guestsError) throw guestsError;

      // Fetch all RSVP responses
      const { data: responses, error: responsesError } = await supabase
        .from("rsvp_responses")
        .select("*");

      if (responsesError) throw responsesError;

      // Fetch guestbook messages count
      const { count: messagesCount, error: messagesError } = await supabase
        .from("guestbook_messages")
        .select("*", { count: "exact", head: true });

      if (messagesError) throw messagesError;

      const totalGuests = guests?.length || 0;
      const confirmed = responses?.filter((r) => r.is_attending).length || 0;
      const declined = responses?.filter((r) => !r.is_attending).length || 0;
      const pending = totalGuests - (confirmed + declined);
      
      const totalAdults = responses
        ?.filter((r) => r.is_attending)
        .reduce((sum, r) => sum + (r.num_adults || 0), 0) || 0;
      
      const totalChildren = responses
        ?.filter((r) => r.is_attending)
        .reduce((sum, r) => sum + (r.num_children || 0), 0) || 0;

      const responseRate = totalGuests > 0 
        ? Math.round(((confirmed + declined) / totalGuests) * 100) 
        : 0;

      setStats({
        totalGuests,
        confirmed,
        declined,
        pending,
        totalAdults,
        totalChildren,
        guestbookMessages: messagesCount || 0,
        responseRate,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Invités",
      value: stats.totalGuests,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Confirmés",
      value: stats.confirmed,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Déclinés",
      value: stats.declined,
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-100",
    },
    {
      title: "En attente",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Messages",
      value: stats.guestbookMessages,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Taux de réponse",
      value: `${stats.responseRate}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-foreground mb-2">Tableau de bord</h1>
        <p className="text-muted-foreground font-sans">Vue d'ensemble de votre mariage</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-background rounded-2xl p-6 shadow-soft hover:shadow-card transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-sans">{stat.title}</p>
                <p className={`text-2xl font-serif ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Summary */}
      <div className="bg-background rounded-2xl p-6 shadow-soft">
        <h2 className="text-xl font-serif text-foreground mb-4">Résumé des présences confirmées</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-cream rounded-xl p-4 text-center">
            <p className="text-3xl font-serif text-primary">{stats.totalAdults}</p>
            <p className="text-sm text-muted-foreground font-sans">Adultes</p>
          </div>
          <div className="bg-cream rounded-xl p-4 text-center">
            <p className="text-3xl font-serif text-primary">{stats.totalChildren}</p>
            <p className="text-sm text-muted-foreground font-sans">Enfants</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border text-center">
          <p className="text-lg font-serif text-foreground">
            Total attendu : <span className="text-primary font-bold">{stats.totalAdults + stats.totalChildren}</span> personnes
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
