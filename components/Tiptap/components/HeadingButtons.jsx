import { useCurrentEditor } from "@tiptap/react";
import ToolbarButton from "./ToolbarButton"
import { Heading1Icon, Heading2Icon, Heading3Icon, Heading4Icon, Heading5Icon, Heading6Icon, HeadingIcon } from 'lucide-react'
import { useState, useRef } from "react";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { useWindowWidth } from '@react-hook/window-size'

const HeadingButton = ({ level = 1 }) => {
  const { editor } = useCurrentEditor();
  
  if (!editor) return null;

  const icons = [Heading1Icon, Heading2Icon, Heading3Icon, Heading4Icon, Heading5Icon, Heading6Icon];
  const IconComponent = icons[level - 1];

  return (
    <ToolbarButton
      onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
      active={editor.isActive('heading', { level })}
    >
      <IconComponent className="w-4" />
    </ToolbarButton>
  )
}

const HeadingButtons = () => {
  const [open, setOpen] = useState(false);

  const dropdownListRef = useRef(null);

  useOutsideClick(dropdownListRef, () => setOpen(false));

  const { editor } = useCurrentEditor();

  const windowWidth = useWindowWidth({ wait: 200 });
  
  if (!editor) return null;

  const isMobile = windowWidth < 768;
  if (isMobile) return (
    <div className="w-fit h-fit relative">
      <ToolbarButton onClick={() => setOpen(v => !v)}>
        <HeadingIcon className="w-3.5" />
      </ToolbarButton>
      {open && (
        <ul ref={dropdownListRef} className='absolute top-[calc(100%_+_8px)] left-1/2 -translate-x-1/2 rounded-lg p-1 flex gap-1 border border-gray-500/50 bg-[var(--bg-color)]'>
          {[...Array(6)].map((_, i) => {
            const level = i + 1;
            return (
              <li key={level}>
                <HeadingButton level={level} />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )

  return [...Array(6)].map((_, i) => {
    const level = i + 1;
    return (
      <HeadingButton 
        key={level} 
        level={level} 
      />  
    )
  })
}
export default HeadingButtons