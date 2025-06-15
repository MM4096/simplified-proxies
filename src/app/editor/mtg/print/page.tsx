"use client";

import "../../../styles/editor.css"
import "../../../styles/print.css"
import "../../../styles/card/card.css"
import "../../../styles/card/mtg-card.css"

import {useEffect, useState} from "react";
import {MTGCard} from "@/app/editor/mtg/page";
import {getItem} from "@/lib/storage";
import Link from "next/link";
import {MtgCard} from "@/app/editor/components/cards/mtgCard";

export default function MTGPrintPage() {
	const [cards, setCards] = useState<MTGCard[]>([]);

	const [allCards, setAllCards] = useState<MTGCard[]>([]);

	useEffect(() => {
		setCards(getItem("mtg-cards", []) as MTGCard[]);
	}, []);

	useEffect(() => {
		const temp: MTGCard[] = [];

		cards.map((card) => {
			for (let i = 0; i < (card.quantity || 1); i++) {
				temp.push(card);
			}
		})

		setAllCards(temp);

	}, [cards]);

	return (<div className="text-left w-full h-full flex flex-col gap-2">
		<div className="no-print">
			<h1>Preview and Print Proxies</h1>
			<div className="flex flex-row gap-2">
				<Link href="/editor/mtg" className="btn btn-secondary">Back to Editor</Link>
				<button className="btn btn-primary" onClick={() => {
					window.print();
				}}>Print</button>
			</div>
		</div>
		<div className="custom-divider"/>
		<div className="card-print">
			{
				allCards.map((card, index) => {
					return <MtgCard card={card} isBlackWhite={true} key={index}/>
				})
			}
		</div>
	</div>)
}