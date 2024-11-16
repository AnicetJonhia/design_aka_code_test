import { NavLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// @ts-ignore
export default function SidebarNavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
          isActive ? "bg-primary " : "text-muted-foreground hover:text-primary"
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {label}

    </NavLink>
  );
}
