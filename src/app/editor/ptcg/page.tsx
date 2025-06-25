"use client";

import "../../styles/editor.css";
import "../../styles/card/card.css";
import "../../styles/card/ptcg-card.css";
import {Card, CardList} from "@/app/editor/components/cardList";
import {useEffect, useState} from "react";
import {AttacksAbilitiesList} from "@/app/editor/ptcg/components/attacksAbilitiesList";
import {PTCGInput} from "@/app/editor/components/inputs";
import Link from "next/link";
import {ImportPTCG} from "@/app/editor/ptcg/components/import";
import {getItem, setItem} from "@/lib/storage";
import {renderToStaticMarkup} from "react-dom/server";
import {PTCGCardObject} from "@/app/editor/components/cards/ptcgCardObject";

export interface PTCGCard extends Card {
	card_type?: string,
	additional_rules?: string,
	attacks_abilities?: AttackOrAbility[],

	pokemon_hp?: string,
	pokemon_evolution_level?: string,
	pokemon_evolves_from?: string,
	pokemon_weakness?: string,
	pokemon_resistance?: string,
	pokemon_retreat_cost?: string,
	pokemon_type?: string,
}

export interface AttackOrAbility {
	name?: string,
	text?: string,
	cost?: string,
	damage?: string,
}

export default function PTCGEditorPage() {
	const [cards, setCards] = useState<PTCGCard[]>([]);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [tempCard, setTempCard] = useState<PTCGCard>({} as PTCGCard);

	const [editingAttacksAndAbilities, setEditingAttacksAndAbilities] = useState<Array<AttackOrAbility>>([]);

	const [activeTabName, setActiveTabName] = useState<"input" | "list" | "preview" | "options">("input");

	function changeVal(key: string, value: string) {
		setTempCard({...tempCard, [key as keyof PTCGCard]: value});
	}

	// either saves or creates the card
	function saveChanges() {
		const tempCardCopy = {...tempCard};
		tempCardCopy.attacks_abilities = editingAttacksAndAbilities;
		if (editingIndex !== null) {
			setCards([...cards.slice(0, editingIndex), tempCardCopy, ...cards.slice(editingIndex + 1)]);
		} else {
			setCards([...cards, tempCardCopy]);
		}
		setTempCard({} as PTCGCard);
		setEditingIndex(null);
	}

	// get cards
	useEffect(() => {
		setCards(getItem("ptcg-cards", []) as PTCGCard[]);
	}, []);

	// update cards
	useEffect(() => {
		if (cards.length == 0) {
			return;
		}
		setItem("ptcg-cards", cards);
	}, [cards]);

	useEffect(() => {
		if (editingIndex !== null && editingIndex >= 0 && editingIndex < cards.length) {
			setTempCard(cards[editingIndex]);
			setEditingAttacksAndAbilities(cards[editingIndex].attacks_abilities || []);
		} else {
			setTempCard({} as PTCGCard);
			setEditingAttacksAndAbilities([]);
		}
	}, [cards, editingIndex]);

	// update preview card
	useEffect(() => {
		const previewElem = document.getElementById("card-container");
		if (previewElem) {
			previewElem.innerHTML = renderToStaticMarkup(<PTCGCardObject card={tempCard || {}} isBlackWhite={true}/>);
		}
	}, [tempCard]);

	return (<div className="main-container">
		<h1 className="small-hidden">Simplified Proxies: <i>Pokémon Trading Card Game</i> editor</h1>
		<div className="main-wrapper">

			<div className={`input-container h-full overflow-y-auto ${activeTabName === "input" ? "active-tab" : ""}`}>
				<h2 className="custom-divider">Details</h2>

				<div className="flex flex-col gap-2 overflow-y-auto grow">

					<PTCGInput card={tempCard} valKey="card_name" setValue={changeVal} title="Card Name"
							   placeholder="Pikachu ex"/>

					<PTCGInput card={tempCard} valKey="card_type" setValue={changeVal} title="Card Type"
							   placeholder="Pokemon"/>

					<AttacksAbilitiesList attacksAndAbilities={editingAttacksAndAbilities}
										  setAttacksAndAbilities={setEditingAttacksAndAbilities}/>

					<PTCGInput card={tempCard} valKey="card_text" setValue={changeVal} title="Card Text"
							   placeholder="Heal 30 damage from one of your Pokemon"
							   isTextarea={true}/>

					<PTCGInput card={tempCard} valKey="additional_rules" setValue={changeVal} title="Additional Rules"
							   placeholder="Pokemon ex rule: When your Pokemon ex is Knocked Out, your opponent takes 2 Prize cards."
							   isTextarea={true}/>

					<div className="collapse bg-base-100 border flex-none">
						<input type="checkbox"/>
						<div className="collapse-title">Pokemon Options</div>
						<div className="collapse-content">

							<PTCGInput card={tempCard} valKey="pokemon_hp" setValue={changeVal} title="HP"
									   placeholder="190"/>

							<PTCGInput card={tempCard} valKey="pokemon_evolution_level" setValue={changeVal}
									   title="Evolution Level" placeholder="Basic"/>

							<PTCGInput card={tempCard} valKey="pokemon_evolves_from" setValue={changeVal}
									   title="Evolves From" placeholder="N/A"/>

							<PTCGInput card={tempCard} valKey="pokemon_weakness" setValue={changeVal} title="Weakness"
									   placeholder="{f} x2"/>

							<PTCGInput card={tempCard} valKey="pokemon_resistance" setValue={changeVal}
									   title="Resistance" placeholder=""/>

							<PTCGInput card={tempCard} valKey="pokemon_retreat_cost" setValue={changeVal}
									   title="Retreat Cost" placeholder="3"/>

							<PTCGInput card={tempCard} valKey="pokemon_type" setValue={changeVal}
									   title="Pokemon Type" placeholder="{p}"/>
						</div>

					</div>
				</div>

				<div className="flex flex-row gap-2 w-full">
					<button className="btn btn-primary" onClick={saveChanges}>{
						editingIndex !== null ? "Update Card" : "Add Card"
					}</button>
					{
						(editingIndex !== null) && (<>
							<button className="btn btn-secondary" onClick={() => {
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

				<ImportPTCG cards={cards} setCardsAction={setCards}/>
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
			<Link className="btn btn-primary" href="/editor/ptcg/print">Preview and Print Proxies</Link>
			<ImportPTCG cards={cards} setCardsAction={setCards}/>
		</div>
	</div>)
}