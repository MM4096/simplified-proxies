import {Card, MTGCard, MTGCardTemplate} from "@/lib/card";

export type TemplateCards = Record<string, Card>;

export const MTGTemplateCards: TemplateCards = {
	"Aftermath Split": {
		card_name: "Aftermath Card",
		mana_cost: "{c}{w}{u}{b}{r}{g}",
		type_line: "Sorcery",
		card_text: "This is a card with an Aftermath template. The Aftermath half can be changed through the \"Dual-Faced Cards\" section.",

		reverse_card_name: "Aftermath Half",
		reverse_mana_cost: "{15}",
		reverse_type_line: "Instant",
		reverse_text: "Aftermath\nThis is the aftermath half",

		card_template: MTGCardTemplate.SPLIT_AFTERMATH,
	} as MTGCard,
	"Planeswalker": {
		card_name: "Planeswalker Card",
		mana_cost: "{c}{w}{u}{b}{r}{g}",
		type_line: "Planeswalker {-} You",
		card_text: "+1: Each loyalty ability starts with a <i>+x:</i> and is formatted.\n-X: Loyalty abilities can use non-typical values.\n-{c}: Such as this!<br/>Use HTML breaks (&lt;br&gt;) to create line breaks in an ability without starting a new ability.\nUse a full linebreak at the end to add additional rules text.<br/>Fill in <i>Power</i> to set starting loyalty.",
		power: "5",

		card_template: MTGCardTemplate.PLANESWALKER,
	} as MTGCard,
	"Spacecraft": {
		card_name: "Spacecraft Card",
		mana_cost: "{c}{w}{u}{b}{r}{g}",
		type_line: "Artifact {-} Spacecraft",
		card_text: "Station\n1+ | Each station threshold starts with \"<i>x+ | </i>\" (note the spaces around the vertical line).\nLinebreaks don't interrupt sections.\n2+ | Spacecraft can have any number of sections, but each section <i>must</i> start with a number.\n999+ | Flying, Vigilance, Haste, First Strike, Lifelink",
		power: "1", toughness: "1",

		card_template: MTGCardTemplate.SPACECRAFT,
	} as MTGCard,
	"Saga": {
		card_name: "The Saga of Darth Plagueis the Wise",
		mana_cost: "{b}{b}{b}{r}{r}{r}",
		type_line: "Legendary Enchantment Creature {-} Time Lord Saga",
		card_text: "I {-} Each chapter starts with \"<i>x {-}</i>\" ({-} can be represented with an em-dash character, or \{-\})\nII, III, V {-} Multiple chapter symbols can be added with \"<i>x, y, z, ... {-}</i>\". Each chapter\'s text can only span one line.\nIV {-} Chapters can be out of order.\nText for Saga Creatures can be added at the very end.",
		power: "9", toughness: "10",

		card_template: MTGCardTemplate.SAGA,
	} as MTGCard,
	"Level-Up": {
		card_name: "Level-Up Card",
		mana_cost: "{c}{w}{u}{b}{r}{g}",
		type_line: "Creature {-} Time Lord",
		card_text: "Level up {c}{w}{u}{b}{r}{g}\nLEVEL 1-2\n2/2\nEach level starts with LEVEL x-y, followed by its power and toughness on a new line.\nLEVEL 3-4\n3/3\nLEVEL 5+\n5/5\nThe power and toughness of the card itself (without leveling up) appears at the bottom.",

		power: "1", toughness: "1",

		card_template: MTGCardTemplate.LEVEL_UP,
	} as MTGCard,
	"Rooms": {
		card_name: "Room 1",
		mana_cost: "{c}{w}{u}",
		type_line: "Enchantment {-} Room",
		card_text: "The other room can be set-up via \"Dual-Faced Cards\"",

		reverse_card_name: "Room 2",
		reverse_mana_cost: "{b}{r}{g}",
		reverse_type_line: "Enchantment {-} Room",
		reverse_text: "This room can be set-up via \"Dual-Faced Cards\"",

		card_template: MTGCardTemplate.ROOMS
	} as MTGCard,
	"Adventure / Omen / Prepare": {
		card_name: "Main Card",
		mana_cost: "{c}{w}{u}{b}{r}{g}",
		type_line: "Artifact",
		card_text: "Set up the attached spell via \"Dual-Faced Cards\".",

		reverse_card_name: "Other Side",
		reverse_mana_cost: "{0}",
		reverse_type_line: "Instant {-} Adventure",
		reverse_text: "Target permanent.",

		card_template: MTGCardTemplate.ADVENTURE,
	} as MTGCard,
	"Class": {
		card_name: "Class Card",
		mana_cost: "{c}{w}{u}{b}{r}{g}",
		type_line: "Enchantment {-} Class",
		card_text: "Whenever you target a permanent, draw a card.\n{c}{w}{u}{b}{r}{g}: Level 2\nEach level section starts with \"<i>COST: Level x</i>\".\nLine breaks in class text are OK.\n{w}{u}{b}{r}{g}, Pay 2 life, {t}: Level 3\nLevel up costs can only end with a mana symbol.",

		card_template: MTGCardTemplate.CLASS,
	} as MTGCard,
}