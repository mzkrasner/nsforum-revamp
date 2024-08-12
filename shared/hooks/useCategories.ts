import { Category } from "../schema/category";

const useCategories = () => {
  const categories: Category[] = [
    {
      id: "0",
      name: "Category 0",
      description: "Lorem Ipsum dolor amet consectur",
    },
    {
      id: "1",
      name: "Category 1",
      description: "Lorem Ipsum dolor amet consectur",
    },
    {
      id: "2",
      name: "Category 2",
      description: "Lorem Ipsum dolor amet consectur",
    },
    {
      id: "3",
      name: "Category 3",
      description: "Lorem Ipsum dolor amet consectur",
    },
    {
      id: "4",
      name: "Category 4",
      description: "Lorem Ipsum dolor amet consectur",
    },
    {
      id: "5",
      name: "Category 5",
      description: "Lorem Ipsum dolor amet consectur",
    },
  ];

  return { categories };
};

export default useCategories;
