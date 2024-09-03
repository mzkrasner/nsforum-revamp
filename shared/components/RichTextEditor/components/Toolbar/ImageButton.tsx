import { Toggle } from "@/shared/components/ui/toggle";
import { ToggleProps } from "@radix-ui/react-toggle";
import { ImageIcon, LoaderIcon } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import useEditorContext from "../../hooks/useEditorContext";

const ImageButton = ({ onClick, ...props }: ToggleProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { editor, uploadImage: _uploadImage } = useEditorContext();
  const uploadImage = useRef(_uploadImage).current;

  useEffect(() => {
    const handleImageFile = async () => {
      if (file && editor) {
        setIsUploading(true);
        try {
          const cid = await uploadImage?.(file);
          if (!cid) throw new Error('No cid returned by uploadImage');
          editor
            .chain()
            .focus()
            .setImage({
              src: `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`,
            })
            .run();
        } catch (error) {
          console.error(error);
          alert("An error occurred while uploading image");
        }
        setIsUploading(false);
      }
    };
    handleImageFile();
  }, [file, editor, setIsUploading, uploadImage]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.length && e.target.files[0];
    if (!file) return;
    setFile(file);
    e.target.value = "";
  };

  if (!uploadImage) return

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
      <Toggle
        size="sm"
        className="h-8 w-8"
        {...props}
        onClick={(e) => {
          inputRef.current?.click();
          onClick?.(e);
        }}
      >
        {isUploading ? (
          <LoaderIcon className="w-3.5" />
        ) : (
          <ImageIcon className="w-3.5" />
        )}
      </Toggle>
    </>
  );
};
export default ImageButton;
