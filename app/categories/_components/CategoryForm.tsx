"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { ceramicDocToOrbisRow } from "@/shared/orbis/utils";
import { CategorySchema, categorySchema } from "@/shared/schema/category";
import { OrbisDBRow } from "@/shared/types";
import { Category } from "@/shared/types/category";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { produce } from "immer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useCategory from "../_hooks/useCategory";
import AuthGuard from "@/shared/components/AuthGuard";
import { createCategory, editCategory } from "../actions";
import useAuth from "@/shared/hooks/useAuth";
import { set } from "date-fns";

type Props = { id?: string };
const CategoryForm = ({ id }: Props = {}) => {
  const router = useRouter();
  const { authInfo } = useAuth();
  const [controller, setController] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const { control, handleSubmit, setValue } = form;

  const { categoryQuery } = useCategory({
    id,
  });

  useEffect(() => {
    const category = categoryQuery.data;
    if (category?.controller) setController(category.controller);
    if (!category) return;
    setValue("name", category.name);
    setValue("description", category.description);
  }, [setValue, categoryQuery.data]);

  const categoryMutation = useMutation({
    mutationKey: ["create-category"],
    mutationFn: async (values: CategorySchema) => {
      if (id) {
        return await editCategory({ ...values, stream_id: id });
      }
      return await createCategory(values);
    },
    onSuccess: (response) => {
      if (!response?.id) return;
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        // Update category list queries
        queryClient.setQueriesData(
          {
            queryKey: ["categories"],
          },
          produce((categories?: InfiniteData<OrbisDBRow<Category>[]>) => {
            if (!categories) return;
            const { pages } = categories;
            outerLoop: for (let i = 0; i < pages.length; i++) {
              const page = pages[i];
              for (let j = 0; j < page.length; j++) {
                const category = page[j];
                if (category.stream_id === id) {
                  Object.assign(category, response.content);
                  break outerLoop;
                }
              }
            }
          }),
        );

        // Update category query
        queryClient.setQueryData(
          ["category", { id }],
          produce((staleData: OrbisDBRow<Category>) => {
            if (staleData && staleData.stream_id === response.id)
              Object.assign(staleData, response.content);
          }),
        );
      } else {
        const newCategory = ceramicDocToOrbisRow(response);
        queryClient.setQueriesData(
          {
            queryKey: ["categories"],
          },
          produce((categories?: InfiniteData<OrbisDBRow<Category>[]>) => {
            if (!categories) return;
            const { pages = [] } = categories;
            if (pages) {
              if (pages.length) {
                pages[pages.length - 1].unshift(newCategory);
              } else {
                pages[0] = [newCategory];
              }
            }
          }),
        );
      }
      router.push("/categories");
    },
    onError: (error) => {
      alert(error);
    },
  });

  if (categoryQuery.isLoading) return "Loading...";

  return (
    <AuthGuard message="Sign in to create categories.">
      {controller === authInfo?.user?.did ?

        (<Form {...form}>
          <form
            className="w-full space-y-5"
            onSubmit={handleSubmit((values) => categoryMutation.mutate(values))}
          >
            <FormField
              control={control}
              name="name"
              render={({ field, fieldState: { error } }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Category name" error={error} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={control}
              name="description"
              render={({ field, fieldState: { error } }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Category description"
                        rows={1}
                        className="min-h-12"
                        error={error}
                        autoGrow
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="flex justify-end gap-3">
              <Button
                type="submit"
                loading={categoryMutation.isPending}
                loadingText={`${id ? "Updating" : "Creating"} Category`}
              >
                {id ? "Update" : "Create"} Category
              </Button>
            </div>
          </form>
        </Form>)
        : <div className="p-4 border border-gray-300 rounded-lg shadow-sm">
          <p className="font-medium text-lg text-gray-900">{categoryQuery.data?.name}</p>
          <p className="text-sm text-gray-700">{categoryQuery.data?.description}</p>
          <hr className="my-3 border-gray-300" />
          <div className="bg-red-100 p-2 rounded-md border border-red-300">
            <p className="font-medium text-red-600">Access Denied</p>
            <p className="text-sm text-red-600">You are not the controller of this category.</p>
          </div>
        </div>
      }
    </AuthGuard>
  );
};
export default CategoryForm;
