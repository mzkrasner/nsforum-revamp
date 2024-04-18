import React, { useState, useEffect, useRef, useContext } from "react";
import { GlobalContext } from "../../../contexts/GlobalContext";
import { defaultTheme, getThemeValue, getStyle } from "../../../utils/themes";
import { useOrbis } from "@orbisclub/components";

/** Import CSS */
import styles from "./Alert.module.css";

const Alert = ({ color, style, tooltip, title, icon }) => {
	const { orbis, user, theme } = useOrbis();
	return (
		<div className={styles.emptyState} style={style}>
			{icon}
			<p style={{ fontSize: 13 }}>{title}</p>
		</div>
	);
};

export default Alert;
