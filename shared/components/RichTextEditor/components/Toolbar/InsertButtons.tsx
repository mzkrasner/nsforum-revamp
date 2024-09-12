import { SpotifyIcon } from "@/shared/components/icons";
import { Button } from "@/shared/components/ui/button";
import { Toggle } from "@/shared/components/ui/toggle";
import useOutsideClick from "@/shared/hooks/useOutsideClick";
import { useWindowWidth } from "@react-hook/window-size";
import { EllipsisVerticalIcon, LinkIcon, YoutubeIcon } from "lucide-react";
import { useRef, useState } from "react";
import useEditorContext from "../../hooks/useEditorContext";
import useMdEditorFunctions from "../MdEditor/useMdEditorFunctions";
import ImageButton from "./ImageButton";
import useToolbarInsertFunctions from "./useToolbarInsertFunctions";

const InsertButtons = () => {
  const [open, setOpen] = useState(false);

  const dropdownListRef = useRef(null);

  useOutsideClick(dropdownListRef, () => setOpen(false));

  const { editor } = useEditorContext();

  const windowWidth = useWindowWidth({ wait: 200 });

  const { setLink, addYoutubeVideo, addSpotifyPodcastEpisode } =
    useToolbarInsertFunctions();

  const { isNodeActive } = useMdEditorFunctions();

  if (!editor) return null;

  const insertsDisabled = isNodeActive(["Link", "HtmlBlock"]);

  const buttons = (
    <>
      <Toggle
        size="sm"
        className="h-8 w-8 px-2"
        pressed={editor.isActive("link")}
        onClick={(e) => {
          setLink();
          e.preventDefault();
          e.stopPropagation();
        }}
        disabled={insertsDisabled}
      >
        <LinkIcon size={14} />
      </Toggle>
      <ImageButton />
      <Toggle
        size="sm"
        className="h-8 w-8 px-2"
        pressed={editor.isActive("spotify")}
        onClick={addSpotifyPodcastEpisode}
        disabled={insertsDisabled}
      >
        <SpotifyIcon
          size={14}
          strokeWidth={1.4}
          className="fill-none stroke-neutral-700"
        />
      </Toggle>
      <Toggle
        size="sm"
        className="h-8 w-8 px-2"
        pressed={editor.isActive("youtube")}
        onClick={addYoutubeVideo}
        disabled={insertsDisabled}
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
        <Button
          size="sm"
          className="h-8 w-8 px-2"
          onClick={() => setOpen((v) => !v)}
        >
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
