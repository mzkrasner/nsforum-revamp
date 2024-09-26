import Link from "next/link";
import { Button, ButtonProps } from "./ui/button";

const AddProfileButton = (props: ButtonProps) => {
  return (
    <Button {...props} asChild>
      <Link href="/profile/edit">Add profile</Link>
    </Button>
  );
};
export default AddProfileButton;
