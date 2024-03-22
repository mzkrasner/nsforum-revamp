import { useRef, useState } from 'react';
import Modal from './Modal';
import TextareaAutosize from 'react-textarea-autosize';

const EditorYoutubeModal = ({
  modalOpen,
  closeModal,
  setEditorBody,
  editorTextareaRef,
  storedSelectionStart,
  storedSelectionEnd,
}) => {
  const [YTURL, setYTURL] = useState('');
  const [YTURLValid, setYTURLValid] = useState(false);

  const modalRef = useRef();

  const validateYTUrl = (url) => {
    const regExp =
      /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})(?:\&.*)?$/i;
    const match = url.match(regExp);
    return !!match; // Return true if there's a match, false otherwise
  };

  const getYTId = (url) => {
    const regExp =
      /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=)?([\w-]+)/i;
    const match = url.match(regExp);
    return match && match[1]; // Return the ID from the first capture group
  };

  const insertYTIframeTag = () => {
    // extract video id
    const videoId = getYTId(YTURL);
    // create iframe string
    const iframeTag = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    // insert iframe string into editor
    const { value } = editorTextareaRef.current;
    setEditorBody(
      value.substring(0, storedSelectionStart) +
        '\n' +
        iframeTag +
        '\n' +
        value.substring(storedSelectionEnd)
    );
    setYTURL('');
    closeModal();
  };

  const handleYTURLChange = (e) => {
    const URL = e.target.value;
    const URLIsValid = validateYTUrl(URL);
    setYTURL(URL);
    if (URL) {
      setYTURLValid(URLIsValid);
    } else if (!YTURLValid) {
      // dont show an error if the textarea is empty
      setYTURLValid(true);
    }
  };

  const handleYTURLKeyDown = (e) => {
    const URL = e.target.value;
    const URLIsValid = validateYTUrl(URL);
    if (e.key === 'Enter') {
      if (URL && URLIsValid) insertYTIframeTag();
      e.preventDefault();
    }
  };

  if (!modalOpen) return null;

  return (
    <Modal ref={modalRef} handleClose={closeModal}>
      <TextareaAutosize
        className='resize-none w-full h-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base'
        placeholder='Paste YouTube url here'
        value={YTURL}
        onChange={(e) => handleYTURLChange(e)}
        onKeyDown={(e) => handleYTURLKeyDown(e)}
      />
      {YTURL && !YTURLValid && (
        <div className='text-sm text-red-400'>
          Not a valid youtube video url.
        </div>
      )}
      <div className='flex items-center mt-3 justify-end'>
        <button
          className='btn btn-secondary block w-fit'
          onClick={() => insertYTIframeTag()}
          disabled={!YTURLValid}
        >
          Embed
        </button>
      </div>
    </Modal>
  );
};
export default EditorYoutubeModal;
