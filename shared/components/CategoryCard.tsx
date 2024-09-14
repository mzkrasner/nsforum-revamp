import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import Link from "next/link";
import { cn } from "../lib/utils";
import { OrbisDBRow } from "../types";
import { Category } from "../types/category";

type Props = { category: OrbisDBRow<Category>; className?: string };
const CategoryCard = ({ category, className }: Props) => {
  const { name, description, stream_id } = category;
  return (
    <Link href={`/categories/${stream_id}`} className="block h-full">
      <Card
        className={cn(className, "h-full cursor-pointer hover:bg-neutral-50")}
      >
        <CardHeader className="p-3">
          <CardTitle className="text-base font-semibold">{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default CategoryCard;
