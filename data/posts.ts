import { Post } from "@/shared/schema/post";

export const posts: Post[] = [
  {
    body: "This is the body of the first post. It covers basic concepts of inclusive design.",
    title: "Introduction to Inclusive Design",
    category: "Design",
    tags: ["inclusive", "design", "accessibility"],
    status: "published",
    stream_id: "stream123",
  },
  {
    body: "This post explores the challenges faced by DHH students in mainstream education.",
    title: "Challenges for DHH Students in Mainstream Education",
    category: "Education",
    tags: ["DHH", "education", "challenges"],
    status: "published",
    stream_id: null,
  },
  {
    body: "A draft post on the future of React Native.",
    title: "The Future of React Native",
    category: "Technology",
    tags: ["React Native", "mobile", "development"],
    status: "draft",
  },
  {
    body: "This is a deleted post about nursing careers.",
    title: "Exploring Nursing Careers",
    category: "Career",
    tags: ["nursing", "career", "healthcare"],
    status: "deleted",
  },
  {
    body: "Published content on the integration of DHH students with non-DHH peers.",
    title: "Integration Strategies for DHH Students",
    category: "Education",
    tags: ["DHH", "integration", "strategies"],
    status: "published",
  },
  {
    body: "A draft article on the latest trends in mobile app development.",
    title: "Mobile App Development Trends 2024",
    category: "Technology",
    tags: ["mobile", "development", "trends"],
    status: "draft",
  },
];
