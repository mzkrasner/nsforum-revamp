import CategoryFilters from "@/shared/components/CategoryFilters";
import CategoryList from "@/shared/components/CategoryList";
import PageHeading from "@/shared/components/PageHeading";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

const CategoriesPage = () => {
  return (
    <>
      <PageHeading className="container">Categories</PageHeading>
      <div className="mb-10 md:grid md:grid-cols-[1fr_320px]">
        <section className="container">
          <div className="mb-5 flex items-center justify-between">
            <CategoryFilters />
            <Button size="sm" asChild>
              <Link href="/categories/suggest">Suggest Category</Link>
            </Button>
          </div>
          <CategoryList />
        </section>
      </div>
    </>
  );
};
export default CategoriesPage;
