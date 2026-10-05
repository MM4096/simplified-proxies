"use client";

import {ReactNode, useEffect, useState} from "react";
import {
	secretCarouselLinksLeft,
	secretCarouselLinksRight,
	secretCarouselMessage,
	secretCarouselPercentage
} from "@/lib/index/sCarouselLinks";
import {ImageCarousel} from "@/app/components/carousels/images/imageCarousel";
import {carouselLinksLeft, carouselLinksRight} from "@/lib/index/carouselLinks";
import {CardCarousel} from "@/app/components/carousels/cards/cardCarousel";
import {sCarouselDataLeft, sCarouselDataRight} from "@/lib/index/sCarouselData";
import {carouselDataLeft, carouselDataRight} from "@/lib/index/carouselData";
import {MTGCard} from "@/lib/card";

/**
 * Wraps the index carousels, and syncs indexes and timers between all carousels
 * @param components
 * @param components.carouselTime time to switch between each carousel, in milliseconds
 * @param components.children components to put in the middle
 * @constructor
 */
export function IndexCarouselContainer({carouselTime, children}: {
	carouselTime: number,
	children: ReactNode,
}) {
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const [isSecret, setIsSecret] = useState<boolean | null>(null);

	useEffect(() => {
		setIsSecret(Math.random() * 100 <= secretCarouselPercentage);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveIndex((prevState) => {
				// technically doesn't create a proper wrap, but if someone's staying
				// on the home screen for around 8 minutes, that's their problem
				return (prevState + 1) % 100;
			});
		}, carouselTime);

		return () => clearInterval(interval);
	}, [carouselTime]);

	return (<>
		<div className="index">

			<div className="flex flex-col items-center justify-center gap-4 mtg-panel carousel">
				<ImageCarousel activeIndex={activeIndex}
				               standardPaths={{
								   prefix: "/images/index/carousel/mtg/actual",
								   paths: isSecret ? secretCarouselLinksLeft : carouselLinksLeft,
								   suffix: ".jpg",
							   }} className="w-1/3"/>
				<CardCarousel data={(isSecret ? sCarouselDataLeft : carouselDataLeft) as Array<MTGCard>}
				              activeIndex={activeIndex} gameId="mtg" className="w-1/3"/>
				{
					isSecret && secretCarouselMessage && (<span className="text-xs text-gray-400 italic">{secretCarouselMessage}</span>)
				}
			</div>

			{children}

			<div className="flex flex-col items-center justify-center gap-4 mtg-panel carousel">
				<ImageCarousel activeIndex={activeIndex}
				               standardPaths={{
								   prefix: "/images/index/carousel/mtg/actual",
								   paths: isSecret ? secretCarouselLinksRight : carouselLinksRight,
								   suffix: ".jpg",
							   }} className="w-1/3"/>
				<CardCarousel data={(isSecret ? sCarouselDataRight : carouselDataRight) as Array<MTGCard>}
				              activeIndex={activeIndex} gameId="mtg" className="w-1/3"/>
				{
					isSecret && secretCarouselMessage && (<span className="text-xs text-gray-400 italic">{secretCarouselMessage}</span>)
				}
			</div>

		</div>
	</>)
}