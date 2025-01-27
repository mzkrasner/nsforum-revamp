import { Button, ButtonProps } from "@/shared/components/ui/button";
import useAuth from "@/shared/hooks/useAuth";
import { useAccount } from "wagmi";

type Props = Omit<ButtonProps, "onClick">;
const SignOutButton = (props: Props) => {
  const { logout } = useAuth();
  const { isConnected } = useAccount();
  if (!isConnected) return null;

  return (
    <Button variant="ghost" onClick={logout} {...props}>
      Log out
    </Button>
  );
};
export default SignOutButton;
