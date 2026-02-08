import {NextRequest} from "next/server";
import {doScryfallSearch} from "@/lib/mtg/getCardsFromScryfall";

export async function POST(request: NextRequest) {
	const body = await request.json();
	const searchParams = request.nextUrl.searchParams;
	if (!searchParams.has("url") || searchParams.get("url") == null) {
		return new Response(JSON.stringify({
			message: "Missing Archidekt URL.",
		}), {status: 400})
	}

	const archidektUrl = searchParams.get("url")!;
	const url: URL = new URL(archidektUrl);
	const deckId = url.pathname.split("/")[2];
	if (deckId == null || isNaN(parseInt(deckId))) {
		return new Response(JSON.stringify({
			message: "Invalid Archidekt URL.",
		}), {status: 400})
	}

	const archidecktResponse = await fetch(`https://archidekt.com/api/decks/${deckId}/`);
	if (!archidecktResponse.ok) {
		if (archidecktResponse.status === 404) {
			return new Response(JSON.stringify({
				message: "Deck not found. Please make sure your deck is set to \"Public\" or \"Unlisted\", and the URL is correct.",
			}), {status: 404})
		}
		return new Response(JSON.stringify({
			message: `Error fetching deck: ${archidecktResponse.statusText}`,
		}), {status: 500});
	}

	const deck = await archidecktResponse.json();
	const cards = deck["cards"];

	let import_cards: string[] = [];
	for (const card of cards) {
		const quantity = card["quantity"];
		const name = card["card"]["oracleCard"]["name"];
		import_cards.push(`${quantity} ${name}`);
	}
	const card_list = import_cards.join("\n");
	console.log(card_list);
	body["cards"] = card_list;

	return await doScryfallSearch(body);
}