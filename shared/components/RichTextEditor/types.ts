import { Level } from "@tiptap/extension-heading";
import { Editor } from "@tiptap/react";
import { useCodeMirror } from "@uiw/react-codemirror";
import { Dispatch, SetStateAction } from "react";

export type MdEditorType = ReturnType<typeof useCodeMirror>;

export interface EditorContextType {
  editor: Editor | null;
  uploadImage?: (file: File) => Promise<string>;
  isMdEditorActive: boolean;
  toggleMarkdown: () => void;
  mdEditor: MdEditorType | null;
  setMdEditor: (value: MdEditorType | null) => void;
  mdActiveNodeTypes: MdNodeType[];
  setMdActiveNodeTypes: Dispatch<SetStateAction<MdNodeType[]>>;
}

export type MdNodeType =
  | "Document" // Root node of the document
  | "Paragraph" // Regular paragraph
  | "Blockquote" // Blockquote
  | "OrderedList" // Ordered list
  | "BulletList" // Unordered list
  | "ListItem" // List item
  | `ATXHeading${Level}` // Headings
  | "CodeBlock" // Fenced or indented code block
  | "HorizontalRule" // Horizontal rule (---, ***)
  | "Emphasis" // Italic text (*text* or _text_)
  | "StrongEmphasis" // Bold text (**text** or __text__)
  | "Link" // Link (e.g., [text](url))
  | "Image" // Image (e.g., ![alt](url))
  | "InlineCode" // Inline code (`code`)
  | "ThematicBreak" // Thematic break (horizontal line)
  | "Strikethrough" // Strikethrough text (~~text~~)
  | "BlockQuote" // Blockquote (>)
  | "Table" // Markdown table
  | "TableRow" // Table row
  | "TableCell" // Table cell
  | "HtmlBlock" // Raw HTML block
  | "HtmlInline" // Inline HTML
  | "Footnote" // Footnote marker (^[footnote])
  | "FootnoteReference" // Footnote reference
  | "URL" // URL in autolink
  | "Escape" // Escape sequence
  | "Text" // Plain text node
  | "HardBreak" // Line break (two spaces)
  | "SoftBreak"; // Soft break (single line break)
