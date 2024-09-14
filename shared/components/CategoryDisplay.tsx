import Link from "next/link";
import { OrbisDBRow } from "../types";
import { Category } from "../types/category";

type Props = { category: OrbisDBRow<Category> };
const CategoryDisplay = ({ category }: Props) => {
  const { stream_id } = category || {};
  return (
    <Link href={`/categories/${stream_id}`} className="link">
      {category.name}
    </Link>
  );
};
export default CategoryDisplay;
