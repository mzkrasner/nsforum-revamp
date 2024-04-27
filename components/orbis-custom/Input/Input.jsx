import React, { useState, useEffect, useRef, useContext } from "react";
import { GlobalContext } from "../../../contexts/GlobalContext";
import { defaultTheme, getThemeValue, getStyle } from "../../../utils/themes";
import { useOrbis } from "@orbisclub/components";

/** Import CSS */
import styles from "./Input.module.css";
import clsx from "clsx";

const Input = ({
	type,
	rows = 2,
	name,
	color,
	style,
	children,
	placeholder,
	value,
	onChange,
	autofocus = false,
	icon = null,
	className = "",
}) => {
	const { orbis, user, theme } = useOrbis();
	const inputRef = useRef(null);

	useEffect(() => {
		if (inputRef.current && autofocus == true) {
			inputRef.current.focus();
		}
	}, []);

	switch (type) {
		case "text":
			return (
				<input
					type="text"
					ref={inputRef}
					name={name}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					className={clsx(styles.input, className)}
					style={{
						...getThemeValue("font", theme, "input"),
						borderColor: getThemeValue("border", theme, "main"),
						...style,
					}}
				>
					{children}
				</input>
			);
		case "textarea":
			return (
				<textarea
					rows={2}
					ref={inputRef}
					name={name}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					className={clsx(styles.textarea, className)}
					style={{
						...getThemeValue("font", theme, "input"),
						borderColor: getThemeValue("border", theme, "main"),
						...style,
					}}
				/>
			);
		default:
			return null;
	}
};

export default Input;