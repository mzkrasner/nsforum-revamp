import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { SiX } from "@icons-pack/react-simple-icons";
import { useLinkAccount } from "@privy-io/react-auth";
import { DialogProps } from "@radix-ui/react-dialog";
import { PhoneIcon } from "lucide-react";

const VerificationModal = (props: DialogProps) => {
  const { linkPhone, linkTwitter } = useLinkAccount();

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
        <DialogFooter className="flex items-center justify-end">
          <Button variant="outline" onClick={linkPhone}>
            <PhoneIcon size={16} />
            Phone number
          </Button>
          <Button variant="outline" onClick={linkTwitter}>
            <SiX size={16} /> account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default VerificationModal;
