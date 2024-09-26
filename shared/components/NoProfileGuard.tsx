import AddProfileButton from "./AddProfileButton";

type Props = { displayMessage?: string };
const NoProfileGuard = ({
  displayMessage = "You have not yet added a profile",
}: Props) => {
  return (
    <div className="m-auto flex flex-col gap-5 text-center text-neutral-500">
      {displayMessage}
      <AddProfileButton className="mx-auto" />
    </div>
  );
};
export default NoProfileGuard;
