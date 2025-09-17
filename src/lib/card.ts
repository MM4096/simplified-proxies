export interface Card {
	card_name?: string;
	card_text?: string;
	quantity?: number
}

export interface MTGCard extends Card {
	mana_cost?: string;
	type_line?: string;
	flavor_text?: string;
	power?: string;
	toughness?: string;
	reverse_card_name?: string;
	reverse_mana_cost?: string;
	reverse_type_line?: string;
	reverse_text?: string;
	reverse_power?: string;
	reverse_toughness?: string;
	notes?: string;
	card_template?: MTGCardTemplate;
}

export enum MTGCardTemplate {
	NONE = "None",
	MANA_COUNTER = "Mana Counter",
	TOKEN_COUNTER = "Token Counter",
	HALF_SIZE = "Half Size",
	PLANESWALKER = "Planeswalker",
	SPACECRAFT = "Spacecraft",
}

export interface PTCGCard extends Card {
	card_type?: string,
	additional_rules?: string,
	attacks_abilities?: AttackOrAbility[],

	pokemon_hp?: string,
	pokemon_evolution_level?: string,
	pokemon_evolves_from?: string,
	pokemon_weakness?: string,
	pokemon_resistance?: string,
	pokemon_retreat_cost?: string,
	pokemon_type?: string,
}

export interface AttackOrAbility {
	name?: string,
	text?: string,
	cost?: string,
	damage?: string,
}