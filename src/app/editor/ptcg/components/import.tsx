"use client";

import {useEffect, useRef, useState} from "react";
import {timeout} from "@/lib/timer"
import {AttackOrAbility, PTCGCard} from "@/lib/card";

export function ImportPTCG({cards, setCardsAction}: {
	cards: PTCGCard[],
	setCardsAction: (cards: PTCGCard[]) => void,
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [overwrite, setOverwrite] = useState(false);

	const [inputText, setInputText] = useState("");
	const [importMessage, setImportMessage] = useState("");
	const [importError, setImportError] = useState("");
	const [loading, setLoading] = useState(false);

	async function importCards() {
		setImportMessage("");
		setImportError("");
		setLoading(true);

		const result = await fetch("/api/import/ptcg", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({cards: inputText}),
		})
		if (!result.ok) {
			if (result.status === 400) {
				const json = await result.json();
				setImportError(`Failed to import cards: ${json.error}`)
			} else {
				setImportError(`Failed to import cards: ${result.statusText}`);
			}
			setLoading(false);
			return;
		}
		const json = await result.json();
		const tempCards: PTCGCard[] = json["cards"];
		const notFoundCards: string[] = json["notFoundCards"];

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