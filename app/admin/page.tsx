import CustomBreadcrumb from "@/shared/components/CustomBreadcrumb";
import PageHeading from "@/shared/components/PageHeading";
import { Card, CardContent } from "@/shared/components/ui/card";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const breadcrumbItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Admin",
    active: true,
  },
];

const links = [
  { display: "Tags", href: "/admin/tags" },
  { display: "Categories", href: "/admin/categories" },
];

const AdminPage = () => {
  return (
    <div className="container">
      <div className="mx-auto mb-10 max-w-2xl">
        <CustomBreadcrumb items={breadcrumbItems} />
        <PageHeading>Admin</PageHeading>
        <section className="grid grid-cols-2 gap-3">
          {links.map(({ display, href }, i) => {
            return (
              <Link key={i} href={href} className="clock">
                <Card>
                  <CardContent className="flex items-center justify-between p-3">
                    {display}{" "}
                    <ArrowRightIcon size={16} className="text-neutral-500" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
};
export default AdminPage;
