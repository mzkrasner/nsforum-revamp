import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type Props = {};
const CategoryFilters = (props: Props) => {
  return (
    <div className="flex items-center gap-3">
      <Select>
        <SelectTrigger className="h-9">
          <SelectValue placeholder="Sort by" className="mr-3" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2">Alphabetical order</SelectItem>
          <SelectItem value="1">Number of posts</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
export default CategoryFilters;
