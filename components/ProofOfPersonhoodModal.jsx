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
			<div className="w-full text-secondary text-center bg-white/10 rounded-2xl border border-[#619575] p-6">
				<h3>Proof of Personhood</h3>
				<div className="text-base text-sm my-5">
					<p className="mb-2">
						To react to posts, users must verify they are a real person by
						showing their government ID. This is done in a way that respect{"'"}
						s your privacy as your data is stored using zero knowledge
						cryptography which no one, including the forum team, can actually
						see. This is to ensure fairness and prevent one person from having
						multiple accounts.
					</p>
					<p>
						Click the “Verify with e-passport” button to scan your NFC enabled
						passport for free.
					</p>
					<p>
						Click the “Verify with government photo ID” to take a picture of
						your photo ID and a selfie. This option requires paying $10.
					</p>
				</div>
				<div className="mb-3 flex flex-col gap-3">
					<a
						target="_blank"
						href="https://silksecure.net/holonym/diff-wallet"
						className="block w-full btn btn-secondary"
					>
						Verify with e-passport
					</a>
					<a
						target="_blank"
						href="https://silksecure.net/holonym/silk/gov-id/issuance/prereqs"
						className="block w-full btn btn-secondary"
					>
						Verify with government photo ID
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
