import { BookOpen, MessageCircle, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: "clase", label: "La Clase", icon: BookOpen },
  { id: "asesor", label: "Mi Asesor", icon: MessageCircle },
  { id: "planeador", label: "Mi Planeador", icon: CalendarDays },
];

const Navbar = ({ activeTab, setActiveTab }: NavbarProps) => (
  <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 no-print">
    <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
      <span className="gradient-text font-display font-bold text-lg sm:text-xl">
        Secretos de Ventas
      </span>
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.id
                ? "gradient-bg text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  </nav>
);

export default Navbar;
