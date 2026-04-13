import {doScryfallSearch} from "@/lib/mtg/getCardsFromScryfall";

export const maxDuration = 60;

/**
 * Gets MTG Card data
 */
export async function POST(request: Request) {
	//region Convert Data
	const body = await request.json();

	const cards: string = (body["cards"] as string).trim();
	if (cards.split("\n").length === 1) {
		if (cards.toLowerCase().includes("moxfield.com") || cards.toLowerCase().includes("archidekt.com")) {
			return new Response(
				JSON.stringify({
					message: "This looks like a Moxfield or Archidekt URL. Please use the Moxfield or Archidekt importers instead."
				}),
				{status: 400}
			)
		}
	}

	return await doScryfallSearch(body);
}