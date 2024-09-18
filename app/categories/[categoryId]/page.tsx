import CustomBreadcrumb from "@/shared/components/CustomBreadcrumb";
import PageHeading from "@/shared/components/PageHeading";
// import PostFilters from "@/shared/components/PostFilters";
import PostList from "@/shared/components/PostList";
import { fetchCategory } from "@/shared/orbis/queries";
import { cache } from "react";

export const generateMetadata = async ({
  params,
}: {
  params: { categoryId: string };
}) => {
  const categoryId = params?.categoryId;
  const defaultMetaData = {
    title: "Category",
  };
  if (!categoryId) return defaultMetaData;

  const cachedFetchCategory = cache(
    async () => await fetchCategory({ stream_id: categoryId }),
  );

  const category = await cachedFetchCategory();
  if (!category) return defaultMetaData;

  return {
    title: category?.name ? `${category.name} category` : defaultMetaData.title,
    description: category?.description || undefined,
  };
};

type Props = {
  params: { categoryId: string };
};
const CategoryPage = async ({ params: { categoryId } }: Props) => {
  const category = await fetchCategory({ stream_id: categoryId });

  const breadcrumbItems = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Categories",
      href: "/categories",
    },
    {
      name: category?.name || "",
      active: true,
    },
  ];

  return (
    <div className="container">
      <div className="mx-auto mb-10 max-w-2xl">
        <CustomBreadcrumb items={breadcrumbItems} />
        <PageHeading>{category?.name}</PageHeading>
        <section>
          <p>{category?.description}</p>
          <div className="mb-5 mt-10 flex items-center justify-between">
            {/* <PostFilters category={false} /> */}
          </div>
          <PostList
            fetchPostsOptions={{ filter: { category: category?.stream_id } }}
          />
        </section>
      </div>
    </div>
  );
};
export default CategoryPage;
