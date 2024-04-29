import { useState, useRef } from "react";
import clsx from "clsx";
import useOutsideClick from "../hooks/useOutsideClick";

const Dropdown = (props = {}) => {
	const {
		label = "Select",
		options = [],
		onSelect = () => null,
		selectedOption,
		className = "",
	} = props;
	const [isOpen, setIsOpen] = useState(false);

	const ref = useRef();

	const openDropdown = () => !isOpen && setIsOpen(true);
	const closeDropdown = () => isOpen && setIsOpen(false);

	useOutsideClick(ref, closeDropdown);

	return (
		<div ref={ref} className={clsx("relative text-sm w-fit", className)}>
			<div
				onClick={openDropdown}
				className="w-fit px-3 py-2 rounded-full border border-brand text-brand cursor-pointer"
			>
				{selectedOption?.name || label}
			</div>
			{isOpen && (
				<ul className="absolute top-[calc(100%_+_10px)] right-0 h-fit w-fit px-3 py-2 rounded-xl border border-neutral-500 text-secondary bg-main z-10">
					{options.map((option) => {
						const { value, name } = option;
						const active = selectedOption?.value === value;
						return (
							<li
								key={value}
								className={clsx("py-2 px-3 whitespace-nowrap cursor-pointer", {
									"text-brand": active,
									"hover:text-brand": !active,
								})}
								onClick={() => {
									closeDropdown();
									onSelect(value);
								}}
							>
								{name}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};
export default Dropdown;
