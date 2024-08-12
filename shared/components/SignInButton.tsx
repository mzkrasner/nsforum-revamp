import { Button, ButtonProps } from "@/shared/components/ui/button";
import useAuth from "@/shared/hooks/useAuth";
import { usePrivy } from "@privy-io/react-auth";

type Props = Omit<ButtonProps, "onClick">;
const SignInButton = (props: Props) => {
  const { ready } = usePrivy();
  const { login } = useAuth();

  if (!ready) return null;

  return (
    <Button variant="ghost" onClick={login} {...props}>
      Sign In
    </Button>
  );
};
export default SignInButton;
