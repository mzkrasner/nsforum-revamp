"use client";

import { Button } from "@/shared/components/ui/button";
import useSidebar from "@/shared/hooks/useSidebar";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import logo from "../../../public/logo.jpg";
import LoginSelector from "../../../shared/components/silkLogin";
// import Notifications from "./components/Notifications";
import Image from "next/image";
import Search from "./components/Search";

const NavBar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <div className="fixed left-0 top-0 z-20 flex h-20 w-full items-center border-b border-neutral-300 bg-white">
      <div className="container mx-0 flex h-full max-w-[unset] items-center justify-between gap-3">
        <div className="relative -left-4 flex items-center gap-2 pl-4">
          <Button
            size="icon"
            variant="secondary"
            className="mr-2 h-8 w-8 min-w-8"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (
              <ArrowLeftIcon size={18} strokeWidth={1.4} />
            ) : (
              <MenuIcon size={18} strokeWidth={1.4} />
            )}
          </Button>
          <h1>
            <Link
              href="/"
              className="flex items-center gap-2 text-nowrap text-lg font-semibold"
            >
              <Image
                src={logo}
                width={32}
                height={32}
                className="inline-block min-h-7 min-w-7"
                alt="logo"
              />
              <span className="hidden md:inline">PoSciDonDAO Forum</span>
            </Link>
          </h1>
        </div>
        <nav className="flex h-full w-full items-center justify-end gap-3">
          <Search />
          {/* <Notifications /> */}
          <LoginSelector />
        </nav>
      </div>
    </div>
  );
};
export default NavBar;
