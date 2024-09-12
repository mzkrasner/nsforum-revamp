import { fetchCategories } from "@/shared/orbis/queries";
import { useQuery } from "@tanstack/react-query";

// TODO: Pass fetch options here
type Props = {
  id?: string;
};
const useCategory = ({ id }: Props = {}) => {
  const categoryQuery = useQuery({
    queryKey: ["admin", "category", { id }],
    queryFn: async () => {
      if (!id) return null;
      const categories = await fetchCategories({
        filter: { stream_id: id },
      });
      const category = categories.length ? categories[0] : null;
      return category;
    },
  });

  return { category: categoryQuery.data, categoryQuery };
};

export default useCategory;
