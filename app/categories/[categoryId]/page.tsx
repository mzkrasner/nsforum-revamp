"use client";

import CustomBreadcrumb from "@/shared/components/CustomBreadcrumb";
import PageHeading from "@/shared/components/PageHeading";
import { useParams } from "next/navigation";
import CategoryForm from "../_components/CategoryForm";

const breadcrumbItems = [
  {
    name: "Categories",
    href: "/categories",
  },
  {
    name: "Edit Category",
    active: true,
  },
];

const AdminCategoryPage = () => {
  const params = useParams();
  const categoryId = params.categoryId as string;

  return (
    <div className="container mx-auto flex max-w-[640px] flex-1 flex-col pb-10">
      <CustomBreadcrumb items={breadcrumbItems} />
      <PageHeading className="mt-5">Edit Category</PageHeading>
      <CategoryForm id={categoryId} />
    </div>
  );
};
export default AdminCategoryPage;
