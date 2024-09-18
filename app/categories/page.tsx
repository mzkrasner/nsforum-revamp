// import CategoryFilters from "@/shared/components/CategoryFilters";
import CategoryList from "@/shared/components/CategoryList";
import CustomBreadcrumb from "@/shared/components/CustomBreadcrumb";
import PageHeading from "@/shared/components/PageHeading";
import { Button } from "@/shared/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Categories",
};

const breadcrumbItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Categories",
    active: true,
  },
];
const CategoriesPage = () => {
  return (
    <div className="container">
      <div className="mx-auto mb-10 max-w-2xl">
        <CustomBreadcrumb items={breadcrumbItems} />
        <PageHeading>Categories</PageHeading>
        <section>
          <div className="mb-5 ml-auto flex items-end gap-5 xs:ml-0 xs:flex-row xs:justify-between">
            {/* <CategoryFilters /> */}
            <Button size="sm" className="ml-auto" asChild>
              <Link href="/categories/suggest">Suggest Category</Link>
            </Button>
          </div>
          <CategoryList />
        </section>
      </div>
    </div>
  );
};
export default CategoriesPage;
