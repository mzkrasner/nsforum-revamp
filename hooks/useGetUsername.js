import { useContext, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { UsernameVerificationContext } from "../contexts/UsernameVerificationContext";
import { shortAddress } from "../utils";

export default function useGetUsername(props = {}) {
	const { profile, address, did } = props;
	const [usernameVerification = {}, setUsernameVerification] = useContext(
		UsernameVerificationContext
	);
	const { verifications = {}, verifyingDids } = usernameVerification;

	const addDidsToVerifyingDids = (dids) => {
		setUsernameVerification((usernameVerification = {}) => {
			const { verifyingDids = [] } = usernameVerification;
			return {
				...usernameVerification,
				verifyingDids: [
					...new Set([...verifyingDids, ...dids].filter((v) => !!v)),
				],
			};
		});
	};

	const removeDidsFromVerifyingDids = (dids = []) => {
		setUsernameVerification((usernameVerification = {}) => {
			const { verifyingDids = [] } = usernameVerification;
			return {
				...usernameVerification,
				verifyingDids: verifyingDids.filter((v) => !dids.includes(v)),
			};
		});
	};

	const updateVerifications = (newVerifications) => {
		setUsernameVerification((usernameVerification = {}) => {
			const { verifications = {} } = usernameVerification;
			return {
				...usernameVerification,
				verifications: { ...verifications, ...newVerifications },
			};
		});
	};

	const getUsernameVerification = async (
		verificationData,
		forceUpdate = false
	) => {
		const newVerifyingDids = verificationData.map((d) => d?.did);
		try {
			const checkedDids = Object.keys(verifications || {});
			if (!forceUpdate) {
				// prune verificatData of all users that have been checked
				checkedDids.forEach((checkedDid) => {
					delete verificationData[checkedDid];
				});
			}

			if (!verificationData?.length) return;

			addDidsToVerifyingDids(newVerifyingDids);
			const { data: newVerifications } = await axios.post(
				"https://s5n3r9eg8h.execute-api.us-east-1.amazonaws.com/verify-usernames",
				{ verificationData }
			);
			return newVerifications;
		} catch (error) {
			removeDidsFromVerifyingDids(newVerifyingDids);
			throw new Error(error);
		}
	};

	const { mutate } = useMutation({
		mutationKey: ["username-verification"],
		mutationFn: getUsernameVerification,
		onSuccess: (newVerifications) => {
			if (!newVerifications) return;
			removeDidsFromVerifyingDids(Object.keys(newVerifications));
			updateVerifications(newVerifications);
		},
	});

	useEffect(() => {
		if (!did || !profile) return;
		const username = profile.username;
		mutate([{ username, did }]);
	}, [did]);

	let username;
	if (profile && profile.username) {
		username = profile.username;
	} else if (profile && profile.body?.name) {
		username = profile.body.name;
	} else if (address) {
		username = shortAddress(address);
	} else {
		username = shortAddress(did);
	}
	return {
		username,
		verified: did && verifications && verifications[did],
		verifying: did && verifyingDids?.length && verifyingDids.includes(did),
		verifyUsernames: mutate,
	};
}
