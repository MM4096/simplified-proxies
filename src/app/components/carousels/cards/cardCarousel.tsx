"use client";

import {useEffect, useRef, useState} from "react";
import "../../../styles/carousel/carousel.css"
import {MTGCard, PTCGCard} from "@/lib/card";
import {MTGCardObject} from "@/app/editor/components/cards/mtgCardObject";
import {PTCGCardObject} from "@/app/editor/components/cards/ptcgCardObject";
import {snapdom} from "@zumer/snapdom";
import Image from "next/image";
import {awaitAnimationFrame} from "@/lib/timer";

/**
 * Client-side handling for a card carousel that displays cards from a JSON file.
 * @param components
 * @param components.data JSON data to render
 * @param components.activeIndex which card to display, is wrapped by this component
 * @param components.className any additional classes to add to the carousel
 * @param components.gameId what type of card objects are in the data
 * @constructor
 */
export function CardCarousel({data, activeIndex, className, gameId}: {
	data: Array<MTGCard | PTCGCard>,
	activeIndex: number,
	className?: string,
	gameId: "mtg" | "ptcg"
}) {
	const [computedActiveIndex, setComputedActiveIndex] = useState<number>(0);

	const [imageSrcs, setImageSrcs] = useState<Array<string>>([]);
	const cardObjects = useRef<Array<HTMLDivElement>>([]);

	useEffect(() => {
		setComputedActiveIndex(activeIndex % data.length);
	}, [activeIndex, data.length]);

	// generate images from card objects
	useEffect(() => {
		async function updateImageSrcs() {
			const tempImageSrcs: Array<string> = [];
			const tempImages: Array<HTMLImageElement> = [];

			// wait 2 frames to fix weird layout issues
			await awaitAnimationFrame();
			await awaitAnimationFrame();

			for (let index = 0; index < cardObjects.current.length; index++) {
				const el = cardObjects.current[index];
				if (el == null) {
					continue;
				}

				const result = await snapdom(el);
				const image = await result.toPng({
					scale: 4,
				})
				const dataURL = image.src;

				tempImageSrcs.push(dataURL);
			}

			setImageSrcs(tempImageSrcs);
		}

		updateImageSrcs().then();
	}, []);

	return (<>
			<div className={`${className || ""} carousel-container`}>
				{
					imageSrcs.map((imageSrc, index) => {
						// eslint-disable-next-line @next/next/no-img-element
						return (<img className={`carousel-item ${computedActiveIndex === index ? "active" : ""}`} src={imageSrc}
						             alt={index.toString()} key={index}/>)
					})
				}
				<Image width={300} height={500} src="/images/index/carousel/placeholder.png" alt="Loading Preview..."
				       className={`carousel-item ${imageSrcs.length == 0 ? "visible active" : "hidden"}`}/>
			</div>

			{/* TODO: Delete this container once srcs have been created */}
			{/* Or not, this doesn't consume too many resources, and at this point, I can't be bothered. */}
			<div className={`opacity-0 absolute top-0 left-0 ${data.length == imageSrcs.length ? "hidden" : ""}`}>
				{
					data.map((node, index) => {

						return (<div key={index} ref={(el) => {
							cardObjects.current[index] = el as HTMLDivElement;
						}}>
							{
								gameId === "mtg" ? (
									<MTGCardObject includeCredit={true} card={node} isBlackWhite={true}/>) : (
									<PTCGCardObject includeCredit={true} card={node} isBlackWhite={true}/>)
							}
						</div>)
					})
				}
			</div>
		</>
	)
}