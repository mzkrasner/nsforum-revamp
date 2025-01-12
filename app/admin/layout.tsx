import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: {
    template: "Admin %s | PoSciDonDAO Proposal Forum",
    default: "Admin",
  },
};

const AdminLayout = ({ children }: PropsWithChildren) => children;
export default AdminLayout;
