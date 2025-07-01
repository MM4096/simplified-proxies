"use server";

import Script from "next/script";

export async function Analytics() {
	return (<>
		{
			process.env.NODE_ENV === "production" && (
				<Script src="https://cloud.umami.is/script.js" data-website-id="9aa6f2e5-7a33-4efc-be6f-d12d9733e183"/>)
		}
	</>)
}