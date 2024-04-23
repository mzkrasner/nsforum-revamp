import { forwardRef } from "react";
import useOutsideClick from "../hooks/useOutsideClick";

const Modal = ({ children, handleClose }, ref) => {
	useOutsideClick(ref, handleClose);
	return (
		<div className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-40 z-[1000] max-h-screen overflow-y-auto">
			<div
				ref={ref}
				className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-main h-fit p-3 min-w-[80%] sm:min-w-[50%] min-h-[100px] rounded-3xl"
			>
				<button
					className="block w-fit mb-3 ml-auto"
					onClick={() => handleClose()}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6 text-primary"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18 18 6M6 6l12 12"
						/>
					</svg>
				</button>
				{children}
			</div>
		</div>
	);
};
export default forwardRef(Modal);
