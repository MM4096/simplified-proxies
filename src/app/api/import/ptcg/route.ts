import {NextRequest} from "next/server";
import {AttackOrAbility, PTCGCard} from "@/lib/card";

export const maxDuration = 60;

//region Local Types
export type PokemonAttack = {
	name: string,
	damage: string,
	cost: string,
	effect: string,
}

export type PokemonAbility = {
	name: string,
	effect: string,
}

export type PokemonData = {
	pokemonType: string,
	hp: string,
	stage: string,
	evolvesFrom?: string,
	attacks: PokemonAttack[],
	abilities: PokemonAbility[],
	weakness: string,
	resistance: string,
	retreatCost: number,
}

export type PTCGImportCard = {
	name: string,
	type: string,
	subtype?: string,
	additionalRules: string[],
	imageURL: string,
	categories: string[],

	// pokemon data
	pokemonData?: PokemonData,
	text?: string,
}
//endregion

export type PTCGImportCollapsedCard = PTCGImportCard & {
	set: string,
	id: string | number,
}


function getCard(card: PTCGImportCollapsedCard): PTCGCard {
	const thisCard: PTCGCard = {};

	switch ((card.type as string).toLowerCase()) {
		case "energy":
			thisCard.card_type = card.subtype as string;
			break;
		case "trainer":
			thisCard.card_type = card.subtype as string;
			break;
		case "pokémon":
			thisCard.card_type = `Pokemon`;
			thisCard.pokemon_hp = card.pokemonData?.hp;
			thisCard.pokemon_type = card.pokemonData?.pokemonType;
			thisCard.pokemon_evolution_level = card.pokemonData?.stage;
			if (card.pokemonData?.weakness) {
				thisCard.pokemon_weakness = card.pokemonData?.weakness + " (x2)";
			}
			if (card.pokemonData?.resistance) {
				thisCard.pokemon_resistance = card.pokemonData?.resistance + " (-30)";
			}

			thisCard.pokemon_retreat_cost = card.pokemonData?.retreatCost.toString();

			thisCard.pokemon_evolves_from = card.pokemonData?.evolvesFrom;
			break;
	}

	thisCard.card_name = card.name;

	if (card.additionalRules && card.additionalRules.length > 0) {
		thisCard.additional_rules = card.additionalRules.join("\n");
	}

	thisCard.attacks_abilities = [];
	if (card.pokemonData?.abilities) {
		for (let i = 0; i < card.pokemonData.abilities.length; i++) {
			const thisAbility = card.pokemonData.abilities[i];
			const abilityObject: AttackOrAbility = {};
			abilityObject.name = thisAbility.name;
			abilityObject.cost = "ABILITY";
			abilityObject.text = thisAbility.effect;

			thisCard.attacks_abilities.push(abilityObject);
		}
	}

	if (card.pokemonData?.attacks) {
		for (let i = 0; i < card.pokemonData.attacks.length; i++) {
			const thisAttack = card.pokemonData.attacks[i];
			const attackObject: AttackOrAbility = {};
			attackObject.name = thisAttack.name;
			let attackCost: string = "";
			thisAttack.cost.split("").forEach((char) => {
				attackCost += `{${char}}`
			})
			attackObject.cost = attackCost;
			attackObject.text = thisAttack.effect;
			attackObject.damage = thisAttack.damage;

			thisCard.attacks_abilities.push(attackObject);
		}
	}

	thisCard.card_text = card.text;

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
	const importCards = [];

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

		if (parts.length === 1 || isNaN(parseInt(parts[0].replaceAll("x", "")))) {
			// just card
			importCards.push({
				name: parts.join(" "),
				quantity: 1
			});
		} else {
			const amount = parts[0].replaceAll("x", "");
			let number = parseInt(amount);

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
				line = `${cardId[0]} ${cardId[1]}`;
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
	const collection_params: Array<Record<string, string>> = [];

	for (let i = 0; i < importCards.length; i++) {
		const thisCard = importCards[i];

		let params: Record<string, string> = {};
		if (thisCard.isId) {
			params = {
				"set": thisCard.name.split(" ")[0],
				"id": thisCard.name.split(" ")[1],
			}
		} else {
			params = {
				"name": thisCard.name,
			}
		}
		collection_params.push(params);
	}

	const fetchResponse = await fetch("https://ptcg-api-2000.vercel.app/api/collection", {
		cache: "no-store",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(collection_params),
	})
	if (!fetchResponse.ok) {
		return new Response(JSON.stringify({
			error: `Error fetching cards: ${fetchResponse.statusText}`
		}), {
			status: 500,
		});
	}
	const responseJson = await fetchResponse.json();
	if (responseJson.hasOwnProperty("not_found") && (responseJson["not_found"] as Record<string, string>[]).length > 0) {
		for (const notFoundCard of responseJson["not_found"]) {
			notFoundCards.push((notFoundCard["name"] as Record<string, string>).toString());
		}
	}

	for (const card of responseJson["cards"]) {
		const thisCard = getCard(card);
		for (let i = 0; i < importCards.length; i++) {
			if (importCards[i].name.toLowerCase() === (card["name"] as string).toLowerCase() ||
				(importCards[i].name.toLowerCase() === `${card["set"] as string} ${card["id"] as number}`.toLowerCase())) {
				thisCard.quantity = importCards[i].quantity;
				break;
			}
		}
		tempCards.push(thisCard);
	}

	return new Response(JSON.stringify({
		cards: tempCards,
		notFoundCards: notFoundCards,
	}), {
		status: 200,
	});
}