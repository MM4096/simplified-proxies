"use client";

import {useEffect, useState} from "react";
import "../styles/carousel/carousel.css"

import Image from "next/image";

export function Carousel({standardPaths, time, className}: {
	standardPaths: { prefix: string, paths: Array<string>, suffix: string },
	time: number,
	className?: string
}) {
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const [hasSetInterval, setHasSetInterval] = useState<boolean>(false);

	useEffect(() => {
		setHasSetInterval(true);
	}, []);

	useEffect(() => {
		if (!hasSetInterval) {
			setInterval(() => {
				setActiveIndex((activeIndex + 1) % standardPaths.paths.length);
			}, time);
			setHasSetInterval(true);
		}
	}, [activeIndex, hasSetInterval, standardPaths.paths.length, time]);

	return (
		<div className={`${className || ""} carousel-container`}>
			{
				standardPaths.paths.map((imagePath, index) => {
					return (
						<Image src={standardPaths.prefix + "/" + imagePath + standardPaths.suffix} alt={imagePath}
							   key={index} width={1000} height={0}
							   className={`carousel-item ${activeIndex === index ? "active" : ""}`}/>)
				})
			}
		</div>
	)
}