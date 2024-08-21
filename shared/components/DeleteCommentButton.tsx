import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { LoaderIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import useComment from "../hooks/useComment";

type Props = { commentId: string };
const DeleteCommentButton = ({ commentId }: Props) => {
  const [open, setOpen] = useState(false);

  const { deleteCommentMutation } = useComment({ commentId });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="inline-flex h-7 w-7 items-center px-0 text-neutral-500"
          disabled={deleteCommentMutation.isPending}
        >
          {deleteCommentMutation.isPending ? (
            <LoaderIcon size={14} className="animate-spin" />
          ) : (
            <TrashIcon size={14} />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this post?</DialogTitle>
          <DialogDescription>
            This will not truly delete your comment but will hide it from the
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
              className="w-fit bg-destructive-foreground text-destructive hover:bg-destructive/10"
              onClick={async () => {
                await deleteCommentMutation.mutateAsync();
                setOpen(false);
              }}
              loading={deleteCommentMutation.isPending}
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
export default DeleteCommentButton;
