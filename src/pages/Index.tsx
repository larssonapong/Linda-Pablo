import { Helmet } from "react-helmet";
import HeroSection from "@/components/wedding/HeroSection";
import EventDetails from "@/components/wedding/EventDetails";
import PhotoGallery from "@/components/wedding/PhotoGallery";
import ProgramTimeline from "@/components/wedding/ProgramTimeline";
import DressCode from "@/components/wedding/DressCode";
import LocationMap from "@/components/wedding/LocationMap";
import RSVPSection from "@/components/wedding/RSVPSection";
import GuestBook from "@/components/wedding/GuestBook";
import Contributions from "@/components/wedding/Contributions";
import Footer from "@/components/wedding/Footer";
import GuestInfo from "@/components/wedding/GuestInfo";
import { useGuest } from "@/hooks/useGuest";

const Index = () => {
  const { guest, rsvpResponse, isLoading, error, submitRsvp, hasInvitationCode } = useGuest();

  if (isLoading && hasInvitationCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-serif">Chargement de votre invitation...</p>
        </div>
      </div>
    );
  }

  if (error && hasInvitationCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="font-script text-4xl text-primary mb-4">Oups !</h1>
          <p className="text-muted-foreground font-serif mb-6">{error}</p>
          <a
            href="/"
            className="text-primary underline hover:no-underline font-sans"
          >
            Voir l'invitation générale
          </a>
        </div>
      </div>
    );
  }

  const guestName = guest ? `${guest.first_name}` : undefined;
  const guestFullName = guest ? `${guest.first_name} ${guest.last_name}` : undefined;

  return (
    <>
      <Helmet>
        <title>Mariage de Linda & Pablo | 20 Décembre 2025</title>
        <meta
          name="description"
          content="Vous êtes cordialement invités au mariage civil de Linda et Pablo. Rejoignez-nous le 20 décembre 2025 à Olembe pour célébrer notre union."
        />
        <meta property="og:title" content="Mariage de Linda & Pablo" />
        <meta
          property="og:description"
          content="Célébrons l'amour ! Rejoignez-nous le 20 décembre 2025 pour notre mariage civil."
        />
        <meta property="og:type" content="website" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="min-h-screen">
        <HeroSection />
        
        {/* Show guest info with QR code if guest is identified */}
        {guest && <GuestInfo guest={guest} rsvpResponse={rsvpResponse} />}
        
        <EventDetails />
        <PhotoGallery />
        <ProgramTimeline />
        <DressCode />
        <LocationMap />
        
        <RSVPSection
          guestId={guest?.id}
          guestName={guestName}
          existingResponse={rsvpResponse}
          onSubmit={guest ? submitRsvp : undefined}
        />
        
        <GuestBook guestId={guest?.id} guestName={guestFullName} />
        <Contributions />
        <Footer />
      </main>
    </>
  );
};

export default Index;
