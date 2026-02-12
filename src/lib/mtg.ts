import {MTGCard, MTGCardTemplate} from "@/lib/card";

export enum ReminderTextBehavior {
	NORMAL,
	ITALIC,
	HIDDEN,
}

export const DUNGEONS: Record<string, MTGCard> = {
	"tomb of annihilation": {
		card_name: "Tomb of Annihilation",
		type_line: "Dungeon",
		card_text: `<div class="text-center no-paragraph-break" style="display:grid; grid-template-columns: 50% 50%">

<div style="grid-column: 1 / span 2; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey;">
<b>Trapped Entry</b>
<br>
Each player loses one life.
</div>

<div style="padding: 0.01in; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey;">
<b>Veils of Fear</b>
<br>
Each player loses 2 life unless they discard a card.
</div>

<div style="padding: 0.02in; grid-row: 2 / span 2; grid-column: 2; border-left: 1px solid black; border-bottom: 1px solid lightgrey; display: flex; flex-direction: column; ">
<b>Oubliette</b>
<br>
Discard a card and sacrifice a creature, an artifact, and a land.
</div>

<div style="padding: 0.02in; border-bottom: 1px solid lightgrey">
<b>Sandfall Cell</b>
<br>
Each player loses 2 life unless they sacrifice a creature, artifact, or land of their choice.
</div>

<div style="padding: 0.02in; border-bottom: 1px solid lightgrey; grid-column: 1 / span 2">
<b>Cradle of the Death God</b>
<br>
Create The Atropal, a legendary 4/4 black God Horror creature token with deathtouch.
</div>

</div>`
	},
	"lost mine of phandelver": {
		card_name: "Lost Mine of Phandelver",
		type_line: "Dungeon",
		card_text: `<div class="text-center no-paragraph-break" style="display:grid; grid-template-columns: repeat(4, 1fr)">

<div style="grid-column: 1 / span 4; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey;">
<b>Cave Entrance</b>
<br>
Scry 1.
</div>

<div style="padding: 0.01in; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey; border-right: 1px solid black; grid-column: 1 / span 2;">
<b>Goblin Lair</b>
<br>
Create a 1/1 red Goblin creature token.
</div>

<div style="padding: 0.01in; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey; grid-column: 3 / span 2;">
<b>Mine Tunnels</b>
<br>
Create a Treasure token.
</div>

<div style="padding: 0.01in; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey; border-right: 1px solid black; grid-column: 1 / span 1;">
<b>Storeroom</b>
<br>
Put a <br>+1/+1 counter on target creature.
</div>

<div style="padding: 0.01in; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey; border-right: 1px solid black; grid-column: 2 / span 2;">
<b>Dark Pool</b>
<br>
Each opponent loses 1 life and you gain 1 life.
</div>

<div style="padding: 0.01in; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey; grid-column: 4 / span 1;">
<b>Fungi Cavern</b>
<br>
Target creature gets -4/-0 until your next turn.
</div>

<div style="padding: 0.02in; border-bottom: 1px solid lightgrey; grid-column: 1 / span 4">
<b>Temple of Dumathoin</b>
<br>
Draw a card.</div>

</div>`
	},
	"dungeon of the mad mage": {
		card_name: "Dungeon of the Mad Mage",
		type_line: "Dungeon",
		card_text: `<div class="text-center no-paragraph-break" style="display:grid; grid-template-columns: repeat(2, 1fr)">

<div style="grid-column: 1 / span 2; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey;">
<b style="margin-right: 0.1in;">Yawning Portal</b>
You gain 1 life.
</div>

<div style="grid-column: 1 / span 2; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey;">
<b style="margin-right: 0.1in;">Dungeon Level</b>
Scry 1.
</div>

<div style="grid-column: 1 / span 1; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey; border-right: 1px solid black;">
<b style="margin-right: 0.1in;">Goblin Bazaar</b>
<br>
Create a Treasure token.
</div>

<div style="grid-column: 2 / span 1; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey;">
<b style="margin-right: 0.1in;">Twisted Caverns</b>
<br>
<p style="font-size: 0.075in">
Target creature can’t attack until your next turn.</p></div>

<div style="grid-column: 1 / span 2; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey;">
<b style="margin-right: 0.1in;">Lost Level</b>
Scry 2.
</div>

<div style="grid-column: 1 / span 1; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey; border-right: 1px solid black;">
<b style="margin-right: 0.1in;">Runestone Caverns</b>
<br>
Exile the top two cards of your library. You may play them.
</div>

<div style="grid-column: 2 / span 1; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey;">
<b style="margin-right: 0.1in;">Muiral’s Graveyard</b>
<br>
Create two 1/1 black Skeleton creature tokens.</div>

<div style="grid-column: 1 / span 2; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey;">
<b style="margin-right: 0.1in;">Deep Mines</b>
Scry 3.
</div>

<div style="grid-column: 1 / span 2; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey;">
<b>Mad Wizard’s Lair</b>
<br>
Draw three cards and reveal them. You may cast one of them without paying its mana cost.
</div>

</div>`
	},
	"undercity": {
		card_name: "Undercity",
		type_line: "Dungeon",
		card_text: `You can't enter this dungeon unless you "venture into Undercity."
{--}
<div class="text-center no-paragraph-break" style="display:grid; grid-template-columns: repeat(4, 1fr); font-size: 0.075in;;">

<div style="grid-column: 1 / span 4; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey;">
<b>Secret Entrance</b>
<br>
Search your library for a basic land card, reveal it, put it into your hand, then shuffle.
</div>

<div style="padding: 0.01in; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey; border-right: 1px solid black; grid-column: 1 / span 2;">
<b>Forge</b>
<br>
Put two +1/+1 counters on target creature.
</div>

<div style="padding: 0.01in; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey; grid-column: 3 / span 2;">
<b>Lost Well</b>
<br>
Scry 2.
</div>

<div style="padding: 0.01in; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey; border-right: 1px solid black; grid-column: 1 / span 1;">
<b>Trap!</b>
<br>
Target player loses 5 life.
</div>

<div style="padding: 0.01in; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey; border-right: 1px solid black; grid-column: 2 / span 2;">
<b>Arena</b>
<br>
Goad target creature.
</div>

<div style="padding: 0.01in; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey; grid-column: 4 / span 1;">
<b>Stash</b>
<br>
<p style="font-size: 0.07in;">Create a Treasure token.</p>
</div>

<div style="padding: 0.01in; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey; border-right: 1px solid black; grid-column: 1 / span 2;">
<b>Archives</b>
<br>
Draw a card.
</div>

<div style="padding: 0.01in; margin-bottom: 0.05in; border-bottom: 1px solid lightgrey; grid-column: 3 / span 2;">
<b>Catacombs</b>
<br>
Create a 4/1 black Skeleton creature token with menace.
</div>

<div style="padding: 0.02in; border-bottom: 1px solid lightgrey; grid-column: 1 / span 4">
<b>Throne of the Dead Three</b>
<br>
<p style="font-size: 0.07in;">Reveal the top ten cards of your library. Put a creature card from among them onto the battlefield with three +1/+1 counters on it. It gains hexproof until your next turn. Then shuffle.</p></div>

</div>`
	},
	"initiative": {
		card_name: "The Initiative",
		type_line: "Card",
		card_text: `Whenever one or more creatures a player controls deal combat damage to you, that player takes the initiative.
Whenever you take the initiative and at the beginning of your upkeep, venture into Undercity. <i>(If you’re in a dungeon, advance to the next room. If you’re not, enter Undercity. You can take the initiative even if you already have it.)</i>`
	}
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
	if (card.type_line?.includes("Class")) {
		card.card_template = MTGCardTemplate.CLASS;
	}
	if (card.card_text?.includes("Level up")) {
		card.card_template = MTGCardTemplate.LEVEL_UP;
	}
	if (card.type_line?.includes("Room")) {
		card.card_template = MTGCardTemplate.ROOMS;
	}
	if (card.reverse_text?.includes("Aftermath")) {
		card.card_template = MTGCardTemplate.SPLIT_AFTERMATH;
	}
	if (card.reverse_type_line?.includes("Adventure") || card.reverse_type_line?.includes("Omen")) {
		card.card_template = MTGCardTemplate.ADVENTURE;
	}

	if (card.card_name?.toLowerCase() && card.card_name.toLowerCase() in DUNGEONS) {
		return DUNGEONS[card.card_name.toLowerCase()]
	}

	return card;
}