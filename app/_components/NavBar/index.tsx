"use client";

import { Button } from "@/shared/components/ui/button";
import useSidebar from "@/shared/hooks/useSidebar";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import NavUser from "./components/NavUser";
import Notifications from "./components/Notifications";
import Search from "./components/Search";

const NavBar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <div className="flex h-20 w-full items-center">
      <div className="container flex h-full items-center justify-between gap-5">
        <div className="relative -left-4 flex items-center gap-2 pl-4">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (
              <XIcon size={18} strokeWidth={1.4} />
            ) : (
              <MenuIcon size={18} strokeWidth={1.4} />
            )}
          </Button>
          <h1>
            <Link
              href="/"
              className="flex items-center gap-2 text-nowrap text-lg font-semibold"
            >
              <span>NS</span>
              <span className="hidden md:inline">Network Society Forum</span>
            </Link>
          </h1>
        </div>
        <nav className="flex h-full w-full items-center justify-end gap-3">
          <Search />
          <Notifications />
          <NavUser />
        </nav>
      </div>
    </div>
  );
};
export default NavBar;
