import CustomBreadcrumb from "@/shared/components/CustomBreadcrumb";
import PageHeading from "@/shared/components/PageHeading";
import CategorySuggestionForm from "../_components/CategorySuggestionForm";

const breadcrumbItems = [
  {
    name: "Categories",
    href: "/categories",
  },
  {
    name: "Suggest Category",
    active: true,
  },
];

const SuggestCategoryPage = () => {
  return (
    <div className="container mx-auto flex max-w-[640px] flex-1 flex-col pb-10">
      <CustomBreadcrumb items={breadcrumbItems} />
      <PageHeading className="mt-5">Suggest Category</PageHeading>
      <CategorySuggestionForm />
    </div>
  );
};
export default SuggestCategoryPage;
