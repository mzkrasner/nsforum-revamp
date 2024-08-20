import PageHeading from "@/shared/components/PageHeading";
import ProfileForm from "../_components/ProfileForm";
import SectionHeading from "@/shared/components/SectionHeading";

const EditProfilePage = () => {
  return (
    <div className="container mx-auto max-w-[600px] flex-1 pb-10">
      <PageHeading>Account Settings</PageHeading>
      <SectionHeading>Profile</SectionHeading>
      <ProfileForm />
    </div>
  );
};
export default EditProfilePage;
