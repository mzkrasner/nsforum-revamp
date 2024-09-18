import useProfile from "@/shared/hooks/useProfile";
import { BadgeCheckIcon } from "lucide-react";
import Link from "next/link";
import useUser from "../hooks/useUser";
import { cn } from "../lib/utils";

type Props = { did: string; className?: string; placeholder?: string };
const UserDisplay = ({ did, className = "", placeholder }: Props) => {
  const { profile } = useProfile();
  const { user, query } = useUser({ did });

  if (query.isLoading && !placeholder) return "Loading...";

  const { username = "", verified = false } = user || {};

  const href = did === profile?.controller ? "/profile" : `/users/${did}`;

  return (
    <Link
      href={href}
      className={cn(
        "link inline-flex items-center gap-1 leading-none",
        className,
      )}
    >
      {username || placeholder}
      {verified && (
        <BadgeCheckIcon className="w-5 fill-gray-700 stroke-white" />
      )}
    </Link>
  );
};
export default UserDisplay;
