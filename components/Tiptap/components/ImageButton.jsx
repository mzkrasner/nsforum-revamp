import { useEffect, useRef, useState } from "react"
import ToolbarButton from "./ToolbarButton"
import { ImageIcon } from "lucide-react"
import { useCurrentEditor } from "@tiptap/react";

const ImageButton = ({ onClick, ...props }) => {
  const [file, setFile] = useState(null);

  const inputRef = useRef(null);

  const { editor } = useCurrentEditor();

  useEffect(() => {
    if (file && editor) {
      const previewUrl = URL.createObjectURL(file);
      if (previewUrl) {
        editor.chain().focus().setImage({ src: previewUrl }).run();
        // Save position in ref
        // Upload image
        // Replace image in position with uploaded image url
        // console.log(editor.$pos)
        // editor.commands.setImage({ src: 'https://example.com/foobar.png' })
      }
    }
  }, [file, editor])

  const onInputChange = (e) => {
    const file = e.target.files?.length && e.target.files[0];
    if (!file) return;
    setFile(file);
    e.target.value = '';
  }

  return (
    <>
      <input ref={inputRef} type='file' accept="image/*" onChange={onInputChange} className='hidden' hidden />
      <ToolbarButton 
        {...props} 
        onClick={e => {
          inputRef.current?.click();
          onClick && onClick();
        }}
      >
        <ImageIcon className="w-3.5" />
      </ToolbarButton>
    </>
  )
}
export default ImageButton