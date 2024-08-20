import { format } from "date-fns";
import { BadgeCheckIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "./ui/button";
import useUser from "../hooks/useUser";
import User from "./User";

type Props = { post: any };
const PostInfo = ({ post }: Props) => {
  const { indexed_at, controller } = post;

  let formattedDate;
  if (indexed_at) formattedDate = format(new Date(indexed_at), "do MMM yyyy");
  return (
    <div className="relative flex h-8 flex-row items-center gap-2 rounded-full p-1 text-xs text-gray-800 hover:bg-transparent">
      By
      <User did={controller} />
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
