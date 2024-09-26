import { Button, ButtonProps } from "@/shared/components/ui/button";
import useAuth from "@/shared/hooks/useAuth";
import { usePrivy } from "@privy-io/react-auth";

type Props = Omit<ButtonProps, "onClick">;
const SignOutButton = (props: Props) => {
  const { ready } = usePrivy();
  const { logout } = useAuth();
  if (!ready) return null;

  return (
    <Button variant="ghost" onClick={logout} {...props}>
      Log out
    </Button>
  );
};
export default SignOutButton;
