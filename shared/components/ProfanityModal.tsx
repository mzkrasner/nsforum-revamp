import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";

const ProfanityModal = (props: DialogProps) => {

    return (
        <Dialog {...props}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Profanity or Hate Speech Not Allowed</DialogTitle>
                    <DialogDescription>
                        Please refrain from using profanity or hate speech on this platform.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex items-center justify-end"></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default ProfanityModal;
