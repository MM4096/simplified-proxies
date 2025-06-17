"use client";

import {MTGCard} from "@/app/editor/mtg/page";
import {useRef, useState} from "react";

function convertScryfallResultToMtgCard(scryfallResult: Record<string, unknown>) {
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
			thisCard.reverse_text = thisData["oracle_text"]?.toString() || "";
			thisCard.reverse_power = thisData["power"]?.toString() || "";
			thisCard.reverse_toughness = thisData["toughness"]?.toString() || "";

			if (thisData.hasOwnProperty("loyalty")) {
				thisCard.power = thisData["loyalty"].toString() || "";
			}
		}
		else {
			isReverseFace = true;
			thisCard.card_name = thisData["name"]?.toString() || "";
			thisCard.mana_cost = thisData["mana_cost"]?.toString() || "";
			thisCard.type_line = thisData["type_line"]?.toString() || "";
			thisCard.card_text = thisData["oracle_text"]?.toString() || "";
			thisCard.power = thisData["power"]?.toString() || "";
			thisCard.toughness = thisData["toughness"]?.toString() || "";

			if (thisData.hasOwnProperty("loyalty")) {
				thisCard.power = thisData["loyalty"].toString() || "";
			}
		}
	}

	return thisCard;
}

export function ImportMTG({cards, setCardsAction}: {
	cards: MTGCard[],
	setCardsAction: (cards: MTGCard[]) => void,
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [importMessage, setImportMessage] = useState<string>("");
	const [importText, setImportText] = useState<string>("");
	const [importError, setImportError] = useState<string>("");
	const [overwrite, setOverwrite] = useState<boolean>(false);

	const [disableButtons, setDisableButtons] = useState<boolean>(false);

	async function importCards() {
		setDisableButtons(true);
		setImportMessage("");
		setImportError("");

		const lines = importText.split("\n");
		const importCards: Array<{ name: string, quantity: number }> = [];
		let hasQuantities: boolean = false;

		for (let i = 0; i < lines.length; i++) {
			let line = lines[i].trim();
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
						setImportError(`Invalid quantity (at: ${line})`);
						setDisableButtons(false);
					}
				} else {
					hasQuantities = true;
					quantity = number;
					line = parts.slice(1).join(" ");
				}

			}
			importCards.push({name: line, quantity: quantity});
		}

		const chunks = [];
		const originalNames: Array<{name: string, quantity: number}>[] = [];
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

			setImportMessage(`Getting chunk ${i+1} of ${chunks.length} chunks`);

			const response = await fetch("https://api.scryfall.com/cards/collection", {
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
				body: JSON.stringify(thisChunk),
			});

			if (response.ok) {
				const json = await response.json();

				if (json["not-found"] && json["not-found"].length > 0) {
					setImportError(`Chunk ${i+1} failed: Couldn't find cards: ${json["not-found"].join(", ")}`);
					return;
				}

				const thisChunkOriginalNames = originalNames[i];
				for (let i = 0; i < json.data.length; i++) {
					const thisCard = json.data[i];
					console.log(thisCard)
					const thisCardObject = convertScryfallResultToMtgCard(thisCard);
					thisCardObject.quantity = thisChunkOriginalNames[i].quantity;
					returnedCards.push(thisCardObject);
				}
			}
			else {
				setImportError(`Could not find chunk ${i+1}.`);
				return;
			}
		}

		if (overwrite) {
			setCardsAction(returnedCards);
		}
		else {
			const copy = cards.slice();
			returnedCards.map((card) => {
				copy.push(card);
			})
			setCardsAction(copy);
		}

		setDisableButtons(false);
		dialogRef.current?.close();

	}

	return (<>
		<button className="btn btn-primary" onClick={() => {
			dialogRef?.current?.showModal();
		}}>Import Cards
		</button>
		<dialog className="modal w-full" ref={dialogRef}>
			<div className="modal-box min-w-[50vw]">
				<h3 className="font-bold text-xl">Import Cards</h3>

				<div className="custom-divider"/>

				<p>Paste a list of cards below. Card names must be exact (except symbols and capitalization) and must
					match one of the following formats:</p>
				<div className="flex flex-row w-full">
					<div className="border p-2 w-max">
						<p>Plains</p>
						<p>Deflecting Swat</p>
						<p>Deflecting Swat</p>
						<p>sakura tribe elder</p>
						<p>chandra flames fury</p>
					</div>
					<div className="border p-2 w-max">
						<p>2 Plains</p>
						<p>2 Deflecting Swat</p>
						<p>4 sakura tribe elder</p>
						<p>10 chandra flames fury</p>
					</div>
					<div className="border p-2 w-max">
						<p>2x Plains</p>
						<p>2x Deflecting Swat</p>
						<p>4x sakura tribe elder</p>
						<p>10x chandra flames fury</p>
					</div>
				</div>
				<fieldset className="fieldset">
					<legend className="fieldset-legend"></legend>
					<textarea className="textarea w-full" placeholder="Paste your card data here" value={importText}
							  onChange={(e) => {
								  setImportText(e.target.value);
							  }}/>
					{
						importMessage !== "" && (<label className="label">{importMessage}</label>)
					}
					{
						importError !== "" && (<label className="label text-error">{importError}</label>)
					}
				</fieldset>
				<br/>

				<label className="label">
					<input type="checkbox" className="checkbox" checked={overwrite} onChange={(e) => {
						setOverwrite(e.target.checked);
					}}/>
					Overwrite existing cards
				</label>

				<br/><br/>

				<div className="flex flex-row gap-2 w-full">
					<button className="btn btn-secondary grow" onClick={() => {
						dialogRef?.current?.close();
					}} disabled={disableButtons}>Cancel
					</button>
					<button className="btn btn-primary grow" onClick={() => {
						importCards().then();
					}} disabled={disableButtons}>Import
					</button>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button disabled={disableButtons}>close</button>
			</form>
		</dialog>
	</>)
}