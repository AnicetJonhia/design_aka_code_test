import {NavLink} from "react-router-dom";

// @ts-ignore
function HeaderNavItem({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all ${
          isActive ? "bg-primary " : "text-muted-foreground hover:text-primary"
        }`
      }
    >
      <Icon className="h-5 w-5" />
      {label}

    </NavLink>
  );
}



export default HeaderNavItem;
