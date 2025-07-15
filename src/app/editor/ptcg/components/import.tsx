"use client";

import {AttackOrAbility, PTCGCard} from "@/app/editor/ptcg/page";
import {useEffect, useRef, useState} from "react";
import {timeout} from "@/lib/timer"

export function ImportPTCG({cards, setCardsAction}: {
	cards: PTCGCard[],
	setCardsAction: (cards: PTCGCard[]) => void,
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [overwrite, setOverwrite] = useState(false);
	const [apiKey, setApiKey] = useState("");

	const [inputText, setInputText] = useState("");
	const [importMessage, setImportMessage] = useState("");
	const [importError, setImportError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setApiKey(localStorage.getItem("apiKey") || "");
	}, []);

	async function getSetIdFromCode(setCode: string): Promise<string | null> {
		let apiKeyObject = {};
		if (!apiKey) {
			apiKeyObject = {"X-Api-Key": apiKey};
		}

		const response = await fetch(`https://api.pokemontcg.io/v2/sets?q=(ptcgoCode:${setCode} OR id:${setCode})&select=id,name,ptcgoCode`, {
			headers: apiKeyObject,
			method: "GET",
		});

		if (!response.ok) {
			setImportError(`Error ${response.status}: ${response.statusText} (in: getSerIdFromCode)`);
			return null;
		}
		const responseJson = await response.json();
		if (responseJson["totalCount"] === 0) {
			setImportError(`No set found with code: ${setCode}`);
			return null;
		}
		return responseJson["data"][0]["id"].toString();
	}

	async function getCard(query: string) {
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

			const setId = await getSetIdFromCode(parts[0]);
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

	async function importCards() {
		const importCards = [];
		const lines = inputText.split("\n");

		setImportMessage("");
		setImportError("");
		setLoading(true);
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
					setImportError(`Invalid card amount "${amount}" for card "${parts[1]}"`);
					setLoading(false);
					return;
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
						setImportMessage(`Getting set code for set ${set}...`);
						const setCode = await getSetIdFromCode(set);
						// delay so no rate limit
						if (apiKey === "") {
							await timeout(2000);
						}
						setImportMessage("");

						if (setCode) {
							setCodes[set] = setCode;
							set = setCode;
						} else {
							setImportError(`Invalid set code "${set}"`);
							setLoading(false);
							return;
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

			setImportMessage(`Getting card ${i + 1} of ${importCards.length}...`);
			const thisName = thisCard.isId ? "id:" + thisCard.name : thisCard.name;
			let card: PTCGCard | null;
			try {
				card = await getCard(thisName);
			}
			catch (e) {
				setImportError(`Error getting card ${thisName}: ${e}`);
				setLoading(false);
				return;
			}
			if (!card) {
				setImportError(`Card "${thisName}" not found (ignoring)`);
				notFoundCards.push(thisName);
				continue;
			}
			card.quantity = thisCard.quantity;
			tempCards.push(card);

			if (apiKey === "") {
				await timeout(2000);
			}
		}

		if (overwrite) {
			setCardsAction(tempCards);
		}
		else {
			setCardsAction([...cards, ...tempCards]);
		}

		setLoading(false);

		if (notFoundCards.length > 0) {
			setImportError(`The following cards were not found: ${notFoundCards.join(", ")}. All other cards were imported.`);
		}
		else {
			setImportError("");
			dialogRef?.current?.close();
		}
	}

	return (<>
		<button className="btn btn-primary" onClick={() => {
			dialogRef?.current?.showModal();
		}}>Import Cards
		</button>

		<dialog className="modal max-w-full" ref={dialogRef}>
			<div className="modal-box min-w-1/3 max-w-9/10 overflow-x-auto">
				<h2>Import Cards</h2>
				<br/>
				<p>Paste a list of cards below. Card names must be exact (except symbols and capitalization) and must
					match one of the following formats (OR pasted from Limitless).</p>
				<p className="text-xs">If only names are supplied, the latest card with the specified name is imported.</p>
				<div className="flex flex-row w-full">
					<div className="border p-2 w-max">
						<p>4 TWM 128</p>
						<p>3 TWM 129</p>
						<p>4 PAL 185</p>
						<p>3 SFA 61</p>
					</div>
					<div className="border p-2 w-max">
						<p>4 Dreepy</p>
						<p>4 Drakloak</p>
						<p>4 Iono</p>
						<p>3 Night Stretcher</p>
					</div>
					<div className="border p-2 w-max">
						<p>4 Dreepy TWM 128</p>
						<p>4 Drakloak TWM 129</p>
						<p>4 Iono PAL 185</p>
						<p>3 Night Stretcher SFA 61</p>
					</div>
				</div>
				<br/>
				<fieldset className="fieldset">
					<label htmlFor="import-cards-textarea"></label>
					<textarea className="input grow text-wrap min-h-20 w-full"
							  placeholder="Cards go here..." value={inputText}
							  onChange={(e) => setInputText(e.target.value)}/>
					{importMessage && (<p className="label">{importMessage}</p>)}
					{importError && (<p className="label text-error">{importError}</p>)}
				</fieldset>

				<fieldset className="fieldset">
					<legend className="fieldset-legend">API Key <small>(Optional)</small></legend>

					<input type="text" value={apiKey} onChange={(e) => {
						setApiKey(e.target.value);
						localStorage.setItem("apiKey", e.target.value);
					}} placeholder="<KEY>" className="input grow"/>

					<div className="label inline">PokemonTCG.io has a rate limit of one card every 2 seconds.
						<br/>By entering an API key here, you can increase import speed drastically.<br/>
						Get your API key <a href="https://dev.pokemontcg.io/" className="link" target="_blank">here</a>.
						<br/>(Your API key is only stored on your local device)
					</div>
				</fieldset>

				<br/><br/>
				<label className="label">
					<input className="checkbox" type="checkbox" checked={overwrite}
						   onChange={(e) => setOverwrite(e.target.checked)}/>
					Overwrite Existing Cards
				</label>

				<br/><br/>
				<div className="flex flex-row items-center justify-center gap-4 w-full">
					<button className="btn btn-secondary grow" onClick={() => {
						dialogRef?.current?.close();
					}} disabled={loading}>Cancel
					</button>
					<button className="btn btn-primary grow" onClick={() => {
						importCards().then();
					}} disabled={loading}>Import
					</button>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button disabled={loading}>Cancel</button>
			</form>
		</dialog>
	</>)
}