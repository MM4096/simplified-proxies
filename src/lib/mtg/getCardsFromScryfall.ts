import {setTimeout} from "node:timers/promises";
import {FaceType, MTGCard, MTGCardTemplate} from "@/lib/card";
import {
	applyTemplates,
	DUNGEONS,
	FlavorTextBehavior,
	hasReverseFace,
	isolateFrontAndBackFaces,
	ReminderTextBehavior
} from "@/lib/mtg/mtgHelper";

//region Fetch cards from Scryfall
const SCRYFALL_HEADERS = {
	"Content-Type": "application/json",
	"User-Agent": "SimplifiedProxies/1.0",
};
const QUANTITY_MESSAGE = "Make sure that no headers are included, and that quantities are consistent (all cards need to have a quantity, or NO cards have a quantity)"

function handleReminderText(text: string, reminderTextBehavior: ReminderTextBehavior): string {
	// regex gets all bracketed groups
	const regex = /\([^(]+\)/g;
	if (reminderTextBehavior === ReminderTextBehavior.HIDDEN) {
		// remove all text between brackets
		return text.replace(regex, "").trim();
	}

	if (reminderTextBehavior === ReminderTextBehavior.ITALIC) {
		// wrap all text between brackets in italics
		return text.replace(regex, (match) => {
			return `<i>${match}</i>`;
		});
	}

	return text;
}

function convertScryfallResultToMtgCard(scryfallResult: Record<string, unknown>, reminderTextBehavior: ReminderTextBehavior = ReminderTextBehavior.NORMAL, flavorTextBehavior: FlavorTextBehavior = FlavorTextBehavior.NAME, importTemplates: boolean = false) {
	const thisCard: MTGCard = {};
	let faceData = [scryfallResult as Record<string, string | object>];
	if (scryfallResult.hasOwnProperty("card_faces")) {
		faceData = scryfallResult["card_faces"] as Array<Record<string, string | object>>;
	}

	let isReverseFace = false;
	for (let i = 0; i < faceData.length; i++) {
		const thisData = faceData[i];
		if (isReverseFace) {
			thisCard.reverse_card_name = thisData["name"]?.toString() || "";
			thisCard.reverse_mana_cost = thisData["mana_cost"]?.toString() || "";
			thisCard.reverse_type_line = thisData["type_line"]?.toString() || "";
			thisCard.reverse_text = handleReminderText(thisData["oracle_text"]?.toString() || "", reminderTextBehavior);
			if (thisData.hasOwnProperty("flavor_text") && flavorTextBehavior === FlavorTextBehavior.BOTH) {
				thisCard.reverse_flavor_text = thisData["flavor_text"]?.toString() || "";
			}
			thisCard.reverse_power = thisData["power"]?.toString() || "";
			thisCard.reverse_toughness = thisData["toughness"]?.toString() || "";

			if (thisData.hasOwnProperty("loyalty")) {
				thisCard.reverse_power = thisData["loyalty"].toString() || "";
			}
			if (thisData.hasOwnProperty("defense")) {
				thisCard.reverse_power = thisData["defense"].toString() || "";
			}
		} else {
			isReverseFace = true;
			thisCard.card_name = thisData["name"]?.toString() || "";

			if (thisData.hasOwnProperty("flavor_name") && flavorTextBehavior !== FlavorTextBehavior.NONE) {
				thisCard.flavor_name = thisData["flavor_name"]?.toString() || "";
			}
			if (thisData.hasOwnProperty("flavor_text") && flavorTextBehavior === FlavorTextBehavior.BOTH) {
				thisCard.flavor_text = thisData["flavor_text"]?.toString() || "";
			}

			thisCard.mana_cost = thisData["mana_cost"]?.toString() || "";
			thisCard.type_line = thisData["type_line"]?.toString() || "";
			thisCard.card_text = handleReminderText(thisData["oracle_text"]?.toString() || "", reminderTextBehavior);
			thisCard.power = thisData["power"]?.toString() || "";
			thisCard.toughness = thisData["toughness"]?.toString() || "";

			if (thisData.hasOwnProperty("loyalty")) {
				thisCard.power = thisData["loyalty"].toString() || "";
			}
			if (thisData.hasOwnProperty("defense")) {
				thisCard.power = thisData["defense"].toString() || "";
			}
		}
	}

	if (importTemplates) {
		if (scryfallResult["layout"] == "split") {
			thisCard.card_template = MTGCardTemplate.SPLIT_STANDARD;
		}
	}

	return thisCard;
}

function collapseCardName(cardName: string): string {
	return cardName.toLowerCase().replace(/[^a-zA-Z0-9_]/g, "");
}

async function fuzzyScryfall(cardName: string): Promise<unknown> {
	const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${cardName}`, {
		headers: SCRYFALL_HEADERS,
		method: "GET",
	});

	return await response.json();
}

/**
 * Gets MTG Card data, run instead of calling the API
 */
export async function doScryfallSearch(body: any): Promise<Response> {
	if (!body.hasOwnProperty("cards")) {
		return new Response("Missing cards", {
			status: 400,
		});
	}

	const importBasicLands = body["importBasicLands"] || false;
	const reminderTextBehavior: ReminderTextBehavior = body["reminderTextBehavior"] || ReminderTextBehavior.NORMAL;
	const flavorTextBehavior: FlavorTextBehavior = body["flavorTextBehavior"] || FlavorTextBehavior.NAME;
	const importTemplates = body["importTemplates"] || false;
	// const includeTokens = body["includeTokens"] || false;
	const splitDFCs = body["splitDFCs"] || false;

	let lines = body["cards"].split("\n");
	const importCards: Array<{ name: string, quantity: number }> = [];
	let hasQuantities: boolean = false;

	const tempLines: string[] = [];
	for (const line of lines) {
		if (line.trim() !== "") {
			tempLines.push(line.trim());
		}
	}
	lines = tempLines;

	for (let i = 0; i < lines.length; i++) {
		let line = lines[i];
		if (line === "") {
			continue;
		}

		const parts = line.split(" ");

		// check for a quantity item
		let quantity = 1;
		if (parts.length > 1 && (hasQuantities || i === 0)) {
			const quantity_part = parts[0].replace("x", "");
			const number = parseInt(quantity_part);
			if (isNaN(number)) {
				if (i === 0) {
					hasQuantities = false;
				} else {
					return new Response(`Invalid quantity (at line ${i + 1} (${line}))`, {
						status: 400,
					});
				}
			} else {
				hasQuantities = true;
				quantity = number;
				line = parts.slice(1).join(" ");
			}

		}

		// check for a basic land
		if (!importBasicLands) {
			const lowercase = line.toLowerCase();
			if (lowercase === "plains" || lowercase === "island" || lowercase === "swamp" || lowercase === "mountain" || lowercase === "forest") {
				// ignore
				continue;
			}
		}

		importCards.push({name: line, quantity: quantity});
	}
	//endregion

	//region Chunkify
	const chunks: Array<{ identifiers: object }> = [];
	const originalRequest: Array<{ name: string, quantity: number }>[] = [];
	const nameMap: Record<string, string> = {};
	for (let i = 0; i < importCards.length; i += 75) {
		const theseCards = importCards.slice(i, i + 75);
		chunks.push({
			identifiers: theseCards.map((card) => {
				const parsedName = collapseCardName(card.name);
				nameMap[parsedName] = card.name;
				return {
					name: parsedName,
				}
			})
		});
		originalRequest.push(theseCards);
	}
	//endregion

	const returnedCards: MTGCard[] = [];
	for (let i = 0; i < chunks.length; i++) {
		const thisChunk = chunks[i];

		const response = await fetch("https://api.scryfall.com/cards/collection", {
			headers: SCRYFALL_HEADERS,
			method: "POST",
			body: JSON.stringify(thisChunk),
		});

		if (response.ok) {
			const json = await response.json();
			const cardData = json["data"];

			if (json["not_found"] && json["not_found"].length > 0) {
				for (let i = 0; i < json["not_found"].length; i++) {
					const thisName: string = json["not_found"][i]["name"];

					// wait 100ms between requests to honor Scryfall's soft rate limit
					await setTimeout(100)

					const fuzzyResponse = (await fuzzyScryfall(thisName)) as Record<string, unknown>;
					if (fuzzyResponse["object"] === "error") {
						if (fuzzyResponse.hasOwnProperty("type") && fuzzyResponse.type === "ambiguous") {
							return new Response(JSON.stringify({
								message: `Could not find card: ${thisName} (ambiguous request)\n${QUANTITY_MESSAGE}`
							}), {status: 400,})
						}

						return new Response(JSON.stringify({
							message: `Could not find card: ${thisName} (card not found)\n${QUANTITY_MESSAGE}`
						}), {status: 400,})
					}
					cardData.push(fuzzyResponse);
				}

			}

			const thisChunkOriginalNames = originalRequest[i];
			for (let i = 0; i < cardData.length; i++) {
				const thisCard = cardData[i];

				// get original quantity
				let originalQuantity = 1;
				const thisCollapsedName = collapseCardName(thisCard["name"] as string);
				if (nameMap.hasOwnProperty(thisCollapsedName)) {
					const mappedName = nameMap[thisCollapsedName];
					for (let j = 0; j < thisChunkOriginalNames.length; j++) {
						if (thisChunkOriginalNames[j].name === mappedName) {
							originalQuantity = thisChunkOriginalNames[j].quantity;
							break;
						}
					}
				}

				let thisCardObject = convertScryfallResultToMtgCard(thisCard, reminderTextBehavior, flavorTextBehavior, importTemplates);

				if (splitDFCs && hasReverseFace(thisCardObject)) {
					let [frontFace, backFace] = isolateFrontAndBackFaces(thisCardObject);
					frontFace.quantity = originalQuantity;
					frontFace.notes = `Front Face, flips into ${thisCardObject.reverse_card_name}`;
					frontFace.face_type = FaceType.FRONT;

					backFace.quantity = originalQuantity;
					backFace.notes = `Back Face, flips into ${thisCardObject.card_name}`;
					backFace.face_type = FaceType.BACK;

					if (importTemplates) {
						frontFace = applyTemplates(frontFace);
						backFace = applyTemplates(backFace);
					}

					returnedCards.push(frontFace);
					returnedCards.push(backFace);
					continue;
				}

				if (importTemplates) {
					thisCardObject = applyTemplates(thisCardObject)

					if (thisCardObject.card_name?.toLowerCase().includes("undercity")) {
						returnedCards.push(DUNGEONS["initiative"]);
					}
				}

				thisCardObject.quantity = originalQuantity;
				returnedCards.push(thisCardObject);
			}
		} else {
			return new Response(JSON.stringify({
				message: `Could not find chunk ${i + 1}.`
			}), {
				status: 400,
			})
		}
	}

	return new Response(JSON.stringify({
		cards: returnedCards,
	}), {
		status: 200,
	});
}
//endregion