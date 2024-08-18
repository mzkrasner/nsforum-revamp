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
        <Button size="sm" variant="ghost" className="h-8 text-sm">
          <TrashIcon className="mr-2 w-3" /> Delete
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
              className="w-fit bg-destructive-foreground text-destructive hover:bg-destructive/10"
              onClick={async () => {
                await deletePostMutation.mutateAsync(postId);
                setOpen(false);
              }}
              loading={deletePostMutation.isPending}
              loadingText="Deleting..."
              loaderProps={{ className: "text-destructive" }}
            >
              Delete
            </Button>
            <Button size="sm" variant="default" className="w-fit">
              Cancel
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default DeletePostButton;
