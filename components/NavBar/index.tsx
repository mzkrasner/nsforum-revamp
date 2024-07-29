import Notifications from "./components/Notifications";
import Search from "./components/Search";
import User from "./components/User";

const NavBar = () => {
  return (
    <div className="flex h-20 w-full items-center">
      <div className="container flex h-full items-center">
        <h1 className="text-nowrap text-lg font-semibold">
          <span className="hidden md:inline">Network Society Forum</span>
        </h1>
        <nav className="ml-20 flex h-full w-full items-center justify-end gap-3">
          <Search />
          <User />
          <Notifications />
        </nav>
      </div>
    </div>
  );
};
export default NavBar;
