import {NextRequest} from "next/server";
import {awaitCooldown} from "@/lib/redis";
import {doScryfallSearch} from "@/lib/mtg/scryfallFetch";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
	const body = await request.json();
	const searchParams = request.nextUrl.searchParams;
	if (!searchParams.has("url") || searchParams.get("url") == null) {
		return new Response(JSON.stringify({
			message: "Missing Moxfield URL.",
		}), {status: 400})
	}

	const importMaybeboard = searchParams.get("importMaybeboard") == "true";

	const moxfieldURL = searchParams.get("url")!;
	const url: URL = new URL(moxfieldURL);
	const deckId = url.pathname.split("/")[2];
	if (deckId == null) {
		return new Response(JSON.stringify({
			message: "Invalid Moxfield URL.",
		}), {status: 400})
	}

	// honor Moxfield's one api call per second rate limit
	await awaitCooldown("moxfield-api-rate-limit", 2000);

	const moxfieldResponse = await fetch(`https://api2.moxfield.com/v3/decks/all/${deckId}`, {
		cache: "no-store",
		headers: {
			"User-Agent": process.env.MOXFIELD_USER_AGENT as string,
		},
	});

	if (!moxfieldResponse.ok) {
		if (moxfieldResponse.status === 404) {
			return new Response(JSON.stringify({
				message: "Deck not found. Please make sure your deck is set to \"Public\" or \"Unlisted\", and the URL is correct.",
			}), {status: 404})
		}
		return new Response(JSON.stringify({
			message: `Error fetching deck: ${moxfieldResponse.statusText}`,
		}), {status: 500});
	}

	const decklist = await moxfieldResponse.json() as Record<string, unknown>;

	const boards = decklist["boards"] as Record<string, Record<string, unknown>>;

	let import_cards: string[] = [];
	for (const [key, value] of Object.entries(boards)) {
		if (key == "maybeboard" && !importMaybeboard) {
			continue;
		}
		if (key == "tokens") {
			continue;
		}

		for (const [_, card] of Object.entries((value as Record<string, unknown>)["cards"] as Record<string, any>)) {
			const quantity = card["quantity"];
			const name = (card["card"])["name"];
			import_cards.push(`${quantity} ${name}`);
		}
	}
	body["cards"] = import_cards.join("\n");

	return await doScryfallSearch(body);
}