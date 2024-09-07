import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { FetchCategorySuggestionsOptions } from "@/shared/orbis/queries";
import { OrbisDBRow } from "@/shared/types";
import { CategorySuggestion } from "@/shared/types/category";
import { CheckIcon, XIcon } from "lucide-react";
import useCategorySuggestion from "../_hooks/useCategorySuggestion";

type Props = {
  categorySuggestion: OrbisDBRow<CategorySuggestion>;
  fetchOptions?: FetchCategorySuggestionsOptions;
  className?: string;
};
const CategorySuggestionCard = ({
  categorySuggestion,
  fetchOptions,
  className,
}: Props) => {
  const { name, description, stream_id } = categorySuggestion;

  const { acceptCategorySuggestionMutation, rejectCategorySuggestionMutation } =
    useCategorySuggestion({ id: stream_id, fetchOptions });

  return (
    <Card className={className}>
      <CardHeader className="p-3">
        <CardTitle className="text-base font-semibold">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="justify-end gap-2 p-3">
        <Button
          size="sm"
          variant="outline"
          className="gap-2 px-2 text-sm"
          onClick={() => rejectCategorySuggestionMutation.mutate()}
          loadingText="Rejecting..."
          loading={rejectCategorySuggestionMutation.isPending}
        >
          <XIcon size={14} />
          Reject
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 px-2 text-sm"
          onClick={() => acceptCategorySuggestionMutation.mutate()}
          loadingText="Accepting..."
          loading={acceptCategorySuggestionMutation.isPending}
        >
          <CheckIcon size={14} />
          Accept
        </Button>
        {/* TODO implement edits */}
        {/* <Button size="sm" variant="outline" className="gap-2 px-2">
          <EditIcon size={14} />
          Edit
        </Button> */}
      </CardFooter>
    </Card>
  );
};

export default CategorySuggestionCard;
