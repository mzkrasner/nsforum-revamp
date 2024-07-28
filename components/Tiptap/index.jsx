import { useEditor, EditorContent, EditorContext } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Toolbar from "./components/Toolbar";
import { cn } from "../../utils/tailwind";
import { forwardRef, useState } from "react";
import Iframe from "./plugins/iframe";

const Tiptap = forwardRef(({ 
	className = '', 
	onChange, 
	initialContent,
	uploadImage
}, forwardedRef) => {
	const [focused, setFocused] = useState(false);

	const editor = useEditor({
		extensions: [
			StarterKit,
			Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
      }),
			Image,
			Youtube.configure({
        controls: true,
        nocookie: true,
				HTMLAttributes: {
					style: 'margin: 0 auto; width: 100%; max-width: 640px; height: auto; aspect-ratio: 16/9',
				}
      }),
			Iframe.configure({
				HTMLAttributes: {
					style: 'margin: 20px auto; width: 100%; height: auto;',
				}
			}),
		],
		content: initialContent || undefined,
		editorProps: {
			attributes: {
				class: "min-h-40 p-3 pb-6 outline-none focus:border-gray-500",
			},
		},
		onUpdate({ editor }) {
			onChange && onChange(editor.getHTML());
		},
	});

	return (
		<EditorContext.Provider value={{ editor, uploadImage }}>
			<div
			tabIndex={0}
			ref={(e) => {
				if (typeof forwardedRef === "function") {
					(forwardedRef)(e);
				}
			}}
				className={cn(
					"relative h-fit rounded-md border border-gray-500/50 text-[var(--primary-color)]",
					{ "ring-1 ring-blue-500": focused },
					className
				)}
			>
				<Toolbar />
				<EditorContent 
					editor={editor}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)} 
				/>
			</div>
		</EditorContext.Provider>
	);
});

export default Tiptap;
