import { ReactNode } from "react";

type Props = { children: ReactNode };
const NewPostPageLayout = ({ children }: Props) => {
  return <div className="container">{children}</div>;
};
export default NewPostPageLayout;
