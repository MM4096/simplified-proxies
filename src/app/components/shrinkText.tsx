// "use client";
//
// import {ReactNode, useEffect, useRef, useState} from "react";
// import {setTimeout} from "node:timers";
//
// export type Units = "px" | "rem" | "em" | "%";
//
// export function ShrinkText({children, maxSize, minSize, units, step, className = "", dangerouslySetInnerHTML}: {
// 	children?: string | ReactNode,
// 	maxSize: number,
// 	minSize: number,
// 	units: Units,
// 	step: number,
// 	className?: string,
// 	dangerouslySetInnerHTML?: { __html: string | TrustedHTML}
// }): ReactNode {
// 	const [size, setSize] = useState<number>(maxSize);
// 	const spanRef = useRef<HTMLSpanElement>(null);
//
// 	const isOverflowing = () => {
// 		if (spanRef.current == null) {
// 			return false;
// 		}
// 		return spanRef.current.scrollWidth > spanRef.current.clientWidth || spanRef.current.scrollHeight > spanRef.current.clientHeight;
// 	}
//
// 	function setFontSize(size: number) {
// 		spanRef.current?.style.setProperty(
// 			"font-size",
// 			size + units,
// 		);
// 	}
//
// 	useEffect(() => {
// 		setFontSize(maxSize);
// 	}, [maxSize]);
//
// 	useEffect(() => {
// 		async function update() {
// 			while (isOverflowing()) {
// 				const newSize = Math.min(Math.max(minSize, size - step), maxSize);
// 				setFontSize(newSize);
// 				setSize(newSize);
// 				await setTimeout(1 / 120);
// 			}
// 		}
//
// 		update().then();
// 	}, [spanRef, minSize, units, step, children]);
//
// 	return (<span className={className} ref={spanRef} dangerouslySetInnerHTML={dangerouslySetInnerHTML}>
// 		{children}
// 	</span>)
// }