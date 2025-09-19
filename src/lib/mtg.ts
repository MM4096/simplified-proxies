import {MTGCard, MTGCardTemplate} from "@/lib/card";

export enum ReminderTextBehavior {
	NORMAL,
	ITALIC,
	HIDDEN,
}

export function hasReverseFace(card: MTGCard): boolean {
	if (card.reverse_card_name || card.reverse_mana_cost || card.reverse_type_line || card.reverse_text) {
		return true;
	}
	return false;
}

export function isolateFrontAndBackFaces(card: MTGCard): [MTGCard, MTGCard] {
	const front: MTGCard = {
		card_name: card.card_name,
		mana_cost: card.mana_cost,
		type_line: card.type_line,
		card_text: card.card_text,
		flavor_text: card.flavor_text,
		notes: card.notes,
		card_template: card.card_template,
		power: card.power,
		toughness: card.toughness,
	}
	const back: MTGCard = {
		card_name: card.reverse_card_name,
		mana_cost: card.reverse_mana_cost,
		type_line: card.reverse_type_line,
		card_text: card.reverse_text,
		power: card.reverse_power,
		toughness: card.reverse_toughness,
	}

	return [front, back];
}

export function applyTemplates(card: MTGCard): MTGCard {
	if (card.type_line?.includes("Planeswalker")) {
		card.card_template = MTGCardTemplate.PLANESWALKER;
	}
	if (card.type_line?.includes("Spacecraft")) {
		card.card_template = MTGCardTemplate.SPACECRAFT;
	}
	if (card.type_line?.includes("Saga")) {
		card.card_template = MTGCardTemplate.SAGA;
	}
	if (card.card_text?.includes("Level up")) {
		card.card_template = MTGCardTemplate.LEVEL_UP;
	}
	return card;
}