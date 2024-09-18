import { OrbisDBRow } from "@/shared/types";
import { Post } from "@/shared/types/post";
import { createContext } from "react";

export type PostContextType = { initialData?: OrbisDBRow<Post> | null };
export const PostContext = createContext<PostContextType>({});
