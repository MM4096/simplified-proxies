"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";

export default function NotFound() {
	const router = useRouter();

	return (<div className="flex flex-col items-left h-full justify-center gap-2 max-w-1/2">
		<h1>:)</h1>
		<h2>Page not Found</h2>
		<p>This page can&apos;t be found. It&apos;s OK though, you can just <button className="link" onClick={() => {
			router.back();
		}}>go back</button> to
			the previous page, or <Link href="/" className="link">go home</Link> and try again!
		</p>
	</div>)
}