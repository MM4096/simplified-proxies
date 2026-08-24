"use client";

import {useEffect, useState} from "react";
import "../../../styles/carousel/carousel.css"

import Image from "next/image";

/**
 * Carousel for a list of images
 * @param components
 * @param components.standardPaths prefix, paths, and suffix for each of the images to display
 * @param components.time time between card transitions, in milliseconds
 * @param components.className any additional classes to add to the carousel
 * @constructor
 */
export function Carousel({standardPaths, time, className}: {
	standardPaths: { prefix: string, paths: Array<string>, suffix: string },
	time: number,
	className?: string
}) {
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const [hasSetInterval, setHasSetInterval] = useState<boolean>(false);

	useEffect(() => {
		if (!hasSetInterval) {
			setInterval(() => {
				setActiveIndex((prevState) => {
					return (prevState + 1) % standardPaths.paths.length;
				})
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