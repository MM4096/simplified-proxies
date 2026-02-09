"use client";

import {ReactNode, useEffect, useRef, useState} from "react";
import "../../../styles/carousel/carousel.css"
import {MTGCard, PTCGCard} from "@/lib/card";
import {MTGCardObject} from "@/app/editor/components/cards/mtgCardObject";
import {PTCGCardObject} from "@/app/editor/components/cards/ptcgCardObject";
import {html2canvas} from "html2canvas-pro";

export function CardCarouselClient({data, time, className, gameId}: {
	data: Array<MTGCard | PTCGCard>,
	time: number,
	className?: string,
	gameId: "mtg" | "ptcg"
}) {
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const [hasSetInterval, setHasSetInterval] = useState<boolean>(false);

	const [imageSrcs, setImageSrcs] = useState<Array<string>>([]);
	const cardObjects = useRef<Array<HTMLDivElement>>([]);

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

	useEffect(() => {

		async function updateImageSrcs() {
			const tempImageSrcs: Array<string> = [];

			for (let index = 0; index < cardObjects.current.length; index++) {
				const el = cardObjects.current[index];
				if (el == null) {
					continue;
				}

				const imageCanvas= await html2canvas(el, {
					foreignObjectRendering: true,
					scale: 1,
				});
				const dataURL = imageCanvas.toDataURL("image/png");

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
						return (<img className={`carousel-item ${activeIndex === index ? "active" : ""}`} src={imageSrc}
									 alt={index.toString()} key={index}/>)
					})
				}
				{/*{*/}
				{/*	data.map((node, index) => {*/}

				{/*		return (<div className={"carousel-item " + (activeIndex === index ? "active" : "")} key={index}>*/}
				{/*			{*/}
				{/*				gameId === "mtg" ? (*/}
				{/*					<MTGCardObject includeCredit={true} card={node} isBlackWhite={true}/>) : (*/}
				{/*					<PTCGCardObject card={node} isBlackWhite={true}/>)*/}
				{/*			}*/}
				{/*		</div>)*/}
				{/*		// if (gameId === "mtg") {*/}
				{/*		// 	return (<MTGCardObject card={node} isBlackWhite={true} key={index}/>)*/}
				{/*		// } else if (gameId === "ptcg") {*/}
				{/*		// 	return (<PTCGCardObject card={node} isBlackWhite={true} key={index}/>)*/}
				{/*		// }*/}
				{/*	})*/}
				{/*}*/}
			</div>

			{/* Hide this container once all srcs have been created */}
			{/*<div className={`opacity-0 absolute top-0 left-0 ${data.length == imageSrcs.length ? "hidden" : ""}`}>*/}
			<div className="absolute top-0 left-0">
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