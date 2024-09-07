import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import Link from "next/link";
import { cn } from "../lib/utils";
import { Category } from "../types/category";

type Props = { category: Category; className?: string };
const CategoryCard = ({ category, className }: Props) => {
  const { name, description } = category;
  return (
    <Link href="/categories/1" className="inline-block">
      <Card className={cn(className, "cursor-pointer hover:bg-neutral-50")}>
        <CardHeader className="p-3">
          <CardTitle className="text-base font-semibold">{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default CategoryCard;
