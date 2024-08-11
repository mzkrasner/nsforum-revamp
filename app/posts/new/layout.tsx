import { ReactNode } from "react";

type Props = { children: ReactNode };
const NewPostPageLayout = ({ children }: Props) => {
  return <div className="container my-10">{children}</div>;
};
export default NewPostPageLayout;
