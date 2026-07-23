"use client";

// import {ShrinkText} from "@/app/components/shrinkText";
import {useState} from "react";
import {AutoTextSize} from "auto-text-size";

export default function ShrinkTextTestPage() {
	const [text, setText] = useState<string>();

	return (<div className="block">
		<AutoTextSize className="w-100 h-100" dangerouslySetInnerHTML={{
			__html: `<span>Test, Test, Test</span>`
		}}/>
	</div>)
}