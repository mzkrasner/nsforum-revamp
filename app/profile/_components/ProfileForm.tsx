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
import useAuth from "@/shared/hooks/useAuth";
import useProfile from "@/shared/hooks/useProfile";
import { ProfileFormType, profileSchema } from "@/shared/schema/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLinkAccount, usePrivy } from "@privy-io/react-auth";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const ProfileForm = () => {
  const { user, authenticated } = usePrivy();
  const authEmail = user?.email?.address;
  const { linkPhone, linkTwitter } = useLinkAccount();
  const { linkedPhone, linkedXAcct } = useAuth();

  const { profile, saveMutation, profileQuery } = useProfile();
  const { name = "", username = "", email = "" } = profile || {};

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name,
      username,
      email: email || authEmail || "",
    },
  });
  const { handleSubmit, control, watch, setValue } = form;

  useEffect(() => {
    if (!watch("email") && authEmail) setValue("email", authEmail);
    if (!watch("name") && name) setValue("name", name);
    if (!watch("username") && username) setValue("username", username);
  }, [watch, setValue, authEmail, name, username]);

  if (!authenticated) return;

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
                  {/* <div className="flex items-center gap-3"> */}
                  <Input {...field} error={error} />
                  {/* <Button
                      variant="outline"
                      className="ml-auto flex w-fit gap-1 px-2 text-sm"
                    >
                      <LockOpenIcon size={16} /> Lock
                    </Button>
                  </div> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={control}
          name="email"
          render={({ field, fieldState: { error } }) => {
            return (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} error={error} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormItem>
          <FormLabel>Phone number</FormLabel>
          <FormControl>
            <div className="flex items-center gap-3">
              <Input
                placeholder="No phone number added"
                value={linkedPhone?.number || ""}
                readOnly
              />
              <Button
                variant="outline"
                className="ml-auto flex w-fit gap-1 px-2 text-sm"
                onClick={linkPhone}
              >
                <PlusIcon size={16} /> Add
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>X account</FormLabel>
          <FormControl>
            <div className="flex items-center gap-3">
              <Input
                placeholder="No account added"
                value={linkedXAcct?.username || ""}
                readOnly
              />
              <Button
                variant="outline"
                className="ml-auto flex w-fit gap-1 px-2 text-sm"
                onClick={linkTwitter}
              >
                <PlusIcon size={16} /> Add
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
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
