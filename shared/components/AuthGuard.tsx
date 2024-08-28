import { usePrivy } from "@privy-io/react-auth";
import SignInButton from "./SignInButton";

type Props = {};
const AuthGuard = (props: Props) => {
  const { ready } = usePrivy();
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-5">
      <h3 className="font-medium">Sign in to view your profile</h3>
      {ready && <SignInButton variant="outline" className="mx-auto block" />}
    </div>
  );
};
export default AuthGuard;
