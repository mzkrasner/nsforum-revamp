"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import useProfile from "@/shared/hooks/useProfile";
import { ProfileFormType, profileSchema } from "@/shared/schema/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAccount } from "wagmi";

const ProfileForm = () => {
  const { address, isConnected } = useAccount();

  const { profile, saveMutation, profileQuery } = useProfile();
  const { name = "", username = "" } = profile || {};

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name,
      username,
    },
  });
  const { handleSubmit, control, watch, setValue } = form;

  useEffect(() => {
    // if (!watch("email") && privyEmail) setValue("email", privyEmail);
    // if (!watch("phone") && privyPhone) setValue("phone", privyPhone);
    if (!watch("name") && name) setValue("name", name);
    if (!watch("username") && username) setValue("username", username);
  }, [watch, setValue, name, username]);

  if (!isConnected) return;

  if (profileQuery.isLoading) return "Loading...";

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((v) => saveMutation.mutate(v))}
        className="mx-auto flex w-full flex-col gap-3"
      >
        <FormField
          control={control}
          name="name"
          render={({ field, fieldState: { error } }) => {
            return (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input {...field} error={error} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={control}
          name="username"
          render={({ field, fieldState: { error } }) => {
            return (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} error={error} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button
          type="submit"
          className="ml-auto mt-3 flex"
          loading={saveMutation.isPending}
          loadingText="Saving..."
        >
          Save
        </Button>
      </form>
    </Form>
  );
};
export default ProfileForm;
