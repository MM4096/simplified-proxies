"use client";

import "../../styles/editor.css";
import "../../styles/card/card.css";
import "../../styles/card/mtg-card.css";
import {Card, CardList} from "@/app/editor/components/cardList";
import {useEffect, useState} from "react";
import {MTGCardObject} from "@/app/editor/components/cards/mtgCardObject";
import {renderToStaticMarkup} from "react-dom/server";
import Link from "next/link";
import {ImportMTG} from "@/app/editor/mtg/components/import";
import {MTGInput} from "@/app/editor/components/inputs";
import {ProjectsBox} from "@/app/editor/components/projectsBox";

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
}

export default function MTGEditorPage() {
	const [cards, setCards] = useState<MTGCard[]>([]);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [tempCard, setTempCard] = useState<MTGCard>({} as MTGCard);

	const [activeTabName, setActiveTabName] = useState<"input" | "list" | "preview" | "options">("input");

	const [currentProject, setCurrentProject] = useState<string | null>(null);

	function changeVal(key: string, value: string) {
		setTempCard({...tempCard, [key as keyof MTGCard]: value});
	}

	function saveChanges() {
		const tempCardCopy = {...tempCard};
		if (editingIndex !== null) {
			setCards([...cards.slice(0, editingIndex), tempCardCopy, ...cards.slice(editingIndex + 1)]);
		} else {
			setCards([...cards, tempCardCopy]);
		}
		setTempCard({} as MTGCard);
		setEditingIndex(null);
	}

	// grab cards
	useEffect(() => {
		function getProjectData() {
			const savedData = localStorage.getItem("mtg-cards");

			if (savedData === null || Array.isArray(JSON.parse(savedData))) {
				return [];
			}
			const parsedData = JSON.parse(savedData);

			if (currentProject === null || currentProject === "") {
				return (parsedData["UNSAVED"] || []) as MTGCard[];
			}
			return (parsedData[currentProject] || []) as MTGCard[];
		}

		const projectData = getProjectData();
		console.log(currentProject, projectData);
		if (projectData.length > 0) {
			// if cards already exist in the new project, use that
			setCards(projectData);
		} else {
			// otherwise, ignore it and save the new cards

		}
	}, [currentProject]);

	// update storage on card change
	useEffect(() => {
		function setProjectData(data: MTGCard[]) {
			const savedData = localStorage.getItem("mtg-cards");
			let parsedData = JSON.parse(savedData || "{}");
			if (savedData === null || Array.isArray(JSON.parse(savedData))) {
				parsedData = {};
			}

			parsedData[currentProject || "UNSAVED"] = data;
			localStorage.setItem("mtg-cards", JSON.stringify(parsedData));
		}
		// setItem("mtg-cards", cards);
		setProjectData(cards);
	}, [cards, currentProject]);

	useEffect(() => {
		if (editingIndex !== null && editingIndex >= 0 && editingIndex < cards.length) {
			setTempCard(cards[editingIndex]);
		} else {
			setTempCard({} as MTGCard);
		}
	}, [cards, editingIndex]);

	// update preview view when tempCard updated
	useEffect(() => {
		const previewElem = document.getElementById("card-container");
		if (previewElem) {
			previewElem.innerHTML = renderToStaticMarkup(<MTGCardObject card={tempCard || {}} isBlackWhite={true}/>);
		}
	}, [tempCard]);

	return (<div className="main-container">
		<h1 className="small-hidden">Simplified Proxies: <i>Magic: The Gathering</i> editor</h1>
		<div className="main-wrapper">

			<div className={`input-container h-full overflow-y-auto ${activeTabName === "input" ? "active-tab" : ""}`}>
				<h2 className="custom-divider">Details</h2>

				<div className="flex flex-col gap-2 overflow-y-auto grow">
					<MTGInput card={tempCard} valKey="card_name" setValue={changeVal} title="Card Name"
							  placeholder="Sakura Tribe-Elder"/>

					<MTGInput card={tempCard} valKey="mana_cost" setValue={changeVal} title="Mana Cost"
							  placeholder="{1}{g}"/>

					<MTGInput card={tempCard} valKey="type_line" setValue={changeVal} title="Type Line"
							  placeholder="Creature {-} Snake Shaman"/>

					<MTGInput card={tempCard} valKey="card_text" setValue={changeVal} title="Card Text"
							  placeholder="Sacrifice this creature: Search your library for a basic land card, put that card onto the battlefield tapped, then shuffle."
							  isTextarea={true}/>

					<MTGInput card={tempCard} valKey="flavor_text" setValue={changeVal} title="Flavor Text"
							  placeholder="There were no tombstones in orochi territory. Slain warriors were buried with a tree sapling, so they would become a part of the forest after death."
							  isTextarea={true}/>

					<div className="flex flex-row gap-2">
						<MTGInput card={tempCard} valKey="power" setValue={changeVal} title="Power"
								  placeholder=""/>
						<MTGInput card={tempCard} valKey="toughness" setValue={changeVal} title="Toughness"
								  placeholder=""/>
					</div>
					<p className="label text-xs">If Planeswalker loyalty or Battle Defense is needed, just filling
						out &apos;Power&apos; will work.</p>

					<div className="collapse bg-base-100 border flex-none">
						<input type="checkbox"/>
						<div className="collapse-title">Dual-Faced Cards</div>
						<div className="collapse-content">
							<MTGInput card={tempCard} valKey="reverse_card_name" setValue={changeVal} title="Name"
									  placeholder=""/>
							<MTGInput card={tempCard} valKey="reverse_mana_cost" setValue={changeVal} title="Mana Cost"
									  placeholder=""/>
							<MTGInput card={tempCard} valKey="reverse_type_line" setValue={changeVal} title="Type Line"
									  placeholder=""/>
							<MTGInput card={tempCard} valKey="reverse_text" setValue={changeVal} title="Card Text"
									  placeholder="" isTextarea={true}/>

							<div className="flex flex-row gap-2">
								<MTGInput card={tempCard} valKey="reverse_power" setValue={changeVal} title="Power"
										  placeholder=""/>
								<MTGInput card={tempCard} valKey="reverse_toughness" setValue={changeVal}
										  title="Toughness"
										  placeholder=""/>
							</div>
							<p className="label text-xs">If Planeswalker loyalty or Battle Defense is needed, just
								filling
								out &apos;Power&apos; will work.</p>
						</div>
					</div>

					<fieldset className="fieldset">
						<legend className="fieldset-legend">Notes</legend>
						<input type="text" name="notes" placeholder=""
							   className="input"/>
					</fieldset>
				</div>

				<div className="flex flex-row gap-2 w-full">
					<button className="btn btn-primary" onClick={saveChanges}>{
						editingIndex !== null ? "Update Card" : "Add Card"
					}</button>
					{
						(editingIndex !== null) && (<>
							<button className="btn btn-secondary" onClick={(e) => {
								e.preventDefault();
								setEditingIndex(null);
							}}>Cancel Edits
							</button>
						</>)
					}
				</div>

			</div>

			<CardList cards={cards} setCards={setCards} editingIndex={editingIndex}
					  setEditingIndex={setEditingIndex} className={`${activeTabName === "list" ? "active-tab" : ""}`}/>

			<div className={`card-preview ${activeTabName === "preview" ? "active-tab" : ""}`}>
				<h2 className="custom-divider">Preview</h2>
				<br/>
				<div id="card-container" className="w-full h-full">
					<div className="card">
						<p>Text</p>
						<div className="card-divider"/>
					</div>
				</div>
			</div>

			<div className={`options p-1 ${activeTabName === "options" ? "active-tab" : "hidden"}`}>
				<button className="btn btn-primary" onClick={() => {
					setActiveTabName("input")
				}}>Edit Card
				</button>
				<button className="btn btn-primary" onClick={() => {
					setActiveTabName("list")
				}}>Card List
				</button>
				<button className="btn btn-primary" onClick={() => {
					setActiveTabName("preview")
				}}>Preview
				</button>

				<div className="grow"/>

				<ImportMTG cards={cards} setCardsAction={setCards}/>
				<Link className="btn btn-primary" href="/editor/mtg/print">Preview and Print Proxies</Link>
				<Link className="btn btn-secondary" href="/">Home</Link>
			</div>

		</div>

		<div className="small-visible w-full">
			<button className="btn btn-xs w-full" onClick={() => {
				setActiveTabName("options")
			}}>Menu
			</button>
		</div>

		<div className="flex flex-row gap-2 w-full small-hidden">
			<Link className="btn btn-secondary" href="/">Home</Link>
			<Link className="btn btn-primary" href="/editor/mtg/print">Preview and Print Proxies</Link>
			<ImportMTG cards={cards} setCardsAction={setCards}/>
			<ProjectsBox localStorageKey="mtg-cards" setProjectAction={setCurrentProject}
						 selectedProject={currentProject}/>
		</div>
	</div>)
}