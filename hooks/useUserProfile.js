import { usePathname, useRouter } from "next/navigation";
import { useOrbis } from "@orbisclub/components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useUserProfile = (props = {}) => {
	const { oauth_verifier, oauth_token } = props;
	const { user, orbis } = useOrbis();
	const { did = "", profile } = user || {};

	const pathname = usePathname();
	const router = useRouter();

	const queryClient = useQueryClient();

	const getXOauthLink = async (username) => {
		if (!did) return null;
		if (username !== user.username) await orbis.updateProfile({ username });
		const { data } = await axios.post("/api/x-oauth/link", { did, pathname });
		return data?.url || null;
	};

	const XOauthLinkMutation = useMutation({
		mutationKey: ["x-oauth-link", did],
		mutationFn: getXOauthLink,
		onSuccess: (url) => {
			window.open(url, "_blank");
		},
	});

	const getVerifiedUsername = async () => {
		if (!did) return null;
		const { data } = await axios.post("/api/profile/verified-username", {
			did,
		});
		return data;
	};

	const verifiedUsernameQuery = useQuery({
		queryKey: ["verified-username", did],
		queryFn: getVerifiedUsername,
	});

	const XOauthCallbackApiCall = async () => {
		if (!did || !oauth_verifier || !oauth_token) return null;
		const username = profile?.username;
		if (!oauth_token || !oauth_verifier || !username || !did) return;
		const res = await axios.post("/api/x-oauth/callback", {
			oauth_token,
			oauth_verifier,
			username,
			did,
		});
		const { data = {} } = res;
		const { success, pathname, error } = data;
		if (success) {
			queryClient.setQueryData(["verified-username", did], { username });
			queryClient.invalidateQueries({
				queryKey: ["verified-username", did],
			});
			router.push(pathname);
		}
		return data || null;
	};

	const XOauthCallbackQuery = useQuery({
		queryKey: ["x-oauth-callback", { did, oauth_verifier, oauth_token }],
		queryFn: XOauthCallbackApiCall,
	});

	return {
		profile,
		XOauthLinkMutation,
		XOauthCallbackQuery,
		verifiedUsernameQuery,
	};
};

export default useUserProfile;
