import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminDashboard from "@/components/admin/AdminDashboard";
import GuestManagement from "@/components/admin/GuestManagement";
import RsvpTracking from "@/components/admin/RsvpTracking";
import GuestbookModeration from "@/components/admin/GuestbookModeration";
import { SidebarProvider } from "@/components/ui/sidebar";

type AdminView = "dashboard" | "guests" | "rsvp" | "guestbook";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/admin/login");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (!isLoading && user && !isAdmin) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <AdminDashboard />;
      case "guests":
        return <GuestManagement />;
      case "rsvp":
        return <RsvpTracking />;
      case "guestbook":
        return <GuestbookModeration />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-cream">
        <AdminSidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          onSignOut={handleSignOut}
          userEmail={user.email}
        />
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
