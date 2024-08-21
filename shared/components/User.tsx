import { BadgeCheckIcon } from "lucide-react"
import useUser from "../hooks/useUser"
import { cn } from "../lib/utils";

type Props = { did: string; className?: string }
const User = ({ did, className = '' }: Props) => {
  const { user, query } = useUser({ did });
  if (query.isLoading) return 'Loading...'
  return (
    <span className={cn("inline-flex items-center gap-1 leading-none text-muted-foreground", className)}>
      {user?.username}
      {user?.verfied && <BadgeCheckIcon className="w-5 fill-gray-700 stroke-white" />}
    </span>
  )
}
export default User