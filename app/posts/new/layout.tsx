import { ReactNode } from "react";

type Props = { children: ReactNode };
const NewPostPageLayout = ({ children }: Props) => {
  return <div className="container flex flex-1 flex-col py-10">{children}</div>;
};
export default NewPostPageLayout;
