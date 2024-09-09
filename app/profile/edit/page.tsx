import PageHeading from "@/shared/components/PageHeading";
import SectionHeading from "@/shared/components/SectionHeading";
import ProfileForm from "../_components/ProfileForm";
import Verification from "../_components/Verification";

const EditProfilePage = () => {
  return (
    <>
      <PageHeading back="/profile">Account Settings</PageHeading>
      <SectionHeading>Profile</SectionHeading>
      <ProfileForm />
      {/* <SectionHeading id="verification">Verification</SectionHeading>
      <Verification /> */}
    </>
  );
};
export default EditProfilePage;
