import { BadgeCheckIcon } from "lucide-react"
import useUser from "../hooks/useUser"

type Props = { did: string }
const User = ({ did }: Props) => {
  const { user, query } = useUser({ did });
  if (query.isLoading) return 'Loading...'
  return (
    <span className="inline-flex items-center gap-1 leading-none text-muted-foreground">
      {user?.username}
      {user?.verfied && <BadgeCheckIcon className="w-5 fill-gray-700 stroke-white" />}
    </span>
  )
}
export default User