import { useEffect, useState } from "react";
import { Plus, Upload, Download, Trash2, Edit2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Guest {
  id: string;
  invitation_code: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  category: string | null;
  num_adults: number;
  num_children: number;
}

const GuestManagement = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  useEffect(() => {
    fetchGuests();

    const channel = supabase
      .channel("admin-guests-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "guests" }, fetchGuests)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchGuests = async () => {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching guests:", error);
      toast.error("Erreur lors du chargement des invités");
    } else {
      setGuests(data || []);
    }
    setIsLoading(false);
  };

  const generateInvitationCode = () => {
    const prefix = "LP";
    const number = String(guests.length + 1).padStart(3, "0");
    return `${prefix}${number}`;
  };

  const handleAddGuest = async (guestData: Partial<Guest>) => {
    const { error } = await supabase.from("guests").insert({
      invitation_code: guestData.invitation_code || generateInvitationCode(),
      first_name: guestData.first_name,
      last_name: guestData.last_name,
      phone: guestData.phone || null,
      email: guestData.email || null,
      category: guestData.category || "friend",
      num_adults: guestData.num_adults || 1,
      num_children: guestData.num_children || 0,
    });

    if (error) {
      console.error("Error adding guest:", error);
      toast.error("Erreur lors de l'ajout de l'invité");
    } else {
      toast.success("Invité ajouté avec succès");
      setShowAddModal(false);
    }
  };

  const handleUpdateGuest = async (guestData: Partial<Guest>) => {
    if (!editingGuest) return;

    const { error } = await supabase
      .from("guests")
      .update({
        first_name: guestData.first_name,
        last_name: guestData.last_name,
        phone: guestData.phone || null,
        email: guestData.email || null,
        category: guestData.category,
        num_adults: guestData.num_adults,
        num_children: guestData.num_children,
      })
      .eq("id", editingGuest.id);

    if (error) {
      console.error("Error updating guest:", error);
      toast.error("Erreur lors de la mise à jour");
    } else {
      toast.success("Invité mis à jour");
      setEditingGuest(null);
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet invité ?")) return;

    const { error } = await supabase.from("guests").delete().eq("id", id);

    if (error) {
      console.error("Error deleting guest:", error);
      toast.error("Erreur lors de la suppression");
    } else {
      toast.success("Invité supprimé");
    }
  };

  const handleCSVImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim());
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

      const guestsToAdd = [];
      let codeCounter = guests.length;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        const guest: Partial<Guest> = {};

        headers.forEach((header, index) => {
          const value = values[index];
          if (header.includes("prénom") || header.includes("prenom") || header === "first_name") {
            guest.first_name = value;
          } else if (header.includes("nom") || header === "last_name") {
            guest.last_name = value;
          } else if (header.includes("phone") || header.includes("téléphone") || header.includes("telephone")) {
            guest.phone = value;
          } else if (header.includes("email")) {
            guest.email = value;
          } else if (header.includes("catégorie") || header.includes("categorie") || header === "category") {
            guest.category = value;
          } else if (header.includes("code")) {
            guest.invitation_code = value;
          }
        });

        if (guest.first_name && guest.last_name) {
          codeCounter++;
          if (!guest.invitation_code) {
            guest.invitation_code = `LP${String(codeCounter).padStart(3, "0")}`;
          }
          guest.num_adults = 1;
          guest.num_children = 0;
          guestsToAdd.push(guest);
        }
      }

      if (guestsToAdd.length > 0) {
        const { error } = await supabase.from("guests").insert(guestsToAdd);
        if (error) {
          console.error("Error importing guests:", error);
          toast.error("Erreur lors de l'import");
        } else {
          toast.success(`${guestsToAdd.length} invités importés`);
        }
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  const handleCSVExport = () => {
    const headers = ["Code", "Prénom", "Nom", "Téléphone", "Email", "Catégorie", "Adultes", "Enfants"];
    const csvContent = [
      headers.join(","),
      ...guests.map((g) =>
        [
          g.invitation_code,
          g.first_name,
          g.last_name,
          g.phone || "",
          g.email || "",
          g.category || "",
          g.num_adults,
          g.num_children,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "invites_linda_pablo.csv";
    link.click();
  };

  const filteredGuests = guests.filter(
    (g) =>
      g.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.invitation_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground mb-2">Gestion des invités</h1>
          <p className="text-muted-foreground font-sans">{guests.length} invités au total</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
          <label>
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </span>
            </Button>
            <input type="file" accept=".csv" className="hidden" onChange={handleCSVImport} />
          </label>
          <Button variant="outline" size="sm" onClick={handleCSVExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un invité..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-sans placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Guest List */}
      <div className="bg-background rounded-2xl shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground font-sans">
            {searchTerm ? "Aucun invité trouvé" : "Aucun invité pour le moment"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                    Catégorie
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-cream/50 transition-colors">
                    <td className="px-4 py-4 font-mono text-sm text-primary">
                      {guest.invitation_code}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-serif text-foreground">
                        {guest.first_name} {guest.last_name}
                      </p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="text-sm text-muted-foreground font-sans">
                        {guest.phone || guest.email || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans bg-primary/10 text-primary capitalize">
                        {guest.category || "ami"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingGuest(guest)}
                          className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGuest(guest.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingGuest) && (
        <GuestModal
          guest={editingGuest}
          onClose={() => {
            setShowAddModal(false);
            setEditingGuest(null);
          }}
          onSave={editingGuest ? handleUpdateGuest : handleAddGuest}
          defaultCode={generateInvitationCode()}
        />
      )}
    </div>
  );
};

interface GuestModalProps {
  guest: Guest | null;
  onClose: () => void;
  onSave: (data: Partial<Guest>) => void;
  defaultCode: string;
}

const GuestModal = ({ guest, onClose, onSave, defaultCode }: GuestModalProps) => {
  const [formData, setFormData] = useState({
    invitation_code: guest?.invitation_code || defaultCode,
    first_name: guest?.first_name || "",
    last_name: guest?.last_name || "",
    phone: guest?.phone || "",
    email: guest?.email || "",
    category: guest?.category || "friend",
    num_adults: guest?.num_adults || 1,
    num_children: guest?.num_children || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name) {
      toast.error("Prénom et nom requis");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif text-foreground">
            {guest ? "Modifier l'invité" : "Ajouter un invité"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!guest && (
            <div>
              <label className="block text-sm font-sans text-muted-foreground mb-1">
                Code d'invitation
              </label>
              <input
                type="text"
                value={formData.invitation_code}
                onChange={(e) => setFormData({ ...formData, invitation_code: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border-2 border-border bg-background font-mono"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-sans text-muted-foreground mb-1">
                Prénom *
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border-2 border-border bg-background"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-sans text-muted-foreground mb-1">
                Nom *
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border-2 border-border bg-background"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-sans text-muted-foreground mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border-2 border-border bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-sans text-muted-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border-2 border-border bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-sans text-muted-foreground mb-1">
              Catégorie
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border-2 border-border bg-background"
            >
              <option value="family">Famille</option>
              <option value="friend">Ami</option>
              <option value="colleague">Collègue</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-sans text-muted-foreground mb-1">
                Adultes
              </label>
              <input
                type="number"
                min="1"
                value={formData.num_adults}
                onChange={(e) => setFormData({ ...formData, num_adults: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 rounded-xl border-2 border-border bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-sans text-muted-foreground mb-1">
                Enfants
              </label>
              <input
                type="number"
                min="0"
                value={formData.num_children}
                onChange={(e) => setFormData({ ...formData, num_children: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 rounded-xl border-2 border-border bg-background"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" variant="wedding" className="flex-1">
              {guest ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestManagement;
