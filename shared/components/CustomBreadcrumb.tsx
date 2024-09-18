import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import Link from "next/link";
import { Fragment } from "react";

type Props = { items: { name: string; href?: string; active?: boolean }[] };
const CustomBreadcrumb = ({ items }: Props) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map(({ name, href, active = false }, i) => {
          let content = active ? <BreadcrumbPage>{name}</BreadcrumbPage> : name;
          if (href)
            content = (
              <Link className="link" href={href}>
                {content}
              </Link>
            );
          return (
            <Fragment key={i}>
              <BreadcrumbItem>{content}</BreadcrumbItem>
              {i < items.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
export default CustomBreadcrumb;
