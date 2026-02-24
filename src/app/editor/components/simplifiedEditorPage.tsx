import {Card} from "@/lib/card";
import {ReactNode} from "react";

export function simplifiedEditorPage({gameName, gameLocalStorageKey, gameId, importCardsAction} : {
	gameName: string,
	gameLocalStorageKey: string,
	gameId: "mtg" | "ptcg",
	importCardsAction: (props: { setCards: (cards: Card[]) => void, cards: Card[] }) => ReactNode,
}) {
	return (<>
		{}
	</>)
}