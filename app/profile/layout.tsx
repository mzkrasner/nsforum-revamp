import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | Network Society Forum",
    default: "Profile",
  },
};

const ProfileLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="container mx-auto flex max-w-[600px] flex-1 flex-col pb-10">
      {children}
    </div>
  );
};
export default ProfileLayout;
