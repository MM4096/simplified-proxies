"use server";

import {MTGCard, PTCGCard} from "@/lib/card";
import {CardCarouselClient} from "@/app/components/carousels/cards/cardCarouselClient";
import path from "node:path";
import * as fs from "node:fs";

/**
 * Server-side handling for card carousel that displays cards from a JSON file.<br>
 * For the client-side, see {@link CardCarouselClient}<br>
 * <b>TO EXTEND</b>: update `gameId`, then `CardCarouselClient` to handle the new card
 * @param components
 * @param components.jsonPath path from ROOT OF PROJECT to the JSON file
 * @param components.time speed of the carousel, cards transition after this many milliseconds
 * @param components.className any additional classes to add to the carousel
 * @param components.gameId the card objects to render JSON as
 * @constructor
 */
export async function CardCarousel({jsonPath, time, className, gameId}: {
	jsonPath: string,
	time: number,
	className?: string,
	gameId: "mtg" | "ptcg"
}) {
	const filePath: string = path.join(/*turbopackIgnore: true*/ process.cwd(), jsonPath);
	const contents: string = fs.readFileSync(filePath, "utf8");
	if (!contents) throw new Error(
		`Could not find file at path: ${filePath}`
	)

	const data: Array<MTGCard | PTCGCard> = JSON.parse(contents);
	return <CardCarouselClient data={data} time={time} className={className} gameId={gameId}/>
}