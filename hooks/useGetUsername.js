import { useContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { UsernameVerificationContext } from "../contexts/UsernameVerificationContext";
import { shortAddress } from "../utils";

export default function useGetUsername(props = {}) {
	const { profile, address, did } = props;
	const { usernameVerificationRef: verificationsRef, updateState } = useContext(
		UsernameVerificationContext
	);

	const updateVerifications = (dids = [], value) => {
		dids.forEach((did) => {
			verificationsRef.current[did] = value;
		});
		updateState((v) => v + 1);
	};

	const addNewVerifications = (newVerifications) => {
		verificationsRef.current = {
			...verificationsRef.current,
			...newVerifications,
		};
		updateState((v) => v + 1);
	};

	const getUsernameVerification = async (
		_verificationData,
		forceUpdate = false
	) => {
		// Dont repeat verification requests unless forceUpdate is true
		const verificationData = forceUpdate
			? _verificationData
			: _verificationData.filter(
					({ did }) => !(did in verificationsRef.current)
			  );

		if (!verificationData?.length) return;

		const verificationDids = verificationData.map(({ did }) => did);
		try {
			updateVerifications(verificationDids, "loading");
			const { data: newVerifications } = await axios.post(
				"https://s5n3r9eg8h.execute-api.us-east-1.amazonaws.com/verify-usernames",
				{ verificationData }
			);
			return newVerifications;
		} catch (error) {
			console.log(error);
			updateVerifications(verificationDids, "failed");
			throw new Error(error);
		}
	};

	const { mutate } = useMutation({
		mutationKey: ["username-verification"],
		mutationFn: getUsernameVerification,
		onSuccess: (newVerifications) => {
			if (!newVerifications) return;
			addNewVerifications(newVerifications);
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

	const verified = verificationsRef.current[did] === true;
	const verifying = verificationsRef.current[did] === "loading";

	return {
		username,
		verified,
		verifying,
		verifyUsernames: mutate,
	};
}
