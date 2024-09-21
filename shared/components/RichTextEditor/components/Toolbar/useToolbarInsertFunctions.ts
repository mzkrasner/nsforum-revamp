import { normalizeAndValidateUrl } from "@/shared/lib/utils";
import useEditorContext from "../../hooks/useEditorContext";
import useMdEditorFunctions from "../MdEditor/useMdEditorFunctions";

const useToolbarInsertFunctions = () => {
  const { editor, isMdEditorActive } = useEditorContext();

  const mdEditorFns = useMdEditorFunctions();

  const setLink = () => {
    if (!editor) return;
    let url = editor.getAttributes("link").href;
    if (!url) return;

    url = normalizeAndValidateUrl(window.prompt("URL", url) || "");

    if (isMdEditorActive) {
      mdEditorFns.insertLink(url as `http${string}`);
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addYoutubeVideo = () => {
    if (!editor) return;
    const url = prompt("Enter YouTube URL") || "";

    const height = 480;
    const width = 640;

    if (isMdEditorActive) {
      mdEditorFns.insertYoutubeVideo(url);
      return;
    }

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
    if (!editor) return;
    const input = prompt("Enter spotify podcast URL");
    const url = input?.split("?")[0];

    if (!url) return;

    if (!validateSpotifyUrl(url)) {
      alert("Not a valid spotify podcast episode url.");
      return;
    }

    const podcastId = getSpotifyId(url);
    const spotifyIframe = `<div data-spotify-podcast="" class="iframe-wrapper">
  <iframe style="height: 80px; width: 500px; max-width: 100%; border-radius: 14px; margin: 0 auto;" src="https://open.spotify.com/embed/episode/${podcastId}?utm_source=generator" width="100%" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
</div>
`;

    if (isMdEditorActive) {
      mdEditorFns.insertContent({ content: spotifyIframe });
      return;
    }

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

  return { setLink, addYoutubeVideo, addSpotifyPodcastEpisode };
};

export default useToolbarInsertFunctions;
