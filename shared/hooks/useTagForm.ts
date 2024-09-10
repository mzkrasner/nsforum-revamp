import { zodResolver } from "@hookform/resolvers/zod";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { produce } from "immer";
import { useForm } from "react-hook-form";
import { createNewTag, fetchTagByName, updateTag } from "../orbis/queries";
import { ceramicDocToOrbisRow } from "../orbis/utils";
import { TagSchema, tagSchema } from "../schema/tag";
import { OrbisDBRow } from "../types";
import { Tag } from "../types/tag";

type Props = { tag?: OrbisDBRow<Tag>; onSave?: (tag: OrbisDBRow<Tag>) => void };

const useTagForm = ({ tag, onSave }: Props) => {
  const isEditing = tag?.stream_id;

  const queryClient = useQueryClient();

  const form = useForm<TagSchema>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag?.name || "",
      description: tag?.description || "",
    },
  });

  const saveFn = async (values: TagSchema) => {
    // Check to see if it exists
    const matchedTag = await fetchTagByName(values.name);
    if (matchedTag)
      throw new Error(`A tag with the name "${values.name}" aleady exists.`);

    if (tag?.stream_id) {
      return await updateTag(tag.stream_id, values);
    } else {
      return await createNewTag(values);
    }
  };

  const saveMutation = useMutation({
    mutationKey: ["save-tag"],
    mutationFn: saveFn,
    onSuccess: (res) => {
      if (!res) return;
      const newTag = ceramicDocToOrbisRow(res);
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.setQueriesData(
        { queryKey: ["tags"] },
        produce((staleData?: InfiniteData<OrbisDBRow<Tag>[]>) => {
          if (!staleData) return;
          const { pages = [] } = staleData;
          if (isEditing) {
            for (const page of pages) {
              for (const tag of page) {
                if (tag.stream_id === res.id) Object.assign(tag, newTag);
              }
            }
          } else {
            if (pages) {
              if (pages.length) {
                pages[pages.length - 1].unshift(newTag);
              } else {
                pages[0] = [newTag];
              }
            }
          }
        }),
      );
      onSave?.(newTag);
    },
  });

  return { form, saveMutation };
};

export default useTagForm;
