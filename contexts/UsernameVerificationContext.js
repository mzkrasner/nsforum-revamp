import React, { useState, useEffect, useContext } from "react";
export const UsernameVerificationContext = React.createContext({
	verifyingDids: [],
	verifications: {},
});
