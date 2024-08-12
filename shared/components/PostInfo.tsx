import { CeramicDocument } from "@useorbis/db-sdk";
import { format } from "date-fns";
import { BadgeCheckIcon, ExternalLinkIcon } from "lucide-react";
import { Post } from "../schema/post";
import { Button } from "./ui/button";

type Props = { post: Post & CeramicDocument["content"] };
const PostInfo = ({ post }: Props) => {
  const { indexed_at } = post;
  let formattedDate;
  if (indexed_at) formattedDate = format(new Date(indexed_at), "do MMM yyyy");
  return (
    <div className="relative flex h-8 flex-row items-center gap-2 rounded-full p-1 text-xs text-gray-800 hover:bg-transparent">
      By
      <span className="inline-flex items-center gap-1 leading-none text-muted-foreground">
        john_doe
        <BadgeCheckIcon className="w-5 fill-gray-700 stroke-white" />
      </span>
      <span>{formattedDate}</span>
      <Button
        variant="ghost"
        size="sm"
        className="ml-auto inline-flex h-8 items-center gap-1.5 text-xs"
      >
        Proof <ExternalLinkIcon className="w-4" />
      </Button>
    </div>
  );
};
export default PostInfo;
