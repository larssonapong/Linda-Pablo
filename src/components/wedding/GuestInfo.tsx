import { QRCodeSVG } from "qrcode.react";
import { User, Hash, Users, CheckCircle, Clock, XCircle } from "lucide-react";

interface Guest {
  id: string;
  invitation_code: string;
  first_name: string;
  last_name: string;
  num_adults: number;
  num_children: number;
}

interface RsvpResponse {
  is_attending: boolean;
  num_adults: number;
  num_children: number;
}

interface GuestInfoProps {
  guest: Guest;
  rsvpResponse: RsvpResponse | null;
}

const GuestInfo = ({ guest, rsvpResponse }: GuestInfoProps) => {
  const qrValue = `${window.location.origin}?i=${guest.invitation_code}`;

  const getStatusDisplay = () => {
    if (!rsvpResponse) {
      return {
        icon: Clock,
        text: "En attente de réponse",
        className: "text-amber-600 bg-amber-50",
      };
    }
    if (rsvpResponse.is_attending) {
      return {
        icon: CheckCircle,
        text: "Confirmé",
        className: "text-green-600 bg-green-50",
      };
    }
    return {
      icon: XCircle,
      text: "Ne participera pas",
      className: "text-muted-foreground bg-muted",
    };
  };

  const status = getStatusDisplay();
  const StatusIcon = status.icon;

  return (
    <section className="py-12 bg-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-background rounded-3xl p-8 shadow-card border-2 border-primary/20">
            <div className="text-center mb-6">
              <h3 className="font-script text-3xl text-primary mb-2">
                Vos informations
              </h3>
              <div className="h-px w-32 bg-primary/30 mx-auto" />
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Guest Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-cream rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-sans uppercase tracking-wider">
                      Invité
                    </p>
                    <p className="text-lg font-serif text-foreground">
                      {guest.first_name} {guest.last_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-cream rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-sans uppercase tracking-wider">
                      Nombre de personnes
                    </p>
                    <p className="text-lg font-serif text-foreground">
                      {rsvpResponse
                        ? `${rsvpResponse.num_adults} adulte(s), ${rsvpResponse.num_children} enfant(s)`
                        : `${guest.num_adults} adulte(s), ${guest.num_children} enfant(s)`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-cream rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Hash className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-sans uppercase tracking-wider">
                      Code d'invitation
                    </p>
                    <p className="text-lg font-mono text-foreground tracking-wider">
                      {guest.invitation_code}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center gap-2 p-4 rounded-xl ${status.className}`}>
                  <StatusIcon className="w-5 h-5" />
                  <span className="font-sans font-medium">{status.text}</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center gap-4">
                <div className="bg-background p-4 rounded-2xl shadow-soft border border-border">
                  <QRCodeSVG
                    value={qrValue}
                    size={160}
                    level="H"
                    includeMargin
                    bgColor="#FFFFFF"
                    fgColor="#2d2a26"
                  />
                </div>
                <p className="text-sm text-muted-foreground font-sans text-center">
                  Présentez ce QR code le jour J
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuestInfo;
