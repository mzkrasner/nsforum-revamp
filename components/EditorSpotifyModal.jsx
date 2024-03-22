import { useRef, useState } from 'react';
import Modal from './Modal';
import TextareaAutosize from 'react-textarea-autosize';

const EditorSpotifyModal = ({
  modalOpen,
  closeModal,
  setEditorBody,
  editorTextareaRef,
  storedSelectionStart,
  storedSelectionEnd,
}) => {
  const [spotifyURL, setSpotifyURL] = useState('');
  const [spotifyURLValid, setSpotifyURLValid] = useState(false);

  const modalRef = useRef();

  const validateSpotifyUrl = (url) => {
    const regex = /^https:\/\/open\.spotify\.com\/episode\/([a-zA-Z0-9]+)$/;
    return regex.test(url);
  };

  const getSpotifyId = (url) => {
    if (!validateSpotifyUrl(url)) {
      return null;
    }
    const regex = /^https:\/\/open\.spotify\.com\/episode\/([a-zA-Z0-9]+)$/;
    const match = url.match(regex);
    return match && match[1];
  };

  const insertSpotifyIframeTag = () => {
    // extract video id
    const podcastId = getSpotifyId(spotifyURL);
    // create iframe string
    const iframeTag = `<iframe style="border-radius:12px;" src="https://open.spotify.com/embed/episode/${podcastId}?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    // insert iframe string into editor
    const { value } = editorTextareaRef.current;
    setEditorBody(
      value.substring(0, storedSelectionStart) +
        '\n' +
        iframeTag +
        '\n' +
        value.substring(storedSelectionEnd)
    );
    setSpotifyURL('');
    closeModal();
  };

  const handleSpotifyURLChange = (e) => {
    const URL = e.target.value;
    const URLIsValid = validateSpotifyUrl(URL);
    setSpotifyURL(URL);
    if (URL) {
      setSpotifyURLValid(URLIsValid);
    } else if (!spotifyURLValid) {
      // dont show an error if the textarea is empty
      setSpotifyURLValid(true);
    }
  };

  const handleSpotifyURLKeyDown = (e) => {
    const URL = e.target.value;
    const URLIsValid = validateSpotifyUrl(URL);
    if (e.key === 'Enter') {
      if (URL && URLIsValid) insertSpotifyIframeTag();
      e.preventDefault();
    }
  };

  if (!modalOpen) return null;

  return (
    <Modal ref={modalRef} handleClose={closeModal}>
      <TextareaAutosize
        className='resize-none w-full h-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base'
        placeholder='Paste Spotify podcast episode url here'
        value={spotifyURL}
        onChange={(e) => handleSpotifyURLChange(e)}
        onKeyDown={(e) => handleSpotifyURLKeyDown(e)}
      />
      {spotifyURL && !spotifyURLValid && (
        <div className='text-sm text-red-400'>
          Not a valid spotify podcast episode url.
        </div>
      )}
      <div className='flex items-center mt-3 justify-end'>
        <button
          className='btn btn-secondary block w-fit'
          onClick={() => insertSpotifyIframeTag()}
          disabled={!spotifyURLValid}
        >
          Embed
        </button>
      </div>
    </Modal>
  );
};
export default EditorSpotifyModal;
