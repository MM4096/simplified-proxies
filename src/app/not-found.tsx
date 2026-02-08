"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";

export default function NotFound() {
	const router = useRouter();

	return (<div className="flex flex-col items-left h-full justify-center gap-2 max-w-1/2">
		<h1>404: Page not Found</h1>
		<p>The page you are looking for does not exist.</p>
		<div className="flex flex-row items-center justify-center gap-4">
			<p className="link" onClick={() => {
				router.back()
			}}>Back</p>
			<Link className="link" href="/">Home</Link>
		</div>
		{/*<p>This page can&apos;t be found. You can <button className="link" onClick={() => {*/}
		{/*	router.back();*/}
		{/*}}>go back</button> to*/}
		{/*	the previous page, or <Link href="/" className="link">go home</Link> and try again!*/}
		{/*</p>*/}
	</div>)
}