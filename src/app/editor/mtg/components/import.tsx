"use client";

import {useRef, useState} from "react";
import {MTGCard} from "@/lib/card";
import {ReminderTextBehavior} from "@/lib/mtg";
import {BiInfoCircle} from "react-icons/bi";
import {useUmamiEvent} from "@/app/components/analytics";
import {NewBadge} from "@/app/components/tags/new";

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
	const [importReminderTextBehavior, setImportReminderTextBehavior] = useState<ReminderTextBehavior>(ReminderTextBehavior.ITALIC);
	const [importTemplates, setImportTemplates] = useState<boolean>(true);
	const [importIncludeTokens, setImportIncludeTokens] = useState<boolean>(false);
	const [importSplitDFCs, setImportSplitDFCs] = useState<boolean>(false);

	const [importType, setImportType] = useState<"moxfield" | "archidekt" | "list">("list");
	const [moxfieldImportMaybeboard, setMoxfieldImportMaybeboard] = useState<boolean>(false);

	const umamiTracker = useUmamiEvent();

	async function importCards() {
		setDisableButtons(true);
		setImportMessage("Fetching Cards...");
		setImportError("");

		let fetchUrl: string;
		switch (importType) {
			case "archidekt":
				fetchUrl = `/api/import/mtg/archidekt?url=${encodeURIComponent(importText)}`;
				break;
			case "list":
				fetchUrl = `/api/import/mtg`;
				break;
			case "moxfield":
				fetchUrl = `/api/import/mtg/moxfield?url=${encodeURIComponent(importText)}&importMaybeboard=${moxfieldImportMaybeboard}`;
				break;
		}

		fetch(fetchUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				cards: importText,
				importBasicLands: importBasicLands,
				reminderTextBehavior: importReminderTextBehavior,
				importTemplates: importTemplates,
				includeTokens: importIncludeTokens,
				splitDFCs: importSplitDFCs,
			}),
		}).then(async (response) => {
			if (response.ok) {
				const json = await response.json();
				const retCards: MTGCard[] = json["cards"];

				if (overwrite) {
					setCardsAction(retCards);
				} else {
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

			umamiTracker("mtg-CardsImported", {importType: importType, success: response.ok});

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
			<div className="modal-box min-w-[50vw] max-w-[100vw] md:max-w-[75vw] max-h-[90vh] overflow-y-auto">
				<h2>Import Cards</h2>
				<div className="custom-divider"/>

				<div className="tabs tabs-border">

					<label className="tab">
						<input type="radio" name="mtg-import-type"
							   id="list-import"
							   defaultChecked={true}
							   onChange={() => {
								   setImportType("list");
							   }}/>

						<span>Import from List</span>
					</label>
					<div className="tab-content border-black p-3">
						<p>Paste a list of cards below. Card names must be exact (except symbols and capitalization) and
							must
							match one of the following formats:</p>
						<div className="flex flex-col md:flex-row w-full">
							<div className="border p-2 grow md:w-max">
								<p>Plains</p>
								<p>Deflecting Swat</p>
								<p>Deflecting Swat</p>
								<p>sakura tribe elder</p>
								<p>chandra flames fury</p>
								<p>commit // memory</p>
							</div>
							<div className="border p-2 grow md:w-max">
								<p>2 Plains</p>
								<p>2 Deflecting Swat</p>
								<p>4 sakura tribe elder</p>
								<p>10 chandra flames fury</p>
								<p>1 Commit</p>
							</div>
							<div className="border p-2 grow md:w-max">
								<p>2x Plains</p>
								<p>2x Deflecting Swat</p>
								<p>4x sakura tribe elder</p>
								<p>10x chandra flames fury</p>
								<p>1x Memory</p>
							</div>
						</div>
						<p className="text-xs">All cards must either have no quantity given, or all cards must have
							quantities.<br/>
							Headers (such as &quot;Main Deck&quot; or &quot;Sideboard&quot;) MUST be removed.</p>
						<fieldset className="fieldset">
							<legend className="fieldset-legend"></legend>
							<textarea className="textarea w-full" placeholder="Paste your card data here"
									  value={importText}
									  onChange={(e) => {
										  setImportText(e.target.value);
									  }}/>
						</fieldset>
					</div>


					<label className="tab">
						<input type="radio" name="mtg-import-type"
							   id="archidekt-import"
							   onChange={() => {
								   setImportType("archidekt");
							   }}/>

						<span>Import from Archidekt <NewBadge/></span>
					</label>
					<div className="tab-content border-black p-3">
						<p>Paste in your Archidekt deck URL here:</p>
						<input className="input w-full" type="url"
							   placeholder="https://archidekt.com/decks/1234567890/my-first-deck" value={importText}
							   onChange={(e) => {
								   setImportText(e.target.value);
							   }}/>
					</div>

					{/*<label className="tab">*/}
					{/*	<input type="radio" name="mtg-import-type"*/}
					{/*		   id="moxfield-import"*/}
					{/*		   onChange={() => {*/}
					{/*			   setImportType("moxfield");*/}
					{/*		   }}/>*/}

					{/*	<span>Import from Moxfield <NewBadge/></span>*/}
					{/*</label>*/}
					{/*<div className="tab-content border-black p-3">*/}
					{/*	<p>Paste in your Moxfield deck URL here:</p>*/}
					{/*	<input className="input w-full" type="url"*/}
					{/*		   placeholder="https://moxfield.com/decks/1234567890/my-first-deck" value={importText}*/}
					{/*		   onChange={(e) => {*/}
					{/*			   setImportText(e.target.value);*/}
					{/*		   }}/>*/}
					{/*	<br/><br/>*/}
					{/*	<label className="label label-sm text-sm">*/}
					{/*	<input type="checkbox" className="checkbox checkbox-sm" checked={moxfieldImportMaybeboard}*/}
					{/*		   onChange={(e) => {*/}
					{/*			   setMoxfieldImportMaybeboard(e.target.checked);*/}
					{/*		   }}*/}
					{/*	/>*/}
					{/*		<span>Import Considering/Maybeboard</span>*/}
					{/*	</label>*/}
					{/*</div>*/}

				</div>

				<br/>

				<div className="collapse bg-base-100 border-gray-500 border h-max">
					<input type="checkbox" defaultChecked={true}/>
					<div className="collapse-title font-semibold pr-8">Additional Settings</div>
					<div className="collapse-content flex flex-col md:flex-row overflow-x-none flex-wrap">
						<label className="label text-sm">
							<input type="checkbox" className="checkbox checkbox-sm" checked={importBasicLands}
								   onChange={(e) => {
									   setImportBasicLands(e.target.checked);
								   }}/>
							Import basic lands
							<span className="tooltip tooltip-right ">
								<span
									className="tooltip-content">If unchecked, any card who&apos;s name is exactly &quot;Plains&quot;, &quot;Mountain&quot;, &quot;Swamp&quot;, &quot;Forest&quot;, or &quot;Island&quot; will be skipped.</span>
								<BiInfoCircle/>
							</span>
						</label>

						<div className="divider md:divider-horizontal"/>

						<label className="label text-sm">
							<select className="select select-sm w-min" value={importReminderTextBehavior}
									onChange={(e) => {
										setImportReminderTextBehavior(parseInt(e.target.value) as ReminderTextBehavior);
									}}>
								<option value={ReminderTextBehavior.NORMAL}>Render reminder text as normal text</option>
								<option value={ReminderTextBehavior.ITALIC}>Italicize reminder text</option>
								<option value={ReminderTextBehavior.HIDDEN}>Exclude reminder text</option>
							</select>
							<span className="tooltip ">
								<span className="tooltip-content">How reminder text should be handed (reminder text is anything in brackets, like this).</span>
								<BiInfoCircle/>
							</span>
						</label>

						<div className="divider md:divider-horizontal"/>

						<label className="label text-sm">
							<input type="checkbox" className="checkbox checkbox-sm" checked={importSplitDFCs}
								   onChange={(e) => {
									   setImportSplitDFCs(e.target.checked);
								   }}/>
							Split DFCs into separate cards
							<span className="tooltip tooltip-right ">
								<span className="tooltip-content">If checked, all DFCs will be imported as two cards instead of one.</span>
								<BiInfoCircle/>
							</span>
						</label>

						<div className="divider md:divider-horizontal"/>

						<label className="label text-sm">
							<input type="checkbox" className="checkbox checkbox-sm" checked={importTemplates}
								   onChange={(e) => {
									   setImportTemplates(e.target.checked);
								   }}/>
							Automatically apply templates
							<span className="tooltip tooltip-left ">
								<span className="tooltip-content">Whether to automatically apply templates based on card types (such as the Planeswalker template for Planeswalkers or Spacecraft template for Spacecraft)</span>
								<BiInfoCircle/>
							</span>
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

				<br/>

				{
					importMessage !== "" && (<label className="label">{importMessage}</label>)
				}
				{
					importError !== "" && (<label className="label text-error whitespace-pre">{importError}</label>)
				}

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