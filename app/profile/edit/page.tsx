import PageHeading from "@/shared/components/PageHeading";
import ProfileForm from "../_components/ProfileForm";

const EditProfilePage = () => {
  return (
    <div className="container mx-auto max-w-[600px] flex-1 pb-10">
      <PageHeading>Account Settings</PageHeading>
      <ProfileForm />
    </div>
  );
};
export default EditProfilePage;
