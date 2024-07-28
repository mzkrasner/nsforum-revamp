import { useCurrentEditor } from "@tiptap/react";
import { ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ToolbarButton from "./ToolbarButton";

const ImageButton = ({ onClick, ...props }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef(null);

  const { editor, uploadImage: _uploadImage } = useCurrentEditor();
  const uploadImage = useRef(_uploadImage).current;

  useEffect(() => {
    const handleImageFile = async () => {
      if (file && editor) {
        setIsUploading(true);
        try {
          const url = await uploadImage(file);
          if (!url) throw new Error();
          editor.chain().focus().setImage({ src: url }).run();
        } catch (error) {
          alert("An error occurred while uploading image");
        }
        setIsUploading(false);
      }
    };
    handleImageFile();
  }, [file, editor, setIsUploading, uploadImage]);

  const onInputChange = (e) => {
    const file = e.target.files?.length && e.target.files[0];
    if (!file) return;
    setFile(file);
    e.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onInputChange}
        className="hidden"
        hidden
      />
      <ToolbarButton
        {...props}
        onClick={(e) => {
          inputRef.current?.click();
          onClick && onClick();
        }}
      >
        <ImageIcon className="w-3.5" />
      </ToolbarButton>
    </>
  );
};
export default ImageButton;
