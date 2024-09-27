import { Tag } from "../types/tag";
import { Button } from "./ui/button";

type Props = { tags: Tag[] };
const PostTags = ({ tags }: Props) => {
  if (!tags.length) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {tags.map(({ name }, i) => (
        <li key={i}>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-5 h-7 px-2 text-xs"
          >
            {name}
          </Button>
        </li>
      ))}
    </ul>
  );
};
export default PostTags;
