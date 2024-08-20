import PageHeading from "@/shared/components/PageHeading";
import ProfileForm from "../_components/ProfileForm";
import SectionHeading from "@/shared/components/SectionHeading";

const EditProfilePage = () => {
  return (
    <>
      <PageHeading>Account Settings</PageHeading>
      <SectionHeading>Profile</SectionHeading>
      <ProfileForm />
    </>
  );
};
export default EditProfilePage;
