import { useEffect, useRef, useState } from "react"
import ToolbarButton from "./ToolbarButton"
import { ImageIcon } from "lucide-react"
import { useCurrentEditor } from "@tiptap/react";

const ImageButton = ({ onClick, ...props }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef(null);

  const { editor, uploadImage } = useCurrentEditor();

  useEffect(() => {
    const handleImageFile = async () => {
      if (file && editor) {
        setIsUploading(true);
        try {
          const url = await uploadImage(file);
          if (!url) throw new Error();
          console.log(url);
          editor.chain().focus().setImage({ src: url }).run();
        } catch (error) {
          alert('An error occurred while uploading image')
        }
        setIsUploading(false);
      }
    }
    handleImageFile()
  }, [file, editor, setIsUploading])

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