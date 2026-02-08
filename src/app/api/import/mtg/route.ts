import {doScryfallSearch} from "@/lib/mtg/scryfallFetch";

export const maxDuration = 60;

/**
 * Gets MTG Card data
 */
export async function POST(request: Request) {
	//region Convert Data
	const body = await request.json();

	return await doScryfallSearch(body);
}