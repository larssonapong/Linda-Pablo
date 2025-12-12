import { Heart, LayoutDashboard, Users, ClipboardList, MessageSquare, LogOut, Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

type AdminView = "dashboard" | "guests" | "rsvp" | "guestbook";

interface AdminSidebarProps {
  currentView: AdminView;
  onViewChange: (view: AdminView) => void;
  onSignOut: () => void;
  userEmail?: string;
}

const menuItems = [
  { id: "dashboard" as AdminView, title: "Tableau de bord", icon: LayoutDashboard },
  { id: "guests" as AdminView, title: "Gestion des invités", icon: Users },
  { id: "rsvp" as AdminView, title: "Suivi RSVP", icon: ClipboardList },
  { id: "guestbook" as AdminView, title: "Livre d'or", icon: MessageSquare },
];

const AdminSidebar = ({ currentView, onViewChange, onSignOut, userEmail }: AdminSidebarProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <>
      {/* Mobile trigger */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <SidebarTrigger className="bg-background shadow-md rounded-lg p-2">
          <Menu className="w-5 h-5" />
        </SidebarTrigger>
      </div>

      <Sidebar className="border-r border-border bg-background">
        <SidebarContent className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              {!isCollapsed && (
                <div>
                  <h2 className="font-script text-xl text-primary">Linda & Pablo</h2>
                  <p className="text-xs text-muted-foreground font-sans">Administration</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <SidebarGroup className="flex-1 py-4">
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onViewChange(item.id)}
                      className={`w-full justify-start gap-3 px-4 py-3 rounded-xl transition-all ${
                        currentView === item.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {!isCollapsed && <span className="font-sans">{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            {!isCollapsed && userEmail && (
              <p className="text-xs text-muted-foreground font-sans mb-3 truncate">
                {userEmail}
              </p>
            )}
            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all font-sans"
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span>Déconnexion</span>}
            </button>
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default AdminSidebar;
