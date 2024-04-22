import clsx from "clsx";

const Error = ({ message, className = "", ...props }) => {
	if (!message) return null;
	return (
		<div className={clsx("text-red-500 mt-1 text-xs", className)} {...props}>
			{message}
		</div>
	);
};
export default Error;
