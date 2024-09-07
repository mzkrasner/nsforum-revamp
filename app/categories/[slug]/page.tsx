import PageHeading from "@/shared/components/PageHeading";
import PostFilters from "@/shared/components/PostFilters";
import PostList from "@/shared/components/PostList";
import CategoryBreadcrumb from "../_components/CategoryBreadcrumb";
import CategoryDescription from "../_components/CategoryDescription";

const CategoryPage = () => {
  return (
    <div className="container">
      <CategoryBreadcrumb />
      <PageHeading>General</PageHeading>
      <div className="mb-10 md:grid md:grid-cols-[1fr_320px]">
        <section>
          <CategoryDescription />
          <div className="mb-5 mt-10 flex items-center justify-between">
            <PostFilters category={false} />
          </div>
          <PostList />
        </section>
      </div>
    </div>
  );
};
export default CategoryPage;
