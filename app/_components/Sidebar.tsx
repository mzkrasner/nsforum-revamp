"use client";

import { useMediaQuery } from "@/shared/components/ui/hooks/use-media-query";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import useCategories from "@/shared/hooks/useCategories";
import useSidebar from "@/shared/hooks/useSidebar";
import Link from "next/link";

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const { categories } = useCategories();
  const isMobile = !useMediaQuery("(min-width: 640px)");

  if (!isSidebarOpen) return null;

  const closeSidebar = () => setIsSidebarOpen(false);
  return (
    <>
      <div
        className="fixed top-20 z-10 h-[calc(100vh_-_80px)] w-full bg-black/10 sm:hidden"
        onClick={closeSidebar}
      ></div>
      <div className="container fixed left-0 top-20 z-10 mr-0 flex h-[calc(100vh_-_80px)] w-60 flex-col justify-end bg-white py-1 pr-1 text-sm sm:sticky sm:min-h-[unset] sm:pr-5 md:justify-start">
        <ScrollArea>
          <div className="mt-1 py-2">
            <Link href="/" className="link" onClick={closeSidebar}>
              Home
            </Link>
          </div>
          <div className="flex items-center justify-start gap-5 py-2">
            <Link
              href="/categories"
              className="link"
              onClick={() => isMobile && closeSidebar()}
            >
              Categories
            </Link>
          </div>
          <ul className="mb-5 space-y-1 pb-10 pl-2 text-[13px]">
            {categories.map((category, i) => {
              const { name, stream_id } = category;
              return (
                <li key={i}>
                  <Link
                    href={`/categories/${stream_id}`}
                    className="link block py-1"
                    onClick={closeSidebar}
                  >
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </div>
    </>
  );
};
export default Sidebar;
