"use client";

import CustomBreadcrumb from "@/shared/components/CustomBreadcrumb";
import PageHeading from "@/shared/components/PageHeading";
import TagList from "@/shared/components/TagList";

const breadcrumbItems = [
  {
    name: "Admin",
    href: "/admin",
  },
  {
    name: "Tags",
    active: true,
  },
];

const AdminTagsPage = () => {
  return (
    <div className="container">
      <CustomBreadcrumb items={breadcrumbItems} />
      <PageHeading className="mt-5">Admin Tags</PageHeading>
      <section className="max-w-[600px]">
        <TagList />
      </section>
    </div>
  );
};
export default AdminTagsPage;
