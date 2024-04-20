import { object, string } from "yup";

const BLACKLISTED_USERNAMES = ["system"];

export const userProfileSchema = object({
	username: string().test({
		name: "blacklisted",
		exclusive: true,
		test(value, ctx) {
			if (BLACKLISTED_USERNAMES.includes(value.toLocaleLowerCase())) {
				return ctx.createError({
					message: `The username "${value}" cannot be used as it is blacklisted`,
				});
			}
			return true;
		},
	}),
	description: string(),
});
