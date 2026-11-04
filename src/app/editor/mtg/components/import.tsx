"use client";

import {ReactElement, useState} from "react";
import {MTGCard} from "@/lib/card";
import {BiInfoCircle} from "react-icons/bi";
import {useUmamiEvent} from "@/app/components/analytics";
import AnimatedModalHeight from "@/app/components/animatedModalHeight";
import Link from "next/link";
import {alertPrompt, confirmationPrompt} from "@/app/components/confirmation/confirmationFunctions";
import {FlavorTextBehavior, MTGAPIImportType, ReminderTextBehavior} from "@/lib/mtg/mtgTypes";
import {CardTextareaInput} from "@/app/editor/mtg/components/inputs/cardTextareaInput";
import {AdditionalSettings} from "@/app/editor/mtg/components/inputs/additionalSettings";

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

	function githubLabel(): ReactElement {
		if (importErrorCount > 1) {
			return (<label className="label text-sm whitespace-pre italic">If this issue persists, please open a
				bug report on <Link href="https://github.com/MM4096/simplified-proxies/issues/new/choose"
				                    target="_blank" className="link">GitHub</Link></label>)
		}
		return (<></>)
	}

	async function importCards() {
		setDisableButtons(true);
		setImportMessage("Fetching Cards...");

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
								changes that were made.</p>
							<b>Warnings:</b>
							<div className="overflow-y-auto overflow-x-hidden">
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
				alertPrompt("Import Failed", (<>
					<span>{json["message"]}</span>{githubLabel()}
				</>), "Close").then();

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
			alertPrompt("Import Failed", <>
				<span>{e.toString()}</span>{githubLabel()}
			</>, "Close").then();
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
				<CardTextareaInput text={requestBody.cards || ""} setTextAction={(value) => {
					setRequestValue("cards", value)
				}}/>
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

		<div className="m-2 grow"/>

		<div className="collapse collapse-arrow bg-base-100 border-gray-500 border h-max">
			<input type="checkbox" defaultChecked={true}/>
			<div className="collapse-title font-semibold pr-8">Additional Settings</div>
			<div className="collapse-content flex flex-col overflow-x-hidden">
				<AdditionalSettings overwrite={overwrite} setOverwrite={setOverwrite} requestBody={requestBody}
				                    additionalSettingText={additionalSettingText}
				                    setAdditionalSettingText={setAdditionalSettingText}
				                    setRequestValue={setRequestValue}/>
			</div>
		</div>

		<div className="p-1"/>

		{
			importMessage !== "" && (<label className="label">{importMessage}</label>)
		}

		<div className="p-1"/>

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