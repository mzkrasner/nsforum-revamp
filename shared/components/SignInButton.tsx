import { Button, ButtonProps } from "@/shared/components/ui/button";
import useAuth from "@/shared/hooks/useAuth";
import useProfile from "../hooks/useProfile";

type Props = Omit<ButtonProps, "onClick" | "loading" | "loadingText">;
const SignInButton = (props: Props) => {
  const { login } = useAuth();
  const { profileQuery } = useProfile();

  return (
    <Button
      variant="ghost"
      onClick={login}
      {...props}
      loading={profileQuery.isLoading}
      loadingText=""
    >
      Sign In
    </Button>
  );
};
export default SignInButton;
