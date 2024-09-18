"use client";

import useCategories from "@/shared/hooks/useCategories";
import useSidebar from "@/shared/hooks/useSidebar";
import Link from "next/link";

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const { categories } = useCategories();

  if (!isSidebarOpen) return null;

  return (
    <>
      <div
        className="fixed top-20 z-10 h-[calc(100vh_-_80px)] w-full bg-black/10 sm:hidden"
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <div className="container fixed left-0 top-20 z-10 mr-0 flex h-fit min-h-[calc(100vh_-_80px)] w-60 flex-col justify-end bg-white py-10 pr-5 text-sm sm:sticky sm:top-24 sm:min-h-[unset] md:justify-start md:pb-0">
        <div className="py-2">
          <Link href="/" className="link">
            Home
          </Link>
        </div>
        <div className="flex items-center justify-start gap-5 py-2">
          <Link href="/categories" className="link">
            Categories
          </Link>
        </div>
        <ul className="space-y-1 pl-2 text-[13px]">
          {categories.map((category, i) => {
            const { name, stream_id } = category;
            return (
              <li key={i}>
                <Link
                  href={`/categories/${stream_id}`}
                  className="link block py-1"
                >
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
export default Sidebar;
