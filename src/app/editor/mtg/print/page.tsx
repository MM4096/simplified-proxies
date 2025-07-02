"use client";

import "../../../styles/editor.css"
import "../../../styles/print.css"
import "../../../styles/card/card.css"
import "../../../styles/card/mtg-card.css"

import {useEffect, useState} from "react";
import {MTGCard} from "@/app/editor/mtg/page";
import {getItem} from "@/lib/storage";
import Link from "next/link";
import {MTGCardObject} from "@/app/editor/components/cards/mtgCardObject";
import {HideCreditBox} from "@/app/editor/components/hideCreditBox";

export default function MTGPrintPage() {
	const [isMounted, setIsMounted] = useState<boolean>(false);

	const [cards, setCards] = useState<MTGCard[]>([]);

	const [showCredit, setShowCredit] = useState<boolean>(true);

	const [allCards, setAllCards] = useState<MTGCard[]>([]);

	const [project, setProject] = useState<string | null>(null);

	function getProjectNames() {
		let retProjects: string[] = [];
		try {
			const projectsStorage = JSON.parse(localStorage.getItem("mtg-cards") || "{}");
			if (!Array.isArray(projectsStorage)) {
				retProjects = Object.keys(projectsStorage);
			}
		} catch {
		}
		return retProjects.sort() as string[];
	}

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		const projectStorage = JSON.parse(localStorage.getItem("mtg-cards") || "{}");
		if (project) {
			setCards(projectStorage[project] || []);
		} else {
			setCards(projectStorage["UNSAVED"] || []);
		}

	}, [project]);

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
			<div className="flex flex-row gap-2 items-center">
				<Link href="/editor/mtg" className="btn btn-secondary">Back to Editor</Link>
				<button className="btn btn-primary" onClick={() => {
					window.print();
				}}>Print</button>
				<div className="flex flex-row gap-2 items-center ml-3">
					<span>Project:</span>
					{
						isMounted && (<select className="select" value={project || ""} onChange={(e) => {
							setProject(e.target.value);
						}}>
							{
								getProjectNames().map((project) => {
									return <option key={project} value={project === "UNSAVED" ? "" : project}>{project}</option>
								})
							}
						</select>)
					}
				</div>
				<HideCreditBox showCredit={showCredit} setShowCreditAction={setShowCredit}/>
			</div>
		</div>
		<div className="custom-divider"/>
		<div className="card-print">
			{
				allCards.map((card, index) => {
					return <MTGCardObject card={card} isBlackWhite={true} key={index} includeCredit={showCredit}/>
				})
			}
		</div>
	</div>)
}