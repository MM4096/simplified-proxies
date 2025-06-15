"use client";

import "../../styles/editor.css";
import "../../styles/card/card.css";
import "../../styles/card/mtg-card.css";
import {Card, CardList} from "@/app/editor/components/cardList";
import {FormEvent, useEffect, useState} from "react";
import {MtgCard} from "@/app/editor/components/cards/mtgCard";
import {renderToStaticMarkup} from "react-dom/server";

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

	const [previewCard, setPreviewCard] = useState<MTGCard | null>({} as MTGCard);

	function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const jsonData = Object.fromEntries(formData.entries());

		if (editingIndex !== null) {
			setCards([...cards.slice(0, editingIndex), jsonData as MTGCard, ...cards.slice(editingIndex + 1)]);
		} else {
			setCards([...cards, jsonData as MTGCard]);
		}
		setEditingIndex(null);
	}

	// update preview card when form changed
	useEffect(() => {
		const form = document.querySelector<HTMLFormElement>("form");
		if (form) {
			form.addEventListener("change", (e) => {
				const target = e.target as HTMLInputElement | HTMLTextAreaElement;
				if (target && target.name && previewCard !== undefined) {

					const previewCopy: Record<string, unknown> = {...previewCard};
					const targetName = target.name as keyof MTGCard;
					previewCopy[targetName] = target.value;

					setPreviewCard(previewCopy as MTGCard);
				}
			})
		}
	}, [previewCard]);

	// update preview view when previewCard updated
	useEffect(() => {
		const previewElem = document.getElementById("card-container");
		if (previewElem) {
			previewElem.innerHTML = renderToStaticMarkup(<MtgCard card={previewCard || {}} isBlackWhite={true}/>);
		}
	}, [previewCard]);

	// whenever a new card is selected
	useEffect(() => {
		const thisCard = (editingIndex !== null && editingIndex >= 0 && editingIndex < cards.length) ? cards[editingIndex] : {};

		const elems: Array<HTMLInputElement | HTMLTextAreaElement> = [];

		const inputElems = document.querySelectorAll<HTMLInputElement>(".input-container input");
		const textareaElems = document.querySelectorAll<HTMLTextAreaElement>(".input-container textarea");
		elems.push(...inputElems);
		elems.push(...textareaElems);

		elems.forEach((elem) => {
			elem.value = (thisCard[elem.name as keyof MTGCard] || "").toString();
		});

		setPreviewCard(thisCard);

	}, [editingIndex, cards]);

	return (<div className="main-container">
		<h1>Simplified Proxies: <i>Magic: The Gathering</i> editor</h1>
		<div className="main-wrapper">

			<form className="input-container max-h-full overflow-y-auto" onSubmit={onSubmit}>
				<h2 className="custom-divider">Details</h2>

				<div className="flex flex-col gap-2 overflow-y-auto grow">
					<fieldset className="fieldset">
						<legend className="fieldset-legend">Card Name</legend>
						<input type="text" placeholder="Sakura Tribe-Elder" name="card_name" className="input"/>
					</fieldset>

					<fieldset className="fieldset">
						<legend className="fieldset-legend">Mana Cost</legend>
						<input type="text" placeholder="{1}{g}" name="mana_cost" className="input"/>
					</fieldset>

					<fieldset className="fieldset">
						<legend className="fieldset-legend">Type Line</legend>
						<input type="text" placeholder="Creature {-} Snake Shaman" name="type_line" className="input"/>
					</fieldset>

					<fieldset className="fieldset">
						<legend className="fieldset-legend">Card Text</legend>
						<textarea
							placeholder="Sacrifice this creature: Search your library for a basic land card, put that card onto the battlefield tapped, then shuffle."
							name="card_text" className="textarea"></textarea>
					</fieldset>

					<fieldset className="fieldset">
						<legend className="fieldset-legend">Flavor Text</legend>
						<textarea
							placeholder="There were no tombstones in orochi territory. Slain warriors were buried with a tree sapling, so they would become a part of the forest after death."
							name="flavor_text" className="textarea"></textarea>
					</fieldset>

					<fieldset className="fieldset w-full">
						<legend className="fieldset-legend">Power / Toughness</legend>
						<div className="flex flex-row gap-2">
							<input type="text" name="power"
								   className="input grow"/>
							<input type="text" name="toughness"
								   className="input grow"/>
						</div>
						<p className="label text-wrap">These can be omitted for non-creatures like lands.<br/>If
							planeswalker
							loyalty is desired, setting only Power will work.</p>
					</fieldset>

					<div className="collapse bg-base-100 border flex-none">
						<input type="checkbox"/>
						<div className="collapse-title">Dual-Faced Cards</div>
						<div className="collapse-content">
							<fieldset className="fieldset">
								<legend className="fieldset-legend">Reverse Name</legend>
								<input name="reverse_card_name" className="input"/>
							</fieldset>
							<fieldset className="fieldset">
								<legend className="fieldset-legend">Reverse Mana Cost</legend>
								<input name="reverse_mana_cost" className="input"/>
							</fieldset>
							<fieldset className="fieldset">
								<legend className="fieldset-legend">Reverse Type Line</legend>
								<input name="reverse_type_line" className="input"/>
							</fieldset>
							<fieldset className="fieldset">
								<legend className="fieldset-legend">Reverse Text</legend>
								<textarea name="reverse_text" className="textarea"></textarea>
							</fieldset>

							<fieldset className="fieldset">
								<legend className="fieldset-legend">Reverse Power / Toughness</legend>
								<div className="flex flex-row gap-2">
									<input type="text" name="reverse_power"
										   className="input"/>
									<input type="text" name="reverse_toughness"
										   className="input"/>
								</div>
							</fieldset>
						</div>
					</div>

					<fieldset className="fieldset">
						<legend className="fieldset-legend">Notes</legend>
						<input type="text" name="notes" placeholder=""
							   className="input"/>
					</fieldset>
				</div>

				<div className="flex flex-row gap-2 w-full">
					<button className="btn btn-primary">{
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

			</form>

			<CardList cards={cards} setCards={setCards} editingIndex={editingIndex} setEditingIndex={setEditingIndex}/>

			<div className="card-preview">
				<h2 className="custom-divider">Preview</h2>
				<br/>
				<div id="card-container" className="w-full h-full">
					<div className="card">
						<p>Text</p>
						<div className="card-divider"/>
					</div>
				</div>
			</div>

		</div>
	</div>)
}