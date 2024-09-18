import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Tags",
};

const AdminTagsLayout = ({ children }: PropsWithChildren) => children;
export default AdminTagsLayout;
