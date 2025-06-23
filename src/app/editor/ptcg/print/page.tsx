"use client";

import "../../../styles/editor.css"
import "../../../styles/print.css"
import "../../../styles/card/card.css"
import "../../../styles/card/ptcg-card.css"

import {useState, useEffect} from "react";
import {PTCGCard} from "@/app/editor/ptcg/page";
import {getItem} from "@/lib/storage";
import Link from "next/link";
import {PTCGCardObject} from "@/app/editor/components/cards/ptcgCardObject";

export default function PTCGPrintPage() {
	const [cards, setCards] = useState<PTCGCard[]>([]);

	const [allCards, setAllCards] = useState<PTCGCard[]>([]);

	useEffect(() => {
		setCards(getItem("ptcg-cards", []) as PTCGCard[]);
	}, []);

	useEffect(() => {
		const temp: PTCGCard[] = [];
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
				<Link href="/editor/ptcg" className="btn btn-secondary">Back to Editor</Link>
				<button className="btn btn-primary" onClick={() => {
					window.print();
				}}>Print</button>
			</div>
		</div>
		<div className="custom-divider"/>
		<div className="card-print">
			{
				allCards.map((card, index) => {
					return <PTCGCardObject card={card} isBlackWhite={true} key={index}/>
				})
			}
		</div>
	</div>)
}