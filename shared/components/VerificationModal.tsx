import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";

const VerificationModal = (props: DialogProps) => {

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log In</DialogTitle>
          <DialogDescription>
            Please log in to your account to react to posts and comments.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center justify-end"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default VerificationModal;
