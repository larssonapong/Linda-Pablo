import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

interface RsvpResponse {
  id: string;
  guest_id: string;
  is_attending: boolean;
  num_adults: number;
  num_children: number;
  remarks: string | null;
  responded_at: string;
}

export const useGuest = () => {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [rsvpResponse, setRsvpResponse] = useState<RsvpResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuest = async () => {
      // Get invitation code from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const invitationCode = urlParams.get("i");

      if (!invitationCode) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch guest by invitation code
        const { data: guestData, error: guestError } = await supabase
          .from("guests")
          .select("*")
          .eq("invitation_code", invitationCode)
          .maybeSingle();

        if (guestError) throw guestError;

        if (guestData) {
          setGuest(guestData);

          // Fetch RSVP response if exists
          const { data: rsvpData, error: rsvpError } = await supabase
            .from("rsvp_responses")
            .select("*")
            .eq("guest_id", guestData.id)
            .maybeSingle();

          if (rsvpError) throw rsvpError;
          if (rsvpData) setRsvpResponse(rsvpData);
        } else {
          setError("Code d'invitation invalide");
        }
      } catch (err) {
        console.error("Error fetching guest:", err);
        setError("Erreur lors de la récupération des données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuest();
  }, []);

  const submitRsvp = async (
    isAttending: boolean,
    numAdults: number,
    numChildren: number,
    remarks: string
  ) => {
    if (!guest) return { error: "Invité non trouvé" };

    try {
      if (rsvpResponse) {
        // Update existing RSVP
        const { data, error } = await supabase
          .from("rsvp_responses")
          .update({
            is_attending: isAttending,
            num_adults: numAdults,
            num_children: numChildren,
            remarks: remarks || null,
            responded_at: new Date().toISOString(),
          })
          .eq("guest_id", guest.id)
          .select()
          .single();

        if (error) throw error;
        setRsvpResponse(data);
      } else {
        // Create new RSVP
        const { data, error } = await supabase
          .from("rsvp_responses")
          .insert({
            guest_id: guest.id,
            is_attending: isAttending,
            num_adults: numAdults,
            num_children: numChildren,
            remarks: remarks || null,
          })
          .select()
          .single();

        if (error) throw error;
        setRsvpResponse(data);
      }

      return { success: true };
    } catch (err) {
      console.error("Error submitting RSVP:", err);
      return { error: "Erreur lors de l'envoi de votre réponse" };
    }
  };

  return {
    guest,
    rsvpResponse,
    isLoading,
    error,
    submitRsvp,
    hasInvitationCode: !!new URLSearchParams(window.location.search).get("i"),
  };
};
