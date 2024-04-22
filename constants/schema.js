import { object, string } from "yup";

const BLACKLISTED_USERNAMES = ["system"];

export const userProfileSchema = object({
	username: string()
		.lowercase()
		.matches(
			/^[a-z0-9_]+$/,
			"Username can only contain lowercase letters, numbers, and underscores"
		)
		.test({
			name: "blacklisted",
			exclusive: true,
			test(value, ctx) {
				if (BLACKLISTED_USERNAMES.includes(value.toLocaleLowerCase())) {
					return ctx.createError({
						message: `Username "${value}" cannot be used as it is blacklisted`,
					});
				}
				return true;
			},
		})
		.required("Username is required"),
	description: string(),
});
