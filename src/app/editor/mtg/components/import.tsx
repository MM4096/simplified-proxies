"use client";

import {useRef, useState} from "react";
import {MTGCard} from "@/lib/card";
import {ReminderTextBehavior} from "@/lib/mtg";

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

	const [importBasicLands, setImportBasicLands] = useState<boolean>(true);
	const [importReminderTextBehavior, setImportReminderTextBehavior] = useState<ReminderTextBehavior>(ReminderTextBehavior.NORMAL);

	async function importCards() {
		setDisableButtons(true);
		setImportMessage("Fetching Cards...");
		setImportError("");

		fetch("/api/import/mtg", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				cards: importText,
				importBasicLands: importBasicLands,
				reminderTextBehavior: importReminderTextBehavior,
			}),
		}).then(async (response) => {
			if (response.ok) {
				const json = await response.json();
				const retCards: MTGCard[] = json["cards"];

				if (overwrite) {
					setCardsAction(retCards);
				}
				else {
					const newCards: MTGCard[] = [];
					newCards.push(...cards);
					newCards.push(...retCards);
					setCardsAction(newCards);
				}

				dialogRef.current?.close();
			} else {
				const json = await response.json();
				setImportError(json["message"]);
			}

		}).catch((e) => {
			console.log(e);
			setImportError(e.toString())
		}).finally(() => {
			setDisableButtons(false);
			setImportMessage("");
		})

	}

	return (<>
		<button className="btn btn-primary" onClick={() => {
			dialogRef?.current?.showModal();
		}}>Import Cards
		</button>
		<dialog className="modal w-full" ref={dialogRef}>
			<div className="modal-box min-w-[50vw] max-w-[75vw]">
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
						<p>commit // memory</p>
					</div>
					<div className="border p-2 w-max">
						<p>2 Plains</p>
						<p>2 Deflecting Swat</p>
						<p>4 sakura tribe elder</p>
						<p>10 chandra flames fury</p>
						<p>1 Commit</p>
					</div>
					<div className="border p-2 w-max">
						<p>2x Plains</p>
						<p>2x Deflecting Swat</p>
						<p>4x sakura tribe elder</p>
						<p>10x chandra flames fury</p>
						<p>1x Memory</p>
					</div>
				</div>
				<p className="text-xs">DFCs should either be entered with a double slash (//) or the name of one face (Commit//Memory as either Commit or Memory)<br/>
				All cards must either have no quantity given, or all cards must have quantities.<br/>
				Headers (such as &quot;Main Deck&quot; or &quot;Sideboard&quot;) MUST be removed.</p>

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
						importError !== "" && (<label className="label text-error whitespace-pre">{importError}</label>)
					}
				</fieldset>
				<br/>

				<div className="collapse collapse-arrow bg-base-100 border-gray-500 border">
					<input type="checkbox" />
					<div className="collapse-title font-semibold">Additional Settings</div>
					<div className="collapse-content flex flex-row">
						<label className="label text-sm">
							<input type="checkbox" className="checkbox checkbox-sm" checked={importBasicLands} onChange={(e) => {
								setImportBasicLands(e.target.checked);
							}}/>
							Import basic lands
						</label>

						<div className="divider divider-horizontal"/>

						<label className="label text-sm">
							Reminder Text Behavior:
							<select className="select select-sm" value={importReminderTextBehavior} onChange={(e) => {
								setImportReminderTextBehavior(parseInt(e.target.value) as ReminderTextBehavior);
							}}>
								<option value={ReminderTextBehavior.NORMAL}>Render as normal text</option>
								<option value={ReminderTextBehavior.ITALIC}>Italicize reminder text</option>
								<option value={ReminderTextBehavior.HIDDEN}>Don&apos;t show</option>
							</select>
						</label>

					</div>
				</div>
				<br/>

				<label className="label">
					<input type="checkbox" className="checkbox checkbox-error" checked={overwrite} onChange={(e) => {
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