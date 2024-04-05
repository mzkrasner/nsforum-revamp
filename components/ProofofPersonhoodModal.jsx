import { useRef, useState } from "react";
import Modal from "./Modal";
import { LoadingCircle } from "./Icons";

const NoAttestationModal = ({
  closeModal,
  recheck = () => null,
  checking = false,
  isUnique = false,
}) => {
  const [rechecked, setRechecked] = useState(false);

  const modalRef = useRef();
  return (
    <Modal ref={modalRef} handleClose={closeModal}>
      <div className="w-full text-center bg-white/10 rounded-2xl border border-[#619575] p-6">
        <h3>Proof of Personhood</h3>
        <p className="text-base text-secondary text-sm my-5">
          To react to posts, users must verify their identity using a government
          ID. This is to ansure fairness and prevent multiple reactions from a
          single user. The button below will open a new tab where you can verify
          yourself, afterwhich you should return here and click the refresh
          button if this modal is still open.
        </p>
        <div className="mb-3">
          <a
            target="_blank"
            href="https://silksecure.net/holonym/silk/gov-id/issuance/prereqs"
            className="flex-1 btn btn-secondary block w-full"
          >
            Prove
          </a>
        </div>
        <div className="flex gap-2 justify-center text-secondary text-sm">
          <span>Already verified?</span>
          <button
            className="text-brand font-medium"
            onClick={() => {
              if (checking) return;
              if (!rechecked) setRechecked(true);
              recheck();
            }}
          >
            {checking ? <LoadingCircle /> : "Recheck"}
          </button>
        </div>
        {!isUnique && rechecked && !checking ? (
          <div className="text-red-500 text-sm mt-2">
            Verification not found
          </div>
        ) : null}
      </div>
    </Modal>
  );
};
export default NoAttestationModal;
