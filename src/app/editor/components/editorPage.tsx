"use client";

import "../../styles/editor.css";
import {Card, CardList} from "@/app/editor/components/cardList";
import {ReactNode, useEffect, useState} from "react";
import {MTGCard} from "@/app/editor/mtg/page";
import Link from "next/link";
import {ProjectsBox} from "@/app/editor/components/projectsBox";
import {renderToStaticMarkup} from "react-dom/server";
import {MTGCardObject} from "@/app/editor/components/cards/mtgCardObject";
import {PTCGCardObject} from "@/app/editor/components/cards/ptcgCardObject";
import {PTCGCard} from "@/app/editor/ptcg/page";
import {confirmationPrompt} from "@/app/components/confirmation/confirmationFunctions";

/**
 * A generic template for all editor pages
 * @param gameName The title of the game
 * @param gameId
 * @param gameLocalStorageKey The localStorage key of this game
 * @param cardInputs Inputs to fill in card information
 * @constructor
 */
export function EditorPage({gameName, gameId, gameLocalStorageKey, cardInputsAction, importCardsAction}: {
	gameName: string,
	gameLocalStorageKey: string,
	gameId: "mtg" | "ptcg",
	cardInputsAction: (props: { onChange: (key: string, value: string) => void, card: Card }) => ReactNode,
	importCardsAction: (props: { setCards: (cards: Card[]) => void, cards: Card[] }) => ReactNode,
}) {
	const [cards, setCards] = useState<Card[]>([]);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [tempCard, setTempCard] = useState<Card>({});

	const [activeTab, setActiveTab] = useState<"input" | "list" | "preview" | "options">("input");

	const [currentProject, setCurrentProject] = useState<string | null>(null);

	function changeVal(key: string, value: string) {
		setTempCard({...tempCard, [key as keyof Card]: value});
	}

	function saveChanges() {
		const tempCardCopy = {...tempCard};
		if (editingIndex !== null) {
			setCards([...cards.slice(0, editingIndex), tempCardCopy, ...cards.slice(editingIndex + 1)]);
		} else {
			setCards([...cards, tempCardCopy]);
		}
		setTempCard({} as Card);
		setEditingIndex(null);
	}

	function hasChanges() {
		if (editingIndex !== null && editingIndex >= 0) {
			return JSON.stringify(tempCard) !== JSON.stringify(cards[editingIndex]);
		}
		return JSON.stringify(tempCard) !== JSON.stringify({});
	}

	// get cards from storage
	useEffect(() => {
		function getProjectData() {
			const savedData = localStorage.getItem(gameLocalStorageKey);

			if (savedData === null || Array.isArray(JSON.parse(savedData))) {
				return [];
			}
			const parsedData = JSON.parse(savedData);

			if (currentProject === null || currentProject === "") {
				return (parsedData["UNSAVED"] || []) as Card[];
			}
			return (parsedData[currentProject] || []) as Card[];
		}

		const projectData = getProjectData();
		if (projectData.length > 0) {
			// if cards already exist in the new project, use that
			setCards(projectData);
		} else {
			// otherwise, ignore it and save the new cards

		}
	}, [currentProject, gameLocalStorageKey])

	// write cards to storage
	useEffect(() => {
		function setProjectData(data: MTGCard[]) {
			const savedData = localStorage.getItem(gameLocalStorageKey);
			let parsedData = JSON.parse(savedData || "{}");
			if (savedData === null || Array.isArray(JSON.parse(savedData))) {
				parsedData = {};
			}

			parsedData[currentProject || "UNSAVED"] = data;
			localStorage.setItem(gameLocalStorageKey, JSON.stringify(parsedData));
		}

		setProjectData(cards);
	}, [cards, currentProject, gameLocalStorageKey]);
	useEffect(() => {
		if (editingIndex !== null && editingIndex >= 0 && editingIndex < cards.length) {
			setTempCard(cards[editingIndex]);
		} else {
			setTempCard({} as Card);
		}
	}, [cards, editingIndex]);

	// update preview view when tempCard updated
	useEffect(() => {
		const previewElem = document.getElementById("card-container");
		if (previewElem) {
			let previewHTML: ReactNode = <></>;
			if (gameId === "mtg") {
				previewHTML = <MTGCardObject card={tempCard as MTGCard || {}} isBlackWhite={true}/>
			} else if (gameId === "ptcg") {
				previewHTML = <PTCGCardObject card={tempCard as PTCGCard} isBlackWhite={true}/>
			}
			previewElem.innerHTML = renderToStaticMarkup(previewHTML);
		}
	}, [gameId, tempCard]);

	return (<div className="main-container">
		<h1 className="small-hidden">Simplified Proxies: <i>{gameName}</i></h1>

		<div className="main-wrapper">

			<div
				className={`grow shrink-0 input-container h-full overflow-y-auto ${activeTab === "input" ? "active-tab" : ""}`}>
				<h2 className="custom-divider">Details</h2>

				<div className="flex flex-col gap-2 overflow-y-auto grow">
					{cardInputsAction({onChange: changeVal, card: tempCard})}
				</div>

				<div className="flex flex-row gap-2 w-full">
					<button className="btn btn-primary" onClick={saveChanges}>{
						editingIndex !== null ? "Save" : "Add Card"
					}</button>
					{
						(editingIndex !== null) && (<>
							<button className="btn btn-secondary" onClick={(e) => {
								e.preventDefault();
								setEditingIndex(null);
							}}>Discard Changes
							</button>
						</>)
					}
				</div>
			</div>

			<CardList cards={cards} setCards={setCards} editingIndex={editingIndex} setEditingIndex={async (index: number | null) => {
				if (hasChanges()) {
					if (!await confirmationPrompt("Unsaved Changes", "You have unsaved changes. Would you like to delete those changes?", "No", "Yes")) {
						return
					}
				}
				setEditingIndex(index);
			}}
					  className={`${activeTab === "list" ? "active-tab" : ""} grow shrink-0`} newCard={async () => {
				if (hasChanges()) {
					if (!await confirmationPrompt("Unsaved Changes", "You have unsaved changes. Would you like to delete those changes?", "No", "Yes")) {
						return;
					}
				}
				setEditingIndex(null);
			}}/>

			<div className={`card-preview ${activeTab === "preview" ? "active-tab" : ""} w-min`}>
				<h2 className="custom-divider">Preview</h2>
				<br/>
				<div id="card-container" className="w-full h-full">
					<div className="card">
						<p>Text</p>
						<div className="card-divider"/>
					</div>
				</div>
			</div>

			<div className={`options p-1 ${activeTab === "options" ? "active-tab" : "hidden"}`}>
				<button className="btn btn-primary" onClick={() => {
					setActiveTab("input")
				}}>Edit Card
				</button>
				<button className="btn btn-primary" onClick={() => {
					setActiveTab("list")
				}}>Card List
				</button>
				<button className="btn btn-primary" onClick={() => {
					setActiveTab("preview")
				}}>Preview
				</button>

				<div className="grow"/>

				{importCardsAction({setCards, cards})}
				<Link className="btn btn-primary" href="/editor/mtg/print">Preview and Print Proxies</Link>
				<Link className="btn btn-secondary" href="/">Home</Link>
			</div>

		</div>

		<div className="small-visible w-full">
			<button className="btn btn-xs w-full" onClick={() => {
				setActiveTab("options")
			}}>Menu
			</button>
		</div>

		<div className="flex flex-row gap-2 w-full small-hidden">
			<Link className="btn btn-secondary" href="/">Home</Link>
			<Link className="btn btn-primary" href={`/editor/${gameId}/print`}>Preview and Print Proxies</Link>
			{importCardsAction({setCards, cards})}
			<ProjectsBox localStorageKey={gameLocalStorageKey} setProjectAction={setCurrentProject}
						 selectedProject={currentProject}/>
		</div>

	</div>)
}