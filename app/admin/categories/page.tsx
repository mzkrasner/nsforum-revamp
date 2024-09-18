"use client";

// import CategoryFilters from "@/shared/components/CategoryFilters";
import CategoryList from "@/shared/components/CategoryList";
import CustomBreadcrumb from "@/shared/components/CustomBreadcrumb";
import PageHeading from "@/shared/components/PageHeading";
import { Button } from "@/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import Link from "next/link";
import AdminCategoryCard from "./_components/AdminCategoryCard";
import CategorySuggestionList from "./_components/CategorySuggestionList";

const breadcrumbItems = [
  {
    name: "Admin",
    href: "/admin",
  },
  {
    name: "Categories",
    active: true,
  },
];

const AdminCategoriesPage = () => {
  return (
    <div className="container">
      <CustomBreadcrumb items={breadcrumbItems} />
      <PageHeading className="mt-5">Admin Categories</PageHeading>
      <section className="max-w-[600px]">
        <Tabs className="mb-5" defaultValue="categories">
          <TabsList className="mb-3">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="pending-suggestions">
              Pending suggestions
            </TabsTrigger>
            <TabsTrigger value="rejected-suggestions">
              Rejected suggestions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="categories">
            <div className="mb-5 flex items-center justify-between">
              {/* <CategoryFilters /> */}
              <Button size="sm" className="ml-auto" asChild>
                <Link href="/admin/categories/new">Create Category</Link>
              </Button>
            </div>
            <CategoryList
              renderCategory={(c) => <AdminCategoryCard category={c} />}
            />
          </TabsContent>
          <TabsContent value="pending-suggestions">
            {/* Add a searchbar */}
            <CategorySuggestionList
              fetchOptions={{ filter: { status: "pending" } }}
            />
          </TabsContent>
          <TabsContent value="rejected-suggestions">
            {/* Add a searchbar */}
            <CategorySuggestionList
              fetchOptions={{ filter: { status: "rejected" } }}
            />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};
export default AdminCategoriesPage;
