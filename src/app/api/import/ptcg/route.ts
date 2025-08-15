import {NextRequest} from "next/server";
import {AttackOrAbility, PTCGCard} from "@/lib/card";
import {timeout} from "@/lib/timer";

export const maxDuration = 60;

async function getSetIdFromCode(setCode: string, apiKey: string | null): Promise<string | null> {
	let apiKeyObject = {};
	if (!apiKey) {
		apiKeyObject = {"X-Api-Key": apiKey};
	}

	const response = await fetch(`https://api.pokemontcg.io/v2/sets?q=(ptcgoCode:${setCode} OR id:${setCode})&select=id,name,ptcgoCode`, {
		headers: apiKeyObject,
		method: "GET",
	});

	if (!response.ok) {
		throw new Error(`Error ${response.status}: ${response.statusText} (in: getSerIdFromCode)`);
	}
	const responseJson = await response.json();
	if (responseJson["totalCount"] === 0) {
		throw new Error(`No set found with code: ${setCode}`);
	}
	return responseJson["data"][0]["id"].toString();
}

async function getCard(query: string, apiKey: string | null) {
	let response;
	let apiKeyObject = {};
	if (apiKey) {
		apiKeyObject = {
			"X-Api-Key": apiKey,
		};
	}

	const isId = query.startsWith("id:");
	if (isId) {
		query = query.replace("id:", "");
		query = query.replaceAll(" ", "-");
		query = query.trim();
		const parts = query.split("-");

		const setId = await getSetIdFromCode(parts[0], apiKey);
		if (!setId) {
			return null;
		}

		response = await fetch(`https://api.pokemontcg.io/v2/cards/${setId}-${parts[1]}`, {
			headers: apiKeyObject,
			method: "GET",
		});
	} else {
		response = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:"${query}"`, {
			headers: apiKeyObject,
			method: "GET",
		});
	}

	if (!response.ok) {
		return null;
	}

	let json = await response.json();

	if (Array.isArray(json.data)) {
		if (json.data.length === 0) {
			return null;
		}
		json = json.data[json.data.length - 1];
	} else {
		json = json.data;
	}

	const thisCard: PTCGCard = {};

	switch (json["supertype"].toLowerCase()) {
		case "energy":
			thisCard.card_type = `${json["subtypes"][0]} Energy`;
			break;
		case "trainer":
			thisCard.card_type = json["subtypes"][0];
			break;
		case "pokémon":
			thisCard.card_type = `Pokemon`;
			thisCard.pokemon_hp = json["hp"];
			thisCard.pokemon_type = json["types"].join(" ");
			thisCard.pokemon_evolution_level = json["subtypes"].join(" ");
			if (json["weaknesses"]) {
				thisCard.pokemon_weakness = json["weaknesses"].map((item: { type: string, value: string }) => {
					return `${item.type} ${item.value}`;
				}).join(" ");
			}
			if (json["resistances"]) {
				thisCard.pokemon_resistance = json["resistances"].map((item: { type: string, value: string }) => {
					return `${item.type} ${item.value}`;
				}).join(" ");
			}
			if (json["retreatCost"]) {
				thisCard.pokemon_retreat_cost = json["retreatCost"].length;
			}

			if (json["evolvesFrom"]) {
				thisCard.pokemon_evolves_from = json["evolvesFrom"];
			}
			break;
	}

	thisCard.card_name = json["name"];
	if (json["rules"] && json["rules"].length > 0) {
		if (json["supertype"].toLowerCase() === "pokémon") {
			while (json["rules"][0].indexOf(":") === -1) {
				json["rules"].shift();
			}
			thisCard.additional_rules = json["rules"].join("\n");
		} else {
			if (json["subtypes"] && json["subtypes"].findIndex((item: string) => item.toLowerCase() === "ace spec") > -1) {
				json["rules"].shift();
			}

			thisCard.card_text = json["rules"][0];

			json["rules"].shift();

			thisCard.additional_rules = json["rules"].join("\n");
		}
	}

	thisCard.attacks_abilities = [];
	if (json["abilities"]) {
		for (let i = 0; i < json["abilities"].length; i++) {
			const thisAbility = json["abilities"][i];
			const abilityObject: AttackOrAbility = {};
			abilityObject.name = thisAbility.name;
			abilityObject.cost = thisAbility.type;
			abilityObject.text = thisAbility.text;

			thisCard.attacks_abilities.push(abilityObject);
		}
	}

	if (json["attacks"]) {
		for (let i = 0; i < json["attacks"].length; i++) {
			const thisAttack = json["attacks"][i];
			const attackObject: AttackOrAbility = {};
			attackObject.name = thisAttack.name;
			attackObject.cost = thisAttack.cost.join("");
			attackObject.text = thisAttack.text;
			attackObject.damage = thisAttack.damage;

			thisCard.attacks_abilities.push(attackObject);
		}
	}

	return thisCard;
}

export async function POST(request: NextRequest) {
	const body = await request.json();
	const searchParams = request.nextUrl.searchParams;

	if (!body.hasOwnProperty("cards")) {
		return new Response("Missing cards", {
			status: 400,
		});
	}

	const lines = body["cards"].split("\n");
	const apiKey = searchParams.get("apiKey") || "";
	const importCards = [];

	const setCodes: Record<string, string> = {};
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i];
		if (line.trim() === "") {
			continue;
		}
		line = line.trim();

		const parts = line.split(" ");

		// This is a Limitless header
		if (parts.length === 2 && parts[0].endsWith(":")) {
			continue;
		}

		if (parts.length === 1) {
			// just card
			importCards.push({
				name: parts[0],
				quantity: 1
			});
		} else {
			const amount = parts[0].replaceAll("x", "");
			const number = parseInt(amount);

			if (isNaN(number)) {
				return new Response(JSON.stringify({
					error: `Invalid card amount "${amount}" for card "${parts[1]}"`
				}), {
					status: 400,
				});
			}

			parts.shift();

			let isId = false;
			const cardId = ["", ""];
			if (parts.length >= 2) {
				// probably an id
				const setNumber = parts[parts.length - 2];
				const id = parts[parts.length - 1];
				if (setNumber.length === 3) {
					try {
						parseInt(id);

						cardId[0] = setNumber;
						cardId[1] = id;

						isId = true;
					} catch {
						// not an id
						console.log("Ignoring error")
					}
				}
			}

			let line = parts.join(" ");
			if (isId) {
				let set = cardId[0];
				if (setCodes[set]) {
					set = setCodes[set];
				} else {
					const setCode = await getSetIdFromCode(set, apiKey);
					// delay so no rate limit
					if (apiKey === "") {
						await timeout(2000);
					}

					if (setCode) {
						setCodes[set] = setCode;
						set = setCode;
					} else {
						return new Response(JSON.stringify({
							error: `Invalid set code "${set}"`
						}), {
							status: 400,
						});
					}

				}
				line = `${set} ${cardId[1]}`;
			}

			importCards.push({
				name: line,
				quantity: number,
				isId: isId,
			});
		}
	}

	const tempCards: PTCGCard[] = [];
	const notFoundCards: string[] = [];

	for (let i = 0; i < importCards.length; i++) {
		const thisCard = importCards[i];

		const thisName = thisCard.isId ? "id:" + thisCard.name : thisCard.name;
		let card: PTCGCard | null;
		try {
			card = await getCard(thisName, apiKey);
		}
		catch (e) {
			return new Response(JSON.stringify({
				error: `Error getting card ${thisName}: ${e}`
			}), {
				status: 400,
			});
		}
		if (!card) {
			notFoundCards.push(thisName);
			continue;
		}
		card.quantity = thisCard.quantity;
		tempCards.push(card);

		if (apiKey === "") {
			await timeout(2000);
		}
	}

	return new Response(JSON.stringify({
		cards: tempCards,
		notFoundCards: notFoundCards,
	}), {
		status: 200,
	});
}