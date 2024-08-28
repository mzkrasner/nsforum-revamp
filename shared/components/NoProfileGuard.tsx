import Link from "next/link";
import { Button } from "./ui/button";

type Props = { displayMessage?: string };
const NoProfileGuard = ({
  displayMessage = "You have not yet added a profile",
}: Props) => {
  return (
    <div className="m-auto flex flex-col gap-5 text-center text-neutral-500">
      {displayMessage}
      <Button className="mx-auto" asChild>
        <Link href="/profile/edit">Add profile</Link>
      </Button>
    </div>
  );
};
export default NoProfileGuard;
