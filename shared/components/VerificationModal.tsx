import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
// import { useLinkAccount } from "@privy-io/react-auth";
import { DialogProps } from "@radix-ui/react-dialog";

const VerificationModal = (props: DialogProps) => {
  // const { linkPhone, linkTwitter } = useLinkAccount();

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify your account</DialogTitle>
          <DialogDescription>
            Please add a phone number or X account to react to posts and
            comments.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center justify-end"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default VerificationModal;
