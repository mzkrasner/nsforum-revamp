import { syntaxTree } from "@codemirror/language";
import { Level } from "@tiptap/extension-heading";
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

  const unWrapRange = ({
    from,
    to,
    wrapper,
    selectionRange,
  }: {
    from: number;
    to: number;
    wrapper: string;
    selectionRange?: {
      anchor: number;
      head?: number;
    };
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
      selection: selectionRange || {
        anchor: from,
        head: to - wrapperLength * 2,
      }, // Adjust selection length after unbolding
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

  const findNodeTypeRange = (nodeType: MdNodeType) => {
    if (!view) return;
    const { state } = view;
    const { from, to } = state.selection.main;

    let start = -1;
    let end = -1;

    // Walk through the syntax tree to find the NodeType node
    syntaxTree(state).iterate({
      from,
      to,
      enter: (node) => {
        // Check if the current node is a NodeType (bold)
        if (node.name === nodeType) {
          start = node.from;
          end = node.to;
          return false; // Stop the iteration as we found the node
        }
      },
    });

    if (start === -1 && end === -1) return false;

    return { start, end }; // Return the range of StrongEmphasis
  };

  const toggleMark = ({
    wrapper,
    nodeType,
  }: {
    wrapper: string;
    nodeType: MdNodeType;
  }) => {
    if (!view) return;
    const { state } = view;
    const { from, to } = state.selection.main;
    // Check wrapping inclusive of wrapper

    const isNodeTypeActive = isNodeActive(nodeType);

    if (isNodeTypeActive) {
      const nodeTypeRange = findNodeTypeRange(nodeType);
      if (nodeTypeRange) {
        const { start, end } = nodeTypeRange;
        // If text is already wrapped, remove the wrapping formatting
        const isSelectionNarrowerThanMark =
          to - from < end - start - wrapper.length * 2;
        unWrapRange({
          from: start,
          to: end,
          wrapper,
          selectionRange: isSelectionNarrowerThanMark
            ? { anchor: from - wrapper.length }
            : undefined,
        });
      }
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
    getActiveHeading,
    getActiveList,
    toggleMark,
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
