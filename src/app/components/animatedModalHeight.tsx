"use client";

import {ReactNode, useEffect, useRef, useState} from "react";

export default function AnimatedModalHeight({children}: {children: ReactNode}) {
	const divRef = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(0);

	useEffect(() => {
		if (divRef.current) {
			setHeight(divRef.current.scrollHeight);
		}
	}, [children]);

	return (
		<div style={{height: height + "px"}} className="overflow-hidden transition-all duration-200 ease-out">
			<div ref={divRef}>
				{children}
			</div>
		</div>
	)
}