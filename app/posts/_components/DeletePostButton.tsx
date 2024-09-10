import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import usePost from "../_hooks/usePost";

type Props = { postId: string };
const DeletePostButton = ({ postId }: Props) => {
  const [open, setOpen] = useState(false);

  const { deletePostMutation } = usePost();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="inline-flex h-7 w-7 items-center px-0 text-neutral-500"
        >
          <TrashIcon size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this post?</DialogTitle>
          <DialogDescription>
            This will not truly delete your post but will hide it from the
            forum.
          </DialogDescription>
          <div className="flex justify-end gap-2 pt-3">
            <Button
              size="sm"
              variant="secondary"
              className="w-fit"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              color="destructive"
              className="w-fit"
              onClick={async () => {
                await deletePostMutation.mutateAsync();
                setOpen(false);
              }}
              loading={deletePostMutation.isPending}
              loadingText="Deleting..."
              loaderProps={{ className: "text-destructive" }}
            >
              Delete
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default DeletePostButton;
