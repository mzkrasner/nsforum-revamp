"use client";

import CustomBreadcrumb from "@/shared/components/CustomBreadcrumb";
import PageHeading from "@/shared/components/PageHeading";
import CategoryForm from "../_components/CategoryForm";

const breadcrumbItems = [
  {
    name: "Categories",
    href: "/categories",
  },
  {
    name: "New Category",
    active: true,
  },
];

const NewCategoryPage = () => {
  return (
    <div className="container mx-auto flex max-w-[640px] flex-1 flex-col pb-10">
      <CustomBreadcrumb items={breadcrumbItems} />
      <PageHeading className="mt-5">New Category</PageHeading>
      <CategoryForm />
    </div>
  );
};
export default NewCategoryPage;
