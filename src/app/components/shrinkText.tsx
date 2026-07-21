"use client";

import {ReactNode, useEffect, useRef, useState} from "react";

export type Units = "px" | "rem" | "em" | "%";

export function ShrinkText({children, maxSize, minSize, units, step, className = "", dangerouslySetInnerHTML}: {
	children?: string | ReactNode,
	maxSize: number,
	minSize: number,
	units: Units,
	step: number,
	className?: string,
	dangerouslySetInnerHTML?: { __html: string | TrustedHTML}
}): ReactNode {
	const [size, setSize] = useState<number>(maxSize);
	const spanRef = useRef<HTMLSpanElement>(null);

	const isOverflowing = () => {
		if (spanRef.current == null) {
			return false;
		}
		return spanRef.current.scrollWidth > spanRef.current.clientWidth || spanRef.current.scrollHeight > spanRef.current.clientHeight;
	}

	useEffect(() => {
		console.log("effect")
		if (!spanRef.current) {
			return;
		}
		console.log("spanref is not null")

		if (isOverflowing()) {
			console.log("is overflowing")
			const newSize = Math.min(Math.max(minSize, size - step), maxSize);
			spanRef.current.style.setProperty(
				"font-size",
				newSize + units,
			);
			setSize(newSize);
		}
	}, [spanRef, maxSize, minSize, units, step]);

	return (<span className={className} ref={spanRef} dangerouslySetInnerHTML={dangerouslySetInnerHTML}>
		{children}
	</span>)
}