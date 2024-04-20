import React, { useState, useEffect, useRef, useContext } from "react";
import { GlobalContext } from "../../../contexts/GlobalContext";
import { defaultTheme, getThemeValue, getStyle } from "../../../utils/themes";
import { useOrbis } from "@orbisclub/components";

/** Import CSS */
import styles from "./Button.module.css";
import clsx from "clsx";

const Button = ({
	color,
	style,
	children,
	onClick,
	className = "",
	...rest
}) => {
	const { orbis, user, theme } = useOrbis();

	/** Select correct style based on the `color` parameter passed
  let btnStyle;
  switch (color) {
    case "primary":
      btnStyle = styles.btnPrimary;
      break;
    case "green":
      btnStyle = styles.btnPrimary;
      break;
  }*/
	return (
		<button
			{...rest}
			className={clsx(styles.btnPrimary, className)}
			style={{
				...getThemeValue("button", theme, color),
				...getThemeValue("font", theme, "buttons"),
				...style,
			}}
			onClick={onClick ? () => onClick() : null}
		>
			{children}
		</button>
	);
};

export default Button;
