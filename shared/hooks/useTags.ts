import { Tag } from "../schema/tag";

const useTags = () => {
  const tags: Tag[] = [
    {
      id: "0",
      name: "Tag 0",
      description: "Lorem Ipsum dolor amet consectur",
    },
    {
      id: "1",
      name: "Tag 1",
      description: "Lorem Ipsum dolor amet consectur",
    },
    {
      id: "2",
      name: "Tag 2",
      description: "Lorem Ipsum dolor amet consectur",
    },
    {
      id: "3",
      name: "Tag 3",
      description: "Lorem Ipsum dolor amet consectur",
    },
    {
      id: "4",
      name: "Tag 4",
      description: "Lorem Ipsum dolor amet consectur",
    },
    {
      id: "5",
      name: "Tag 5",
      description: "Lorem Ipsum dolor amet consectur",
    },
  ];

  return { tags };
};

export default useTags;
