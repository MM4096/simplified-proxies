"use client";

import {useEffect, useState} from "react";
import "../../../styles/carousel/carousel.css"
import {MTGCard, PTCGCard} from "@/lib/card";
import {MTGCardObject} from "@/app/editor/components/cards/mtgCardObject";
import {PTCGCardObject} from "@/app/editor/components/cards/ptcgCardObject";

export function CardCarouselClient({data, time, className, gameId}: {
	data: Array<MTGCard | PTCGCard>,
	time: number,
	className?: string,
	gameId: "mtg" | "ptcg"
}) {
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const [hasSetInterval, setHasSetInterval] = useState<boolean>(false);

	useEffect(() => {
		if (!hasSetInterval) {
			setInterval(() => {
				setActiveIndex((prevState) => {
					return (prevState + 1) % data.length;
				})
			}, time);
			setHasSetInterval(true);
		}
	}, [activeIndex, hasSetInterval, data.length, time]);

	return (
		<div className={`${className || ""} carousel-container`}>
			{
				data.map((node, index) => {

					return (<div className={"carousel-item " + (activeIndex === index ? "active" : "")} key={index}>
						{
							gameId === "mtg" ? (<MTGCardObject includeCredit={true} card={node} isBlackWhite={true}/>) : (<PTCGCardObject card={node} isBlackWhite={true}/>)
						}
					</div>)
					// if (gameId === "mtg") {
					// 	return (<MTGCardObject card={node} isBlackWhite={true} key={index}/>)
					// } else if (gameId === "ptcg") {
					// 	return (<PTCGCardObject card={node} isBlackWhite={true} key={index}/>)
					// }
				})
			}
		</div>
	)
}