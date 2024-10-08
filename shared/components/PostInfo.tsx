import { ExternalLinkIcon } from "lucide-react";
import useCategories from "../hooks/useCategories";
import { OrbisDBRow } from "../types";
import { Post } from "../types/post";
import CategoryDisplay from "./CategoryDisplay";
import DateDisplay from "./DateDisplay";
import UserDisplay from "./UserDisplay";
import { Button } from "./ui/button";

type Props = { post: OrbisDBRow<Post> };
const PostInfo = ({ post }: Props) => {
  const {
    indexed_at,
    controller,
    category: categoryId,
    author_username,
    stream_id,
  } = post;
  const { categories } = useCategories();
  const category = categories.find((c) => c.stream_id === categoryId);

  return (
    <div className="relative flex min-h-8 flex-row flex-wrap items-center gap-2 rounded-full p-1 text-xs text-gray-800 hover:bg-transparent">
      <UserDisplay did={controller} placeholder={author_username} />
      {category && (
        <>
          <span className="text-neutral-400">in</span>{" "}
          <CategoryDisplay category={category} />
        </>
      )}
      <span className="text-neutral-400">on</span>
      <DateDisplay dateString={indexed_at} />
      <Button
        variant="ghost"
        size="sm"
        className="ml-auto inline-flex h-8 items-center gap-1.5 px-3 text-xs"
        asChild
      >
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://cerscan.com/mainnet/stream/${stream_id}`}
        >
          Proof <ExternalLinkIcon className="w-4" />
        </a>
      </Button>
    </div>
  );
};
export default PostInfo;
