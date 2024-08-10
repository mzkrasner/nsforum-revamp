import { ReactNode } from "react";

type Props = { children: ReactNode };
const PostPageLayout = ({ children }: Props) => {
  return (
    <div className="container mt-10 md:grid md:grid-cols-[280px_1fr]">
      <div></div>
      <div>{children}</div>
    </div>
  );
};
export default PostPageLayout;
