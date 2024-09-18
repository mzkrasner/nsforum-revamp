import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: {
    template: "Admin %s | Network Society Forum",
    default: "Admin",
  },
};

const AdminLayout = ({ children }: PropsWithChildren) => children;
export default AdminLayout;
