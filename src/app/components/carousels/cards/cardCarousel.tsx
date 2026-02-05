"use server";

import {MTGCard, PTCGCard} from "@/lib/card";
import {CardCarouselClient} from "@/app/components/carousels/cards/cardCarouselClient";
import path from "node:path";
import * as fs from "node:fs";

export async function CardCarousel({jsonPath, time, className, gameId}: {
	jsonPath: string,
	time: number,
	className?: string,
	gameId: "mtg" | "ptcg"
}) {
	const filePath: string = path.join(process.cwd(), jsonPath);
	const contents: string = fs.readFileSync(filePath, "utf8");
	if (!contents) throw new Error(
		`Could not find file at path: ${filePath}`
	)

	// const data: Array<MTGCard | PTCGCard> = await fetch(jsonPath).then(res => res.json()) as Array<MTGCard | PTCGCard>;
	const data: Array<MTGCard | PTCGCard> = JSON.parse(contents);
	return <CardCarouselClient data={data} time={time} className={className} gameId={gameId}/>
}