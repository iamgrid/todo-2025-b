"use client";
import { useSyncExternalStore } from "react";

const getCurrentMouseStatus = () => {
	return window.matchMedia("(pointer: fine)").matches;
};

const getServerSnapshot = () => {
	return false;
};

const subscribeToMouseStatus = (callback: any) => {
	const media = window.matchMedia("(pointer: fine)");
	media.addEventListener("change", callback);
	return () => media.removeEventListener("change", callback);
};

export const useDoesUserHaveAProperMouse = () => {
	return useSyncExternalStore(subscribeToMouseStatus, getCurrentMouseStatus, getServerSnapshot);
};
