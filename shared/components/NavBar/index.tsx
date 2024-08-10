import { MenuIcon } from "lucide-react";
import { Button } from "../ui/button";
import Notifications from "./components/Notifications";
import Search from "./components/Search";
import User from "./components/User";

const NavBar = () => {
  return (
    <div className="flex h-20 w-full items-center">
      <div className="container flex h-full items-center justify-between gap-5">
        <div className="relative -left-4 flex items-center gap-2">
          <Button size="sm" variant="ghost">
            <MenuIcon strokeWidth={1.4} />
          </Button>
          <h1 className="flex items-center gap-2 text-nowrap text-lg font-semibold">
            <span>NS</span>
            <span className="hidden md:inline">Network Society Forum</span>
          </h1>
        </div>
        <nav className="flex h-full w-full items-center justify-end gap-3">
          <Search />
          <Notifications />
          <User />
        </nav>
      </div>
    </div>
  );
};
export default NavBar;
