import { reverseString } from "@/shared/lib/utils";
import { Level } from "@tiptap/extension-heading";
import {} from "@tiptap/extension-youtube";
import { isNil } from "lodash-es";
import useEditorContext from "../../hooks/useEditorContext";
import { MdNodeType } from "../../types";

export const YOUTUBE_REGEX =
  /^(https?:\/\/)?(www\.|music\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com)\/(?!channel\/)(?!@)(.+)?$/;

export const isValidYoutubeUrl = (url: string) => {
  return url.match(YOUTUBE_REGEX);
};

const useMdEditorFunctions = () => {
  const { mdEditor, mdActiveNodeTypes } = useEditorContext();
  const { view } = mdEditor || {};

  const countOccurrences = ({
    text,
    searchString,
    chunkSize = 1024,
    reverse,
  }: {
    text: string;
    searchString: string;
    chunkSize?: number;
    reverse?: boolean;
  }) => {
    if (!searchString) {
      return 0; // If searchString is empty, return 0
    }

    if (reverse) {
      // Reverse the text and search string
      text = reverseString(text);
      searchString = searchString.split("").reverse().join("");
    }

    // Escape special characters in searchString
    const escapedSearchString = searchString.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    return (
      text.slice(0, chunkSize).match(new RegExp(escapedSearchString, "g")) || []
    ).length;
  };

  const getDelimiterRange = ({
    from,
    to,
    delimiter,
  }: {
    from: number;
    to: number;
    delimiter: string;
  }) => {
    if (!view) return;
    const { state } = view;

    const text = state.sliceDoc(); // Get the document text
    const textLength = text.length;

    // Allow for delimited to be included at the edges of the selction range
    const delimiterLength = delimiter.length;
    if (from !== to) {
      from =
        textLength < from + delimiterLength ? from : from + delimiterLength;
      to = to - delimiterLength < 0 ? to : to - delimiterLength;
    }
    const beforeText = text.slice(0, from);
    const afterText = text.slice(to);

    const numDelimitersBefore = countOccurrences({
      text: beforeText,
      searchString: delimiter,
      reverse: true,
    });
    const numDelimitersAfter = countOccurrences({
      text: afterText,
      searchString: delimiter,
    });

    if (numDelimitersBefore % 2 !== 0 && numDelimitersAfter % 2 !== 0) {
      return {
        start:
          from -
          reverseString(beforeText).indexOf(reverseString(delimiter)) -
          delimiterLength,
        end: to + afterText.indexOf(delimiter) + delimiterLength,
      };
    }

    return false;
  };

  const unWrapRange = ({
    from,
    to,
    wrapper,
  }: {
    from: number;
    to: number;
    wrapper: string;
  }) => {
    if (!view) return;
    const { state } = view;
    let selectedText = state.sliceDoc(from, to);
    const wrapperLength = wrapper.length;

    const transaction = state.update({
      changes: {
        from: from,
        to: to,
        insert: selectedText.slice(wrapperLength, -wrapperLength),
      },
      selection: { anchor: from, head: to - wrapperLength * 2 }, // Adjust selection length after unbolding
    });
    view.dispatch(transaction);
    view.focus();
  };

  const wrapRange = ({
    from,
    to,
    wrapper,
  }: {
    from: number;
    to: number;
    wrapper: string;
  }) => {
    if (!view) return;
    const { state } = view;
    let selectedText = state.sliceDoc(from, to);
    const wrapperLength = wrapper.length;

    const transaction = state.update({
      changes: {
        from: from,
        to: to,
        insert: wrapper + selectedText + wrapper,
      },
      selection: { anchor: from + wrapperLength, head: to + wrapperLength }, // Adjust selection inside bolded text
    });
    view.dispatch(transaction);
    view.focus();
  };

  // TODO Theres a bug with post-transaction selection when working with nested wrappers
  const toggleSelectionWrapper = (wrapper: string) => {
    if (!view) return;
    const { state } = view;
    let from, to;
    ({ from, to } = state.selection.main);
    // Check wrapping inclusive of wrapper
    const delimiterRange = getDelimiterRange({ from, to, delimiter: wrapper });

    if (delimiterRange) {
      const { start, end } = delimiterRange;
      // If text is already wrapped, remove the wrapping formatting
      unWrapRange({ from: start, to: end, wrapper });
    } else {
      // If selection is not wrapped, add the wrapping formatting
      wrapRange({ from, to, wrapper });
    }
  };

  const matchLine = (regex: RegExp, at: number) => {
    if (!view) return;
    const { state } = view;
    const line = state.doc.lineAt(at).text;
    return line.match(regex);
  };

  const getActiveHeading = () => {
    if (!view) return;
    const { state } = view;
    const { from } = state.selection.main;
    const match = matchLine(/^(#{1,6})\s/, from);
    if (match) {
      return match[1].length;
    }
    return false;
  };

  const toggleHeading = (level: Level) => {
    // Ensure the level is within the valid range
    if (level < 1 || level > 6) {
      console.error("Heading level must be between 1 and 6.");
      return;
    }
    if (!view) return;

    const { state } = view;
    const { from } = state.selection.main;

    // Get the line at the current cursor position
    const line = state.doc.lineAt(from);
    const lineText = line.text;

    const activeHeading = getActiveHeading();
    const isHeadingActive = activeHeading === level;

    // Create the heading markdown based on the level
    const heading = "#".repeat(level) + " ";

    // Replace the line with the heading
    view.dispatch({
      changes: {
        from: line.from,
        to: line.to,
        insert:
          (isHeadingActive ? "" : heading) + lineText.replace(/^\s*#+\s*/, ""), // If heading is active, remove it, else replace any existing heading
      },
    });
  };

  const getActiveList = () => {
    if (!view) return;
    const { state } = view;
    const { from } = state.selection.main;

    const isBulletedList = !!matchLine(/^[-*+]\s+/, from);
    if (isBulletedList) return "bulleted";

    const isNumbereredList = !!matchLine(/^\d+\.\s+/, from);
    if (isNumbereredList) return "numbered";

    return false;
  };

  const toggleBulletList = () => {
    if (!view) return;
    const { state } = view;
    const { from } = state.selection.main;

    const line = state.doc.lineAt(from);
    const lineText = line.text;

    const activeList = getActiveList();
    const isActive = activeList === "bulleted";

    let newLine;
    if (isActive) {
      // If the current line is a bulleted list, remove the bullet
      newLine = lineText.replace(/^[-*+]\s+/, "");
    } else if (activeList === "numbered") {
      // If the current line is a numbered list, replace it with a bullet
      newLine = lineText.replace(/^\d+\.\s+/, "- ");
    } else {
      // If the current line is not a list, add a bullet
      newLine = "- " + lineText;
    }

    view.dispatch({
      changes: {
        from: line.from,
        to: line.to,
        insert: newLine,
      },
    });
  };

  const toggleOrderedList = (num: number) => {
    if (!view) return;
    const { state } = view;
    const { from } = state.selection.main;

    const line = state.doc.lineAt(from);
    const lineText = line.text;

    const activeList = getActiveList();
    const isActive = activeList === "numbered";

    const marker = `${num}. `;
    let newLine;
    if (isActive) {
      newLine = lineText.replace(/^\d+\.\s+/, "");
    } else if (activeList === "bulleted") {
      newLine = lineText.replace(/^[-*+]\s+/, marker);
    } else {
      newLine = marker + lineText;
    }

    view.dispatch({
      changes: {
        from: line.from,
        to: line.to,
        insert: newLine,
      },
    });
  };

  const isNodeActive = (nodeTypes: MdNodeType | MdNodeType[]) => {
    if (!view) return false;

    const nodeTypeArray: string[] = Array.isArray(nodeTypes)
      ? nodeTypes
      : [nodeTypes]; // Normalize to array

    for (const nodeType of mdActiveNodeTypes) {
      if (nodeTypeArray.includes(nodeType)) return true;
    }

    return false;
  };

  const insertLink = (url: `http${string}`) => {
    if (!view) return;
    const { state } = view;
    const { from, to } = state.selection.main;
    const selectedText = state.sliceDoc(from, to);
    const linkMarkdown = `[${selectedText}](${url})`;

    // Create a transaction to insert the link at the current cursor position
    const transaction = state.update({
      changes: {
        from,
        to,
        insert: linkMarkdown,
      },
      selection: {
        anchor: from + 1 + selectedText.length,
        head: from + 1 + selectedText.length,
      },
    });
    view.dispatch(transaction);
    view.focus();
  };

  const insertContent = ({
    from,
    to,
    content,
  }: {
    from?: number;
    to?: number;
    content: string;
  }) => {
    if (!view) return;
    const { state } = view;

    if (isNil(from)) from = state.selection.main.from;
    if (isNil(to)) to = state.selection.main.to;

    const transaction = state.update({
      changes: { from, to, insert: content },
      selection: {
        anchor: from + content.length,
      },
    });

    // Dispatch the transaction to insert HTML
    view.dispatch(transaction);

    // Refocus the editor and set cursor after the inserted HTML
    view.focus();
  };

  const insertYoutubeVideo = (url: string) => {
    if (!view) return;
    const { state } = view;
    const { from, to } = state.selection.main;

    if (!isValidYoutubeUrl(url)) {
      alert("Not a valid youtube url");
      return;
    }

    const content = `<div data-youtube-video="">
  <iframe style="margin: 0 auto; width: 100%; max-width: 640px; height: auto; aspect-ratio: 16/9; border-radius: 8px" width="640" height="480" allowfullscreen="true" autoplay="false" disablekbcontrols="false" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" src="${url}" start="0"></iframe>
</div>
`;

    insertContent({ from, to, content });
  };

  return {
    getDelimiterRange,
    getActiveHeading,
    getActiveList,
    toggleSelectionWrapper,
    toggleHeading,
    toggleBulletList,
    toggleOrderedList,
    isNodeActive,
    insertLink,
    insertYoutubeVideo,
    insertContent,
  };
};

export default useMdEditorFunctions;
