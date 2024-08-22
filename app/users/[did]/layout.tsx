import { PropsWithChildren } from "react"

const ProfileLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="container mx-auto max-w-[600px] flex-1 pb-10">{children}</div>
  )
}
export default ProfileLayout