"use client";

import {SimplifiedEditorPage} from "@/app/editor/components/editorPage";
import {Card} from "@/lib/card";
import {ReactNode} from "react";
import {ImportMTG} from "@/app/editor/mtg/components/import";
import {useRouter} from "next/navigation";

export default function SimplifiedMTGEditor() {
	const router = useRouter();

	return (<SimplifiedEditorPage
		gameName="Magic: The Gathering" gameId="mtg" gameLocalStorageKey="mtg-cards"

		importCardsAction={({setCards, cards}): ReactNode => {
			return <ImportMTG cards={cards} setCardsAction={setCards} hideCancelButton={true} closeDialogAction={() => {
				router.push("/editor/mtg/print");
			}}/>
		}}

		cardInputsAction={function (props: {
			onChange: (key: string, value: string) => void;
			card: Card;
		}): ReactNode {
			throw new Error("Function not implemented.");
		}}
	/>)
}