"use client";

import Script from "next/script";
import {useCallback} from "react";

export async function Analytics() {
	return (<>
		{
			process.env.NODE_ENV === "production" && (
				<Script src="https://cloud.umami.is/script.js" data-website-id="9aa6f2e5-7a33-4efc-be6f-d12d9733e183"/>)
		}
	</>)
}

export function useUmamiEvent() {
	return useCallback((name: string, data?: Record<string, unknown>) => {
		// if window doesn't exist, this function can't be called
		if (typeof window === "undefined") {
			return
		}

		const umami = (window as any).umami;
		if (!umami || typeof umami.track !== "function") {
			return;
		}

		try {
			umami.track(name, data);
		} catch (err) {
			console.warn("Failed to track event", err);
		}
	}, [])
}