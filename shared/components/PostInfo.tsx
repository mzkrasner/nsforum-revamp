import { BadgeCheckIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "./ui/button";

type Props = {};
const PostInfo = (props: Props) => {
  return (
    <div className="relative flex h-8 flex-row items-center gap-2 rounded-full p-1 text-xs text-gray-800 hover:bg-transparent">
      By
      <span className="inline-flex items-center gap-1 leading-none text-muted-foreground">
        john_doe
        <BadgeCheckIcon className="w-5 fill-gray-700 stroke-white" />
      </span>
      <span>1st Aug 2024</span>
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
