import { EllipsisVerticalIcon, LinkIcon, PodcastIcon, YoutubeIcon } from "lucide-react";
import {} from '@icons-pack/react-simple-icons';
import ToolbarButton from "./ToolbarButton";
import { useCurrentEditor } from "@tiptap/react";
import ImageButton from "./ImageButton";
import { useWindowWidth } from "@react-hook/window-size";
import { useCallback, useRef, useState } from "react";
import useOutsideClick from "../../../hooks/useOutsideClick";

const InsertButtons = () => {
  const [open, setOpen] = useState(false);

  const dropdownListRef = useRef(null);

  useOutsideClick(dropdownListRef, () => setOpen(false));

  const { editor } = useCurrentEditor();

  const windowWidth = useWindowWidth({ wait: 200 });

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    let url = window.prompt('URL', previousUrl);
    
    if (!url) return;
    
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()

      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url })
      .run()
  }, [editor])

  if (!editor) return null;

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube URL');

    const height = 480;
    const width = 640;

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: Math.max(320, parseInt(width, 10)) || 640,
        height: Math.max(180, parseInt(height, 10)) || 480,
      })
    }
  }

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

  const addSpotifyPodcastEpisode = () => {
    const input = prompt('Enter spotify podcast URL');
    const url = input.split('?')[0];
    if (!validateSpotifyUrl(url)) {
      alert('Not a valid spotify podcast episode url.');
      return;
    }

    const podcastId = getSpotifyId(url);
    const spotifyIframe = `<iframe style="height: 80px; width: 500px; max-width: 100%; border-radius: 14px; margin: 0 auto;" src="https://open.spotify.com/embed/episode/${podcastId}?utm_source=generator" width="100%" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
    editor.chain().focus().insertContent(spotifyIframe, {
      parseOptions: {
        preserveWhitespace: false,
      },
    }).run()
  }

  const buttons = (
    <>
      <ToolbarButton onClick={setLink} active={editor.isActive('link')}>
        <LinkIcon className="w-3.5" />
      </ToolbarButton>
			<ImageButton />
			<ToolbarButton onClick={addSpotifyPodcastEpisode}>
        <PodcastIcon className="w-3.5" />
      </ToolbarButton>
			<ToolbarButton onClick={addYoutubeVideo}>
        <YoutubeIcon className="w-4" />
      </ToolbarButton>
    </>
  )

  const isSmallScreen = windowWidth < 460;
  if (isSmallScreen) return (
    <div className="w-fit h-fit relative">
      <ToolbarButton onClick={() => setOpen(v => !v)}>
        <EllipsisVerticalIcon className="w-3.5" />
      </ToolbarButton>
      {open && (
        <div
          ref={dropdownListRef}
          className='absolute top-[calc(100%_+_8px)] right-0 rounded-lg p-1 flex gap-1 border border-gray-500/50 bg-[var(--bg-color)]'
        >
          {buttons}
        </div>
      )}
    </div>
  )

  return buttons;
}
export default InsertButtons