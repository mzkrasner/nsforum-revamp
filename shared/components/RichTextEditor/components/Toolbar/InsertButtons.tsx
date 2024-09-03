import { Button } from "@/shared/components/ui/button";
import { Toggle } from "@/shared/components/ui/toggle";
import useOutsideClick from "@/shared/hooks/useOutsideClick";
import { useWindowWidth } from "@react-hook/window-size";
import {
  EllipsisVerticalIcon,
  LinkIcon,
  PodcastIcon,
  // EllipsisVerticalIcon,
  // LinkIcon,
  YoutubeIcon,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import useEditorContext from "../../hooks/useEditorContext";
import ImageButton from "./ImageButton";

const InsertButtons = () => {
  const [open, setOpen] = useState(false);

  const dropdownListRef = useRef(null);

  useOutsideClick(dropdownListRef, () => setOpen(false));

  const { editor } = useEditorContext();

  const windowWidth = useWindowWidth({ wait: 200 });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    let url = window.prompt("URL", previousUrl);

    if (!url) return;

    if (!url.startsWith("http")) {
      url = `https://${url}`;
    }

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");

    const height = 480;
    const width = 640;

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: Math.max(320, parseInt(width.toString(), 10)) || 640,
        height: Math.max(180, parseInt(height.toString(), 10)) || 480,
      });
    }
  };

  const validateSpotifyUrl = (url: string) => {
    const regex = /^https:\/\/open\.spotify\.com\/episode\/([a-zA-Z0-9]+)$/;
    return regex.test(url);
  };

  const getSpotifyId = (url: string) => {
    if (!validateSpotifyUrl(url)) {
      return null;
    }
    const regex = /^https:\/\/open\.spotify\.com\/episode\/([a-zA-Z0-9]+)$/;
    const match = url.match(regex);
    return match && match[1];
  };

  const addSpotifyPodcastEpisode = () => {
    const input = prompt("Enter spotify podcast URL");
    const url = input?.split("?")[0];
    if (!url || !validateSpotifyUrl(url)) {
      alert("Not a valid spotify podcast episode url.");
      return;
    }

    const podcastId = getSpotifyId(url);
    const spotifyIframe = `<iframe style="height: 80px; width: 500px; max-width: 100%; border-radius: 14px; margin: 0 auto;" src="https://open.spotify.com/embed/episode/${podcastId}?utm_source=generator" width="100%" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    editor
      .chain()
      .focus()
      .insertContent(spotifyIframe, {
        parseOptions: {
          preserveWhitespace: false,
        },
      })
      .run();
  };

  const buttons = (
    <>
      <Toggle
        size="sm"
        className="h-8 w-8 px-2"
        pressed={editor.isActive("link")}
        onClick={setLink}
      >
        <LinkIcon size={14} />
      </Toggle>
      <ImageButton />
      <Toggle
        size="sm"
        className="h-8 w-8 px-2"
        pressed={editor.isActive("spotify")}
        onClick={addSpotifyPodcastEpisode}
      >
        <PodcastIcon size={14} strokeWidth={1.4} />
      </Toggle>
      <Toggle
        size="sm"
        className="h-8 w-8 px-2"
        pressed={editor.isActive("youtube")}
        onClick={addYoutubeVideo}
      >
        <YoutubeIcon size={14} strokeWidth={1.4} />
      </Toggle>
      {/* <TableButton /> */}
    </>
  );

  const isSmallScreen = windowWidth < 460;
  if (isSmallScreen)
    return (
      <div className="relative h-fit w-fit">
        <Button onClick={() => setOpen((v) => !v)}>
          <EllipsisVerticalIcon className="w-3.5" />
        </Button>
        {open && (
          <div
            ref={dropdownListRef}
            className="absolute right-0 top-[calc(100%_+_8px)] flex gap-1 rounded-lg border border-gray-500/50 bg-[var(--bg-color)] p-1"
          >
            {buttons}
          </div>
        )}
      </div>
    );

  return buttons;
};
export default InsertButtons;
