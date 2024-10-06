import { Button, ButtonProps } from "@/shared/components/ui/button";
import useAuth from "@/shared/hooks/useAuth";
import { usePrivy } from "@privy-io/react-auth";
import useProfile from "../hooks/useProfile";

type Props = Omit<ButtonProps, "onClick" | "loading" | "loadingText">;
const SignInButton = (props: Props) => {
  const { ready } = usePrivy();
  const { login } = useAuth();
  const { profileQuery } = useProfile();

  return (
    <Button
      variant="ghost"
      onClick={login}
      {...props}
      loading={!ready || profileQuery.isLoading}
      loadingText=""
    >
      Sign In
    </Button>
  );
};
export default SignInButton;
