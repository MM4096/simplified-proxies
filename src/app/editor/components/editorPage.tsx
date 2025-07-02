// "use client";
//
// import "../../styles/editor.css";
// import {Card} from "@/app/editor/components/cardList";
// import {useEffect, useState} from "react";
// import {MTGCard} from "@/app/editor/mtg/page";
// import {getItem, setItem} from "@/lib/storage";
//
// /**
//  * A generic template for all editor pages
//  * @param gameName The title of the game
//  * @param gameLocalStorageKey The localStorage key of this game
//  * @constructor
//  */
// export function EditorPage({gameName, gameLocalStorageKey}: {
// 	gameName: string,
// 	gameLocalStorageKey: string,
// }) {
// 	const [cards, setCards] = useState<Card[]>([]);
// 	const [editingIndex, setEditingIndex] = useState<number | null>(null);
// 	const [tempCard, setTempCard] = useState<Card>({});
//
// 	const [activeTab, setActiveTab] = useState<"input" | "list" | "preview" | "options">("input");
//
// 	const [currentProject, setCurrentProject] = useState<string | null>(null);
//
// 	function changeVal(key: string, value: string) {
// 		setTempCard({...tempCard, [key as keyof Card]: value});
// 	}
//
// 	function saveChanges() {
// 		const tempCardCopy = {...tempCard};
// 		if (editingIndex !== null) {
// 			setCards([...cards.slice(0, editingIndex), tempCardCopy, ...cards.slice(editingIndex + 1)]);
// 		} else {
// 			setCards([...cards, tempCardCopy]);
// 		}
// 		setTempCard({} as Card);
// 		setEditingIndex(null);
// 	}
//
// 	// get cards from storage
// 	useEffect(() => {
// 		if (currentProject !== null) {
// 			setCards(getItem(`${gameLocalStorageKey}/${currentProject}`, []) as Card[]);
// 		} else {
// 			setCards([]);
// 		}
// 	}, [currentProject, gameLocalStorageKey])
//
// 	// write cards to storage
// 	useEffect(() => {
// 		if (currentProject === null) {
// 			// TODO: Implement ask to save dialog
// 			return;
// 		}
// 		setItem(`${gameLocalStorageKey}/${currentProject}`, cards);
// 	}, [cards, currentProject, gameLocalStorageKey]);
//
// 	return (<div className="main-container">
// 		<h1 className="small-hidden">Simplified Proxies: <i>{gameName}</i></h1>
//
// 		<div className="main-wrapper">
//
//
//
// 		</div>
//
// 	</div>)
// }