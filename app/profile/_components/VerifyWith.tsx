import { Button } from "@/shared/components/ui/button";
import { VERIFICATION_METHODS } from "@/shared/constants";
import { IdCardIcon, LandmarkIcon, PhoneIcon } from "lucide-react";

type Method = (typeof VERIFICATION_METHODS)[number] | null;
type Props = {
  method?: Method;
  setMethod: (method: Method) => void;
};
const Verify = ({ method, setMethod }: Props) => {
  return (
    <div className="mt-2 space-x-2">
      <Button
        variant="outline"
        className="gap-2.5 px-2"
        onClick={() => setMethod("phone")}
      >
        {/* <a
            target="_blank"
            href={`https://silksecure.net/holonym/diff-wallet/phone/issuance/prereqs`}
          > */}
        <PhoneIcon size={16} />
        Phone number
        {/* </a> */}
      </Button>
      <Button
        variant="outline"
        className="gap-2.5 px-2"
        onClick={() => setMethod("gov-id")}
      >
        {/* <a
            target="_blank"
            href={`https://silksecure.net/holonym/diff-wallet/gov-id/issuance/prereqs`}
          > */}
        <LandmarkIcon size={16} />
        Government ID
        {/* </a> */}
      </Button>
      <Button
        variant="outline"
        className="gap-2.5 px-2"
        onClick={() => setMethod("ePassport")}
      >
        {/* <a
            target="_blank"
            href={`https://silksecure.net/holonym/diff-wallet/gov-id/issuance/prereqs`}
          > */}
        <IdCardIcon size={16} />
        ePassport
        {/* </a> */}
      </Button>
    </div>
  );
};
export default Verify;
