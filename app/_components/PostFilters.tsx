import CategorySelector from "@/shared/components/CategorySelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const PostFilters = () => {
  return (
    <div className="flex items-center gap-3">
      <CategorySelector label="All categories" />
      <Select>
        <SelectTrigger className="h-9">
          <SelectValue placeholder="Sort by" className="mr-3" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Most Upvoted</SelectItem>
          <SelectItem value="2">Newest</SelectItem>
          <SelectItem value="3">Oldest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
export default PostFilters;
