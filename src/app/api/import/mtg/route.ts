import {MTGCard} from "@/lib/card";
import {ReminderTextBehavior} from "@/lib/mtg";

export const maxDuration = 60;

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

function convertScryfallResultToMtgCard(scryfallResult: Record<string, unknown>, reminderTextBehavior: ReminderTextBehavior = ReminderTextBehavior.NORMAL) {
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
			thisCard.reverse_power = thisData["power"]?.toString() || "";
			thisCard.reverse_toughness = thisData["toughness"]?.toString() || "";

			if (thisData.hasOwnProperty("loyalty")) {
				thisCard.power = thisData["loyalty"].toString() || "";
			}
			if (thisData.hasOwnProperty("defense")) {
				thisCard.power = thisData["defense"].toString() || "";
			}
		} else {
			isReverseFace = true;
			thisCard.card_name = thisData["name"]?.toString() || "";
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

	return thisCard;
}

/**
 * Gets MTG Card data
 */
export async function POST(request: Request) {
	const body = await request.json();

	if (!body.hasOwnProperty("cards")) {
		return new Response("Missing cards", {
			status: 400,
		});
	}

	const importBasicLands = body["importBasicLands"] || false;
	const reminderTextBehavior: ReminderTextBehavior = body["reminderTextBehavior"] || ReminderTextBehavior.NORMAL;

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

		// dfc
		const dfcParts = line.split("//");
		if (dfcParts.length > 1) {
			line = dfcParts[0];
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

	const chunks: Array<{ identifiers: object }> = [];
	const originalNames: Array<{ name: string, quantity: number }>[] = [];
	for (let i = 0; i < importCards.length; i += 75) {
		const theseCards = importCards.slice(i, i + 75);
		chunks.push({
			identifiers: theseCards.map((card) => {
				return {
					name: card.name,
				}
			})
		});
		originalNames.push(theseCards);
	}


	const returnedCards: MTGCard[] = [];
	for (let i = 0; i < chunks.length; i++) {
		const thisChunk = chunks[i];

		const response = await fetch("https://api.scryfall.com/cards/collection", {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(thisChunk),
		});

		if (response.ok) {
			const json = await response.json();

			if (json["not_found"] && json["not_found"].length > 0) {

				return new Response(JSON.stringify({
					message: `Chunk ${i + 1} failed: Couldn't find cards: ${json["not_found"].slice(0, 5).map((i: {
						name: string
					}) => i.name).join(", ")}\nMake sure that no headers are included, and that quantities are consistent (all cards need to have a quantity, or NO cards have a quantity)`
				}), {
					status: 400,
				});

			}

			const thisChunkOriginalNames = originalNames[i];
			for (let i = 0; i < json.data.length; i++) {
				const thisCard = json.data[i];
				const thisCardObject = convertScryfallResultToMtgCard(thisCard, reminderTextBehavior);
				thisCardObject.quantity = thisChunkOriginalNames[i].quantity;
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