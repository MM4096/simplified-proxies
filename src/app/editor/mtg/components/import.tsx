"use client";

import {useState} from "react";
import {MTGCard} from "@/lib/card";
import {BiInfoCircle} from "react-icons/bi";
import {useUmamiEvent} from "@/app/components/analytics";
import AnimatedModalHeight from "@/app/components/animatedModalHeight";
import Link from "next/link";
import {alertPrompt, confirmationPrompt} from "@/app/components/confirmation/confirmationFunctions";
import {FlavorTextBehavior, MTGAPIImportType, ReminderTextBehavior} from "@/lib/mtg/mtgTypes";
import {CheckboxInput, EnumInput, StringInput} from "@/app/editor/components/inputs/inputs";

export function ImportMTG({
							  cards,
							  setCardsAction,
							  closeDialogAction,
							  onImportAction,
							  cancelButtonText = "Cancel",
							  animateHeight = true
						  }: {
	cards: MTGCard[],
	setCardsAction: (cards: MTGCard[]) => void,
	closeDialogAction?: () => void,
	onImportAction?: () => void,
	cancelButtonText?: string,
	animateHeight?: boolean,
}) {
	const [importMessage, setImportMessage] = useState<string>("");
	const [importError, setImportError] = useState<string>("");
	const [overwrite, setOverwrite] = useState<boolean>(false);

	const [disableButtons, setDisableButtons] = useState<boolean>(false);

	const [requestBody, setRequestBody] = useState<MTGAPIImportType>({
		cards: "",
		importBasicLands: true,
		reminderTextBehavior: ReminderTextBehavior.ITALIC,
		flavorTextBehavior: FlavorTextBehavior.NAME,
		importTemplates: true,
		includeTokens: false,
		splitDFCs: false,
		importNote: "",
		suppressWarnings: false,
		includeMessages: false,
	});

	const [importType, setImportType] = useState<"moxfield" | "archidekt" | "list">("list");
	const [moxfieldImportMaybeboard, setMoxfieldImportMaybeboard] = useState<boolean>(false);
	const [moxfieldUseForeignLanguage, setmoxfieldUseForeignLanguage] = useState<boolean>(true);

	const [additionalSettingText, setAdditionalSettingText] = useState<string>("");

	const [importErrorCount, setImportErrorCount] = useState<number>(0);

	const umamiTracker = useUmamiEvent();

	function setRequestValue(key: keyof MTGAPIImportType, value: any) {
		setRequestBody({
			...requestBody,
			[key]: value,
		})
	}

	async function importCards() {
		setDisableButtons(true);
		setImportMessage("Fetching Cards...");
		setImportError("");

		let fetchUrl: string;
		switch (importType) {
			case "archidekt":
				fetchUrl = `/api/import/mtg/archidekt?url=${encodeURIComponent(requestBody.cards || "")}`;
				break;
			case "list":
				fetchUrl = `/api/import/mtg`;
				break;
			case "moxfield":
				fetchUrl = `/api/import/mtg/moxfield?url=${encodeURIComponent(requestBody.cards || "")}&importMaybeboard=${moxfieldImportMaybeboard}&useForeignLanguage=${moxfieldUseForeignLanguage}`;
				break;
		}

		fetch(fetchUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		}).then(async (response) => {
			if (response.ok) {
				const json = await response.json();
				const retCards: MTGCard[] = json["cards"];

				// check if API returned any warnings
				const warnings: string[] = json.hasOwnProperty("warnings") ? json["warnings"] : [];
				if (warnings.length > 0) {
					setImportMessage("Resolving Warnings...")

					const shouldNotAbort = await confirmationPrompt(`Warning`,
						(<>
							<p><b>Your import didn&apos;t fail,
								but {warnings.length} warning{warnings.length > 1 ? "s were" : " was"} encountered.</b><br/>
								You can either cancel the import and fix the warnings manually, or accept the automatic
								changes that were made.</p><br/>
							<b>Warnings:</b>
							<div className="overflow-scroll">
								<ul className="list-disc">
									{
										warnings.map((warning, index) => {
											return (<li key={index}>{index + 1}: <i>{warning}</i></li>)
										})
									}
								</ul>
							</div>

							<label className="label text-sm whitespace-pre italic">Something wrong? Please open a
								bug report on<Link href="https://github.com/MM4096/simplified-proxies/issues/new/choose"
								                   target="_blank" className="link">GitHub</Link></label>
						</>),
						"Cancel Import", "Accept Changes");

					umamiTracker("mtg-CardsImported", {
						importType: importType,
						importBody: requestBody.cards,
						success: shouldNotAbort,
						warnings: warnings,
					});

					if (!shouldNotAbort) {
						setImportMessage("");
						setImportError("Import Cancelled: User Aborted");
						setDisableButtons(false);
						return;
					}
				} else {
					umamiTracker("mtg-CardsImported", {
						importType: importType,
						importBody: requestBody.cards,
						success: true,
						warnings: warnings,
					});
				}

				const messages: string[] = json.hasOwnProperty("messages") ? json["messages"] : [];
				if (messages.length > 0) {
					await alertPrompt("Debug Log", (<>
						<b>Record of {messages.length} log{messages.length != 1 ? "s" : ""}:</b>
						<div className="overflow-scroll">
							<ul className="list-disc">
								{
									messages.map((message, index) => {
										return (<li key={index}>{index + 1}: <i>{message}</i></li>)
									})
								}
							</ul>
						</div>
					</>), "Close");
				}

				if (overwrite) {
					setCardsAction(retCards);
				} else {
					const newCards: MTGCard[] = [];
					newCards.push(...cards);
					newCards.push(...retCards);
					setCardsAction(newCards);
				}

				setImportErrorCount(0);
				if (onImportAction) {
					onImportAction();
				}
			} else {
				const json = await response.json();
				setImportError(json["message"]);

				umamiTracker("mtg-CardsImported", {
					importType: importType,
					importBody: requestBody.cards,
					success: "false",
					error: json["message"],
				});
				setImportErrorCount(importErrorCount + 1);
			}

		}).catch((e) => {
			console.log(e);
			setImportError(e.toString())
		}).finally(() => {
			setDisableButtons(false);
			setImportMessage("");
		})

	}

	const innerContent = (<>
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
				<p>Paste a list of cards below. Card names must be exact (except symbols and capitalization)
					and must match one of the following formats:</p>
				<div className="flex flex-col md:flex-row w-full">
					<div className="border p-2 grow md:w-max">
						<p>Plains</p>
						<p>Deflecting Swat</p>
						<p>Deflecting Swat</p>
						<p>sakura tribe elder</p>
						<p>jace the perfected mind</p>
						<p>commit // memory</p>
					</div>
					<div className="border p-2 grow md:w-max">
						<p>2 Plains</p>
						<p>2 Deflecting Swat</p>
						<p>4 sakura tribe elder</p>
						<p>10 jace the perfected mind</p>
						<p>1 Commit</p>
					</div>
					<div className="border p-2 grow md:w-max">
						<p>2x Plains</p>
						<p>2x Deflecting Swat</p>
						<p>4x sakura tribe elder</p>
						<p>10x jace the perfected mind</p>
						<p>1x Memory</p>
					</div>
				</div>
				<p className="text-xs">All cards must either have no quantity given, or all cards must have
					quantities.<br/>
					Headers (such as &quot;Main Deck&quot; or &quot;Sideboard&quot;) MUST be removed.</p>
				<fieldset className="fieldset">
					<legend className="fieldset-legend"></legend>
					<textarea className="textarea w-full" placeholder="Paste your card data here"
					          value={requestBody.cards}
					          onChange={(e) => {
								  setRequestValue("cards", e.target.value);
							  }}/>
				</fieldset>
			</div>


			<label className="tab">
				<input type="radio" name="mtg-import-type"
				       id="archidekt-import"
				       onChange={() => {
						   setImportType("archidekt");
					   }}/>

				<span>Import from Archidekt</span>
			</label>
			<div className="tab-content border-black p-3">
				<p>Paste in your Archidekt deck URL here:</p>
				<input className="input w-full" type="url"
				       placeholder="https://archidekt.com/decks/1234567890/my-first-deck" value={requestBody.cards}
				       onChange={(e) => {
						   setRequestValue("cards", e.target.value);
					   }}/>
			</div>

			<label className="tab">
				<input type="radio" name="mtg-import-type"
				       id="moxfield-import"
				       onChange={() => {
						   setImportType("moxfield");
					   }}/>

				<span>Import from Moxfield</span>
			</label>
			<div className="tab-content border-black p-3">
				<p>Paste in your Moxfield deck URL here:</p>
				<input className="input w-full" type="url"
				       placeholder="https://moxfield.com/decks/1234567890" value={requestBody.cards}
				       onChange={(e) => {
						   setRequestValue("cards", e.target.value);
					   }}/>
				<br/><br/>

				<div className="flex flex-row gap-2">
					<label className="label label-sm text-sm">
						<input type="checkbox" className="checkbox checkbox-sm" checked={moxfieldImportMaybeboard}
						       onChange={(e) => {
								   setMoxfieldImportMaybeboard(e.target.checked);
							   }}
						/>
						<span>Import Considering/Maybeboard</span>
					</label>

					<label className="label label-sm text-sm">
						<input type="checkbox" className="checkbox checkbox-sm" checked={moxfieldUseForeignLanguage}
						       onChange={(e) => {
								   setmoxfieldUseForeignLanguage(e.target.checked);
							   }}
						/>
						<span>Preserve Original Card Language</span>
						<div className="tooltip"
						     data-tip="If checked, will import all cards according to the language as they appear in Moxfield (e.g. Japanese cards will use Japanese). If unchecked, imports the English version.">
							<BiInfoCircle/>
						</div>
					</label>
				</div>
			</div>

		</div>
		<br/>

		<label className="label">
			<input type="checkbox" className="checkbox checkbox-error" checked={overwrite}
			       onChange={(e) => {
					   setOverwrite(e.target.checked);
				   }}/>
			Overwrite existing cards
		</label>

		<br/>

		<div className="grow"/>

		<div className="collapse collapse-arrow bg-base-100 border-gray-500 border h-max">
			<input type="checkbox" defaultChecked={true}/>
			<div className="collapse-title font-semibold pr-8">Additional Settings</div>
			<div className="collapse-content flex flex-col overflow-x-none">
				<div className="w-full h-full flex flex-col md:flex-row overflow-x-none flex-wrap">

					<CheckboxInput text="Import Basic Lands" value={requestBody.importBasicLands || true}
					               tooltipText="Whether to import basic lands. Plains, Mountain, Swamp, Island, and Forest are considered basic lands."
					               setValueAction={
									   (value) => setRequestValue("importBasicLands", value)
								   }
					               onTooltipAction={setAdditionalSettingText}
					/>

					<div className="divider md:divider-horizontal"/>

					<EnumInput
						tooltipText="How reminder text should be handled. (Reminder text is anything in brackets, like this.)"
						value={requestBody.reminderTextBehavior || 0}
						setValueAction={(value) => setRequestValue("reminderTextBehavior", value)}
						options={[{
							value: ReminderTextBehavior.NORMAL,
							text: "Render reminder text as normal text",
						}, {
							value: ReminderTextBehavior.ITALIC,
							text: "Italicize reminder text",
						}, {
							value: ReminderTextBehavior.HIDDEN,
							text: "Exclude reminder text",
						}]}
						onTooltipAction={setAdditionalSettingText} text="Reminder Text Behavior"/>

					<div className="divider md:divider-horizontal"/>

					<EnumInput value={requestBody.flavorTextBehavior || 0}
					           tooltipText="Flavor names are reprints with different names (e.g. Vivi&apos;s Thunder Magic is Lightning Bolt.)"
					           setValueAction={(value) => setRequestValue("flavorTextBehavior", value)}
					           options={[{
								   value: FlavorTextBehavior.NAME,
								   text: "Import only flavor/alternative names",
							   }, {
								   value: FlavorTextBehavior.BOTH,
								   text: "Import both flavor names and flavor text",
							   }, {
								   value: FlavorTextBehavior.NONE,
								   text: "Exclude flavor names and flavor text",
							   }]}
					           onTooltipAction={setAdditionalSettingText} text="Flavor Text Behavior"/>

					<div className="divider md:divider-horizontal"/>

					<CheckboxInput text="Split DFCs into separate cards" value={requestBody.splitDFCs || false}
					               setValueAction={(value) => setRequestValue("splitDFCs", value)}
					               tooltipText="If checked, all DFCs will be imported as two cards, one for each side."
					               onTooltipAction={setAdditionalSettingText}/>

					<div className="divider md:divider-horizontal"/>

					<CheckboxInput text="Automatically apply templates" value={requestBody.importTemplates || false}
					               setValueAction={(value) => setRequestValue("importTemplates", value)}
					               tooltipText="Whether to automatically apply templates based on detected card types."
					               onTooltipAction={setAdditionalSettingText}/>

					<div className="divider md:divider-horizontal"/>

					<StringInput value={requestBody.importNote || ""} placeholder="Import Notes (optional)"
					             setValueAction={(value) => setRequestValue("importNote", value)}
					             tooltipText="Any note you want to add to all the cards"
					             onTooltipAction={setAdditionalSettingText} text="Import Notes"/>

					<div className="divider md:divider-horizontal"/>

					<CheckboxInput text="Suppress Warnings" value={requestBody.suppressWarnings || false}
					               setValueAction={(value) => setRequestValue("suppressWarnings", value)}
					               tooltipText="If checked, will automatically accept all autocorrect suggestions and ignore all warnings."
					               onTooltipAction={setAdditionalSettingText}/>

					<div className="divider md:divider-horizontal"/>

					<CheckboxInput text="Include Log" value={requestBody.includeMessages || false}
					               setValueAction={(value) => setRequestValue("includeMessages", value)}
					               tooltipText="If checked, will return and display any logs produced."
					               onTooltipAction={setAdditionalSettingText}/>
				</div>

				<div className="divider"/>

				<p className="text-sm italic">{additionalSettingText != "" ? additionalSettingText : "Click on an info circle to learn more about a setting."}</p>
			</div>
		</div>
		<br/>

		{
			importMessage !== "" && (<label className="label">{importMessage}</label>)
		}
		{
			importError !== "" && (<>
				<label className="label text-error whitespace-pre">{importError}</label>
				{
					importErrorCount > 1 && (<>
						<br/>
						<label className="label text-sm whitespace-pre italic">If this issue persists, please open a
							bug
							report on<Link href="https://github.com/MM4096/simplified-proxies/issues/new/choose"
							               target="_blank" className="link">GitHub</Link></label>
					</>)
				}
			</>)
		}

		<div className="flex flex-row gap-2 w-full">
			{cancelButtonText && (<button className="btn btn-secondary grow" onClick={() => {
				if (closeDialogAction) {
					closeDialogAction();
				}
			}} disabled={disableButtons}>{cancelButtonText}
			</button>)}
			<button className="btn btn-primary grow" onClick={() => {
				importCards().then();
			}} disabled={disableButtons}>Import
			</button>
		</div>
	</>)

	if (animateHeight) {
		return (<AnimatedModalHeight>
			{innerContent}
		</AnimatedModalHeight>)
	}

	return innerContent;
}