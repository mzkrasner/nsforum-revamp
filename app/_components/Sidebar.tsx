"use client";

import useCategories from "@/shared/hooks/useCategories";
import useSidebar from "@/shared/hooks/useSidebar";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const { isSidebarOpen } = useSidebar();
  const { categories } = useCategories();

  if (!isSidebarOpen) return null;

  return (
    <div className="container sticky top-10 mr-0 h-fit w-60 pr-5 pt-10">
      <div className="mb-2 flex items-center justify-start gap-5">
        <h3 className="font-medium">Categories</h3>
        <Link href="/categories" className="text-sm">
          <ArrowRightIcon size={16} />
        </Link>
      </div>
      <ul className="text-sm">
        {categories.map((category, i) => {
          const { name, stream_id } = category;
          return (
            <li key={i}>
              <Link
                href={`/categories/${stream_id}`}
                className="block h-8 leading-8"
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Sidebar;
