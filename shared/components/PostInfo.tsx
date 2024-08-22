import { ExternalLinkIcon } from "lucide-react";
import DateDisplay from "./DateDisplay";
import { Button } from "./ui/button";
import User from "./User";

type Props = { post: any };
const PostInfo = ({ post }: Props) => {
  const { indexed_at, controller } = post;
  return (
    <div className="relative flex h-8 flex-row items-center gap-2 rounded-full p-1 text-xs text-gray-800 hover:bg-transparent">
      <span>By</span>
      <User did={controller} />
      <DateDisplay dateString={indexed_at} />
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
