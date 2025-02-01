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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import { uploadImageToPinata } from "@/shared/actions/pinata"; // Ensure upload function matches expected input

const ProfileForm = () => {
  const { address, isConnected } = useAccount();
  const { profile, saveMutation, profileQuery } = useProfile();
  const { name = "", username = "", image = "" } = profile || {};
  const [imagePreview, setImagePreview] = useState<string | null>(image);

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name,
      username,
      image,
    },
  });

  const { handleSubmit, control, watch, setValue, setError } = form;

  useEffect(() => {
    if (!watch("name") && name) setValue("name", name);
    if (!watch("username") && username) setValue("username", username);
    if (!watch("image") && image) setImagePreview(image);
  }, [watch, setValue, name, username, image]);

  // Image Upload Handler
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Create a FormData object and append the file
      const formData = new FormData();
      formData.append("file", file); // Adjust the key as needed for your upload function

      const ipfsUrl = await uploadImageToPinata(formData); // Upload FormData to Pinata
      if (ipfsUrl) {
        setValue("image", ipfsUrl); // Update form state
        console.log(ipfsUrl, "image");
      }
      setImagePreview(ipfsUrl); // Update preview image
    } catch (error) {
      console.error("Image upload failed:", error);
      setError("image", { type: "manual", message: "Image upload failed." });
    }
  };

  if (!isConnected) return null;
  if (profileQuery.isLoading) return "Loading...";

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((values) => {
          saveMutation.mutate(values, {
            onError: (error) => {
              if (error instanceof Error && error.message === "Username already taken") {
                setError("username", {
                  type: "manual",
                  message: "This username is already taken. Please choose another.",
                });
              }
            },
          });
        })}
        className="mx-auto flex w-full flex-col gap-3"
      >
        {/* Profile Image Upload */}
        <FormField
          control={control}
          name="image"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <div className="flex flex-col items-center gap-2">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="h-24 w-24 rounded-full object-cover" />
                  ) : (
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                  )}

                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name Input */}
        <FormField
          control={control}
          name="name"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} error={error} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Username Input */}
        <FormField
          control={control}
          name="username"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} error={error} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Save Button */}
        <Button type="submit" className="ml-auto mt-3 flex" loading={saveMutation.isPending} loadingText="Saving...">
          Save
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
