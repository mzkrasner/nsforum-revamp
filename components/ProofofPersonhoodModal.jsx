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
        <div className="text-base text-secondary text-sm my-5">
          <p className="mb-2">
            To react to posts, users must verify their identity by showing their
            government ID and by paying ~$10. This is done in a way that
            respects your privacy as the data about your ID is stored with zero
            knowledge cryptography which no one, including the forum team, can
            actually see. THis is to ensure fairness and prevent multiple
            accounts.
          </p>
          <p>
            Click the button to become a verified user then return and click the refresh button
          </p>
        </div>
        <div className="mb-3">
          <a
            target="_blank"
            href="https://silksecure.net/holonym/silk/gov-id/issuance/prereqs"
            className="flex-1 btn btn-secondary block w-full"
          >
            Verify
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
            {checking ? <LoadingCircle /> : "Refresh"}
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
