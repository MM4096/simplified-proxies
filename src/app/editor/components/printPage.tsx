"use client";

import {useEffect, useState} from "react";
import {Card} from "@/app/editor/components/cardList";
import Link from "next/link";
import {HideCreditBox} from "@/app/editor/components/hideCreditBox";
import {MTGCardObject} from "@/app/editor/components/cards/mtgCardObject";
import {PTCGCardObject} from "@/app/editor/components/cards/ptcgCardObject";

/**
 * A generic template for all editor pages
 */
export function PrintPage({gameId, gameLocalStorageKey,}: {
	gameLocalStorageKey: string,
	gameId: "mtg" | "ptcg",
}) {
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const [cards, setCards] = useState<Card[]>([]);
	const [showCredit, setShowCredit] = useState<boolean>(true);
	const [allCards, setAllCards] = useState<Card[]>([]);
	const [project, setProject] = useState<string | null>(null);

	const [useGap, setUseGap] = useState<boolean>(true);

	function getProjectNames() {
		let retProjects: string[] = [];
		try {
			const projectsStorage = JSON.parse(localStorage.getItem(gameLocalStorageKey) || "{}");
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
		const projectStorage = JSON.parse(localStorage.getItem(gameLocalStorageKey) || "{}");
		if (project) {
			setCards(projectStorage[project] || []);
		} else {
			setCards(projectStorage["UNSAVED"] || []);
		}

	}, [gameLocalStorageKey, project]);

	useEffect(() => {
		const temp: Card[] = [];

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
				<Link href={`/editor/${gameId}`} className="btn btn-secondary">Back to Editor</Link>
				<button className="btn btn-primary" onClick={() => {
					window.print();
				}}>Print
				</button>
				<div className="flex flex-row gap-2 items-center ml-3">
					<span>Project:</span>
					{
						isMounted && (<select className="select" value={project || ""} onChange={(e) => {
							setProject(e.target.value);
						}}>
							{
								getProjectNames().map((project) => {
									return <option key={project}
												   value={project === "UNSAVED" ? "" : project}>{project}</option>
								})
							}
						</select>)
					}
				</div>
				<HideCreditBox showCredit={showCredit} setShowCreditAction={setShowCredit}/>
				<div className="divider divider-horizontal"/>
				<label className="label">
					<input type="checkbox" className="checkbox" checked={useGap} onChange={(e) => setUseGap(e.target.checked)}/>
					Gap between cards
				</label>
			</div>
		</div>
		<div className="custom-divider"/>
		<div className={`card-print ${useGap ? "gap" : ""}`}>
			{
				allCards.map((card, index) => {
					switch (gameId) {
						case "mtg":
							return <MTGCardObject card={card} isBlackWhite={true} key={index}
												  includeCredit={showCredit}/>
						case "ptcg":
							return <PTCGCardObject card={card} isBlackWhite={true} key={index}
												   includeCredit={showCredit}/>
						default:
							return <p className="text-error" key={index}>ERR_GAMEID_MISMATCH (Error code 1)</p>
					}
				})
			}
		</div>
	</div>)
}