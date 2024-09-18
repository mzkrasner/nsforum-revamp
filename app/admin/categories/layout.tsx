import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Categories",
};

const AdminCategoriesLayout = ({ children }: PropsWithChildren) => children;
export default AdminCategoriesLayout;
