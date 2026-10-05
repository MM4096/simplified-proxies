"use client";

import {useEffect, useState} from "react";
import "../../../styles/carousel/carousel.css"

import Image from "next/image";

/**
 * Carousel for a list of images
 * @param components
 * @param components.standardPaths prefix, paths, and suffix for each of the images to display
 * @param components.activeIndex which card to display, is wrapped by this component
 * @param components.className any additional classes to add to the carousel
 * @constructor
 */
export function ImageCarousel({standardPaths, activeIndex, className}: {
	standardPaths: { prefix: string, paths: Array<string>, suffix: string },
	activeIndex: number,
	className?: string
}) {
	const [computedActiveIndex, setComputedActiveIndex] = useState<number>(0);

	useEffect(() => {
		setComputedActiveIndex(activeIndex % standardPaths.paths.length);
	}, [activeIndex, standardPaths.paths.length]);

	return (
		<div className={`${className || ""} carousel-container`}>
			{
				standardPaths.paths.map((imagePath, index) => {
					return (
						<Image src={standardPaths.prefix + "/" + imagePath + standardPaths.suffix} alt={imagePath}
							   key={index} width={1000} height={0}
							   className={`carousel-item ${computedActiveIndex === index ? "active" : ""}`}/>)
				})
			}
		</div>
	)
}