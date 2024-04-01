import { useRef } from 'react';
import Modal from './Modal';

const NoAttestationModal = ({ closeModal }) => {
  const modalRef = useRef();
  return (
    <Modal ref={modalRef} handleClose={closeModal}>
      <div className='w-full text-center bg-white/10 rounded-2xl border border-[#619575] p-6'>
        <p className='text-base text-secondary mb-2'>
          You can&apos;t react to a post as it&apos;s restricted to users who
          have received more than two attestations from another user.
        </p>
      </div>
    </Modal>
  );
};
export default NoAttestationModal;
