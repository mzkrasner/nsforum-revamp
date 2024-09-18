import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { OrbisDBRow } from "@/shared/types";
import { Category } from "@/shared/types/category";
import { EditIcon } from "lucide-react";
import Link from "next/link";

type Props = { category: OrbisDBRow<Category>; className?: string };
const AdminCategoryCard = ({ category, className }: Props) => {
  const { name, description, stream_id } = category;
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="p-3">
        <CardTitle className="text-base font-semibold">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto justify-end gap-2 p-3">
        <Button
          size="sm"
          variant="outline"
          className="gap-2 px-2 text-sm"
          asChild
        >
          <Link href={`/admin/categories/${stream_id}`}>
            <EditIcon size={14} />
            Edit
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminCategoryCard;
