import { Menu, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,

  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import logo from "../assets/images/logo.png";
import { ToggleDarkMode } from "./ToggleDarkMode";
import { Link } from "react-router-dom";
import LanguageSwitcher  from "@/components/LanguageSwitcher.tsx";
import { CoolMode } from "@/components/ui/cool-mode";


// @ts-ignore
const NavLink = ({ to, children, icon: Icon }) => (
  <Link
    to={to}
    className="text-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2"
  >
    {Icon && <Icon className="h-4 w-4" />}
    {children}
  </Link>
);

export default function AuthHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <nav className="flex-1 grid gap-2 text-lg font-medium">
        <CoolMode>
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <img alt="Logo" src={logo} className="h-6 w-6" />
          <span>AgriD</span>
        </Link>
        </CoolMode>
      </nav>


      <nav className="hidden md:flex flex-row gap-6 text-lg">
        <CoolMode>
        <Link
            to={"/"}
            className="text-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
          >Home
          </Link></CoolMode>

        <CoolMode>
        <Button  variant="outline">
          <NavLink to="/login" icon={LogIn}>Login</NavLink>
        </Button></CoolMode>


          <CoolMode>
        <Button >
          <NavLink to="/register" icon={UserPlus}>Register</NavLink>
        </Button></CoolMode>
      </nav>

        <LanguageSwitcher />
      <ToggleDarkMode />


      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Menu className="h-5 w-5"/>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="animate-slide-down ">
            <DropdownMenuItem className="ml-2" asChild>
             <Link
                to={"/"}
                className=" block text-foreground hover:text-primary transition-colors duration-200  items-center gap-2"
              >Home
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator/>

            <DropdownMenuItem asChild>
              <Button variant="outline" className="w-full mt-2 p-3">
                <NavLink  to="/login" icon={LogIn}>Login</NavLink>
              </Button>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Button className="w-full mt-2 p-3">
                <NavLink to="/register" icon={UserPlus}>Register</NavLink>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>


    </header>
  );
}
